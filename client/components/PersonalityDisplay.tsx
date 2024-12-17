import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

export default function PersonalityDisplay({ studentProfile }: { studentProfile: any }) {
    const {
        overallAverageGrade,
        onTimeRatio,
        persona,
        highlightedAssignments,
        categoryInsights,
        narrative,
    } = studentProfile;

    const topAssignments = highlightedAssignments?.topAssignments ?? [];
    const lowestAssignments = highlightedAssignments?.lowestAssignments ?? [];

    return (
        <div className="space-y-8">
            {/* Academic Persona Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Academic Persona</CardTitle>
                    <CardDescription>
                        A snapshot of how you're doing academically.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div>
                            <h3 className="text-lg font-semibold">Persona</h3>
                            <p>{persona}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Overall Average Grade</h3>
                            <p className="text-2xl font-bold">{overallAverageGrade ? `${overallAverageGrade.toFixed(2)}%` : "N/A"}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">On-Time Ratio</h3>
                            <p className="text-2xl font-bold">{(onTimeRatio * 100).toFixed(1)}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Category Insights */}
            {categoryInsights && (
                <Card>
                    <CardHeader>
                        <CardTitle>Category Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">Best Category:</h4>
                            <Badge variant="outline">{categoryInsights.bestCategory} ({categoryInsights.bestCategoryAvg.toFixed(2)}%)</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">Needs Improvement:</h4>
                            <Badge variant="destructive">{categoryInsights.worstCategory} ({categoryInsights.worstCategoryAvg.toFixed(2)}%)</Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Narrative Section */}
            {narrative && narrative.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Academic Journey</CardTitle>
                        <CardDescription>A brief story of your performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                            {narrative.map((line: string, index: number) => (
                                <li key={index}>{line}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Highlighted Assignments */}
            {topAssignments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Assignments</CardTitle>
                        <CardDescription>Your highest scoring tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Max Points</TableHead>
                                    <TableHead>Avg Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topAssignments.map((assignment: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell>{assignment.title}</TableCell>
                                        <TableCell>{assignment.category}</TableCell>
                                        <TableCell>{assignment.max_points}</TableCell>
                                        <TableCell>{assignment.avg_grade.toFixed(2)}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {lowestAssignments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Assignments for Improvement</CardTitle>
                        <CardDescription>These could use a bit more attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Max Points</TableHead>
                                    <TableHead>Avg Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lowestAssignments.map((assignment: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell>{assignment.title}</TableCell>
                                        <TableCell>{assignment.category}</TableCell>
                                        <TableCell>{assignment.max_points}</TableCell>
                                        <TableCell>{assignment.avg_grade.toFixed(2)}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
