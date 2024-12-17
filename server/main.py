import statistics
from typing import List, Dict, Any
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins (adjust if needed)
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

    # Compute category averages
    category_averages = {cat: (statistics.mean(grads) if grads else None) for cat, grads in category_grades.items()}

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

    category_averages_collection = {}
    all_assignments = []
    for r in results:
        for cat, avg in r["categoryAverages"].items():
            if avg is not None:
                category_averages_collection.setdefault(cat, []).append(avg)
        for a in r["assignmentInfo"]:
            if a["avg_grade"] is not None:
                all_assignments.append(a)

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
        "lowestAssignment": global_low,
        "allAssignments": all_assignments
    }

def compute_student_persona(results: List[Dict[str, Any]], overall: Dict[str, Any]) -> Dict[str, Any]:
    all_assignments = overall["allAssignments"]
    total_assignments = len(all_assignments)
    if total_assignments == 0:
        return {
            "overallAverageGrade": None,
            "onTimeRatio": 0,
            "persona": "No assignments found. Not enough data to determine persona."
        }

    all_grades = [a["avg_grade"] for a in all_assignments if a["avg_grade"] is not None]
    overall_avg_grade = statistics.mean(all_grades) if all_grades else None

    completed_assignments = sum(1 for a in all_assignments if a["submissions"])
    on_time_ratio = completed_assignments / total_assignments if total_assignments > 0 else 0

    # Persona logic
    if overall_avg_grade is None:
        persona = "No graded submissions yet. Keep going!"
    else:
        if overall_avg_grade >= 90:
            if on_time_ratio > 0.8:
                persona = "Diligent High-Achiever: You excel in quality and punctuality!"
            else:
                persona = "Capable but Procrastinator: Great grades, but try to submit more punctually."
        elif overall_avg_grade >= 80:
            if on_time_ratio > 0.8:
                persona = "Consistent and Dependable: Solid grades and on-time submissions."
            else:
                persona = "Talented but Occasionally Late: Strong performance, but watch out for missed deadlines."
        elif overall_avg_grade >= 70:
            if on_time_ratio > 0.8:
                persona = "Hardworking but Needs Improvement: You put in effort on time, focus on improving understanding."
            else:
                persona = "Average Performer: Work on both your understanding and submission habits."
        else:
            if on_time_ratio > 0.8:
                persona = "Dedicated but Struggling: You're trying on time, but need more study or practice."
            else:
                persona = "Needs Improvement: Low grades and spotty submission habits. Step up your game!"

    return {
        "overallAverageGrade": overall_avg_grade,
        "onTimeRatio": on_time_ratio,
        "persona": persona
    }

def get_highlighted_assignments(overall: Dict[str, Any], top_n=3):
    all_assignments = overall.get("allAssignments", [])
    if not all_assignments:
        return {
            "topAssignments": [],
            "lowestAssignments": []
        }

    sorted_by_grade = sorted([a for a in all_assignments if a["avg_grade"] is not None],
                             key=lambda x: x["avg_grade"], reverse=True)

    top_assignments = sorted_by_grade[:top_n]
    lowest_assignments = sorted_by_grade[-top_n:] if len(sorted_by_grade) >= top_n else sorted_by_grade[::-1]

    return {
        "topAssignments": top_assignments,
        "lowestAssignments": lowest_assignments
    }

def category_strengths(overall: Dict[str, Any]) -> Dict[str, Any]:
    cat_avgs = {k: v for k, v in overall.get("categoryAverages", {}).items() if v is not None}
    if not cat_avgs:
        return {}

    best_category = max(cat_avgs, key=cat_avgs.get)
    worst_category = min(cat_avgs, key=cat_avgs.get)

    return {
        "bestCategory": best_category,
        "bestCategoryAvg": cat_avgs[best_category],
        "worstCategory": worst_category,
        "worstCategoryAvg": cat_avgs[worst_category]
    }

@app.post("/wrapped")
def get_wrapped(classes: List[Dict[str, Any]] = Body(...)):
    results = [analyze_class_data(c) for c in classes]

    overall = aggregate_overall(results)
    persona_info = compute_student_persona(results, overall)
    highlights = get_highlighted_assignments(overall, top_n=3)
    cat_info = category_strengths(overall)

    total_assignments = overall["totalAssignments"]
    completed_assignments = sum(1 for a in overall["allAssignments"] if a["submissions"])

    narrative = []
    if total_assignments > 0:
        narrative.append(f"You tackled a total of {total_assignments} assignments across all your classes.")
        narrative.append(f"You completed {completed_assignments} of them, giving you a completion rate of {(completed_assignments/total_assignments)*100:.1f}%.")

    if persona_info["overallAverageGrade"] is not None:
        narrative.append(f"Your overall average grade across all assignments is {persona_info['overallAverageGrade']:.2f}%.")
    else:
        narrative.append("You have not received any grades yet. Keep working!")

    if cat_info:
        narrative.append(f"Your strongest category overall was '{cat_info['bestCategory']}' with an average of {cat_info['bestCategoryAvg']:.2f}%.")
        narrative.append(f"You can focus more on '{cat_info['worstCategory']}' where you averaged {cat_info['worstCategoryAvg']:.2f}%.")

    narrative.append(f"Based on your performance and submission habits, we’d say you are: {persona_info['persona']}")

    return {
        "classes": results,
        "overall": {
            "totalPosts": overall["totalPosts"],
            "totalAssignments": overall["totalAssignments"],
            "categoryAverages": overall["categoryAverages"],
            "topAssignment": overall["topAssignment"],
            "lowestAssignment": overall["lowestAssignment"]
        },
        "studentProfile": {
            **persona_info,
            "highlightedAssignments": highlights,
            "categoryInsights": cat_info,
            "narrative": narrative
        }
    }
