import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { BookOpen, Clock, CheckCircle2, TrendingUp } from "lucide-react";

export function MyLearning() {
  const { data: enrolledPaths, isLoading } = trpc.learningPaths.getEnrolled.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Learning</CardTitle>
          <CardDescription>Your enrolled learning paths</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!enrolledPaths || enrolledPaths.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Learning</CardTitle>
          <CardDescription>Your enrolled learning paths</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">You haven't enrolled in any learning paths yet.</p>
            <Link href="/paths">
              <Button>Browse Learning Paths</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Learning</CardTitle>
        <CardDescription>Continue where you left off</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enrolledPaths.map((enrollment) => {
            const path = enrollment.path;
            if (!path) return null;

            const isCompleted = enrollment.completedAt !== null;
            const progressPercent = enrollment.progressPercent || 0;

            return (
              <div
                key={enrollment.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{path.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {path.description}
                    </p>
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className="h-6 w-6 text-green-500 ml-2 flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{path.estimatedHours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="capitalize">{path.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/paths/${path.slug}`}>
                      <Button variant="default" size="sm">
                        {isCompleted ? "Review" : "Continue Learning"}
                      </Button>
                    </Link>
                    {isCompleted && (
                      <Button variant="outline" size="sm">
                        View Certificate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
