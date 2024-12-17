import statistics
from typing import List, Dict, Any
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_class_data(class_data: Dict[str, Any]) -> Dict[str, Any]:
    course_name = class_data.get("name", "Unknown Course")
    section = class_data.get("section", "Unknown Section")
    subject = class_data.get("subject", "Unknown Subject")
    posts = class_data.get("posts", [])

    assignments = []
    for post in posts:
        cw = post.get("courseWork")
        if cw:
            assignments.append(cw)

    total_posts = len(posts)
    total_assignments = len(assignments)

    category_grades = {}
    assignment_info = []

    for cw in assignments:
        title = cw.get("title", "Untitled")
        max_points = cw.get("maxPoints", 0)
        category = cw.get("gradeCategory", {}).get("name", "Uncategorized")
        submissions = cw.get("submissions", [])

        grades = [sub.get("assignedGrade") for sub in submissions if sub.get("assignedGrade") is not None]

        if category not in category_grades:
            category_grades[category] = []
        category_grades[category].extend(grades)

        avg_grade = statistics.mean(grades) if grades else None

        assignment_info.append({
            "title": title,
            "category": category,
            "max_points": max_points,
            "avg_grade": avg_grade,
            "submissions": submissions
        })

    category_averages = {}
    for cat, grads in category_grades.items():
        category_averages[cat] = statistics.mean(grads) if grads else None

    graded_assignments = [a for a in assignment_info if a["avg_grade"] is not None]
    if graded_assignments:
        top_assignment = max(graded_assignments, key=lambda x: x["avg_grade"])
        low_assignment = min(graded_assignments, key=lambda x: x["avg_grade"])
    else:
        top_assignment = None
        low_assignment = None

    return {
        "courseName": course_name,
        "section": section,
        "subject": subject,
        "totalPosts": total_posts,
        "totalAssignments": total_assignments,
        "categoryAverages": category_averages,
        "topAssignment": top_assignment,
        "lowestAssignment": low_assignment,
        "assignmentInfo": assignment_info
    }

def aggregate_overall(results: List[Dict[str, Any]]) -> Dict[str, Any]:
    total_posts = sum(r["totalPosts"] for r in results)
    total_assignments = sum(r["totalAssignments"] for r in results)

    # For overall averages, we only have averages, not raw grades.
    # We'll just average the averages as a rough measure.
    category_averages_collection = {}
    all_assignments = []
    for r in results:
        for cat, avg in r["categoryAverages"].items():
            if avg is not None:
                if cat not in category_averages_collection:
                    category_averages_collection[cat] = []
                category_averages_collection[cat].append(avg)

        # Collect assignments for top/lowest
        if r["topAssignment"] and r["topAssignment"].get("avg_grade") is not None:
            all_assignments.append(r["topAssignment"])
        if r["lowestAssignment"] and r["lowestAssignment"].get("avg_grade") is not None:
            all_assignments.append(r["lowestAssignment"])

    overall_category_averages = {}
    for cat, avgs in category_averages_collection.items():
        overall_category_averages[cat] = statistics.mean(avgs) if avgs else None

    if all_assignments:
        global_top = max(all_assignments, key=lambda x: x["avg_grade"])
        global_low = min(all_assignments, key=lambda x: x["avg_grade"])
    else:
        global_top = None
        global_low = None

    return {
        "totalPosts": total_posts,
        "totalAssignments": total_assignments,
        "categoryAverages": overall_category_averages,
        "topAssignment": global_top,
        "lowestAssignment": global_low
    }

def compute_student_persona(results: List[Dict[str, Any]], overall: Dict[str, Any]) -> Dict[str, Any]:
    # Compute overall average grade across all assignments from all classes
    # We have assignmentInfo in each result that contains avg_grade for each assignment.
    # Let's gather all avg_grades
    all_grades = []
    total_assignments = 0
    completed_assignments = 0

    for r in results:
        for a in r["assignmentInfo"]:
            total_assignments += 1
            if a["avg_grade"] is not None:
                all_grades.append(a["avg_grade"])
                # Check if there's at least one submission, assume completed on-time
                if a["submissions"]:
                    completed_assignments += 1

    if all_grades:
        overall_avg_grade = statistics.mean(all_grades)
    else:
        overall_avg_grade = None

    # On-time ratio (heuristic): completed_assignments / total_assignments
    on_time_ratio = completed_assignments / total_assignments if total_assignments > 0 else 0

    # Determine persona based on overall_avg_grade and on_time_ratio
    # Adjust thresholds and logic as desired
    if overall_avg_grade is None:
        # No grades at all
        persona = "No submissions found. Attend classes, submit assignments to discover your academic persona!"
    else:
        if overall_avg_grade >= 90:
            if on_time_ratio > 0.8:
                persona = "Diligent High-Achiever"
            else:
                persona = "Capable but Procrastinator"
        elif overall_avg_grade >= 80:
            if on_time_ratio > 0.8:
                persona = "Consistent and Dependable"
            else:
                persona = "Talented but Occasionally Late"
        elif overall_avg_grade >= 70:
            if on_time_ratio > 0.8:
                persona = "Hardworking but Needs Improvement"
            else:
                persona = "Average Performer, Consider Improving Time Management"
        else:
            if on_time_ratio > 0.8:
                persona = "Dedicated but Struggling Academically"
            else:
                persona = "Needs Improvement (Try to be more punctual and study more)"

    return {
        "overallAverageGrade": overall_avg_grade,
        "onTimeRatio": on_time_ratio,
        "persona": persona
    }

@app.post("/wrapped")
def get_wrapped(classes: List[Dict[str, Any]] = Body(...)):
    results = []
    for class_data in classes:
        summary = analyze_class_data(class_data)
        results.append(summary)

    overall = aggregate_overall(results)
    persona_info = compute_student_persona(results, overall)

    return {
        "classes": results,
        "overall": overall,
        "studentProfile": persona_info
    }
