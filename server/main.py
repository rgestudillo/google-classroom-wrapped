import statistics
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can put your specific domain instead of "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_class_data(class_data: Dict[str, Any]) -> Dict[str, Any]:
    # Extract basic course info
    course_name = class_data.get("name", "Unknown Course")
    section = class_data.get("section", "Unknown Section")
    subject = class_data.get("subject", "Unknown Subject")
    posts = class_data.get("posts", [])

    # Gather assignments from posts
    assignments = []
    for post in posts:
        cw = post.get("courseWork")
        if cw:
            assignments.append(cw)

    # Count how many posts and assignments
    total_posts = len(posts)
    total_assignments = len(assignments)

    # Analyze assignments by category and compute average grades
    category_grades = {}  # {category_name: [grades]}
    assignment_info = []  # To track individual assignment stats

    for cw in assignments:
        title = cw.get("title", "Untitled")
        max_points = cw.get("maxPoints", 0)
        category = cw.get("gradeCategory", {}).get("name", "Uncategorized")
        submissions = cw.get("submissions", [])

        # Extract assigned grades
        grades = [sub.get("assignedGrade") for sub in submissions if sub.get("assignedGrade") is not None]

        # Store grades in category mapping
        if category not in category_grades:
            category_grades[category] = []
        category_grades[category].extend(grades)

        avg_grade = statistics.mean(grades) if grades else None

        assignment_info.append({
            "title": title,
            "category": category,
            "max_points": max_points,
            "avg_grade": avg_grade
        })

    # Compute overall averages per category
    category_averages = {}
    for cat, grads in category_grades.items():
        category_averages[cat] = statistics.mean(grads) if grads else None

    # Find top-scoring and lowest-scoring assignments
    graded_assignments = [a for a in assignment_info if a["avg_grade"] is not None]
    if graded_assignments:
        top_assignment = max(graded_assignments, key=lambda x: x["avg_grade"])
        low_assignment = min(graded_assignments, key=lambda x: x["avg_grade"])
    else:
        top_assignment = None
        low_assignment = None

    # Construct a wrapped summary as a dictionary
    wrapped_summary = {
        "courseName": course_name,
        "section": section,
        "subject": subject,
        "totalPosts": total_posts,
        "totalAssignments": total_assignments,
        "categoryAverages": category_averages,
        "topAssignment": top_assignment,
        "lowestAssignment": low_assignment
    }

    return wrapped_summary

@app.post("/wrapped")
def get_wrapped(classes: List[Dict[str, Any]] = Body(...)):
    # classes is a list of class_data JSON objects
    results = []
    for class_data in classes:
        summary = analyze_class_data(class_data)
        results.append(summary)

    return results
