import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpen, CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";
import { Link, useParams } from "wouter";

export default function PathDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  
  const { data: path, isLoading: pathLoading } = trpc.learningPaths.getBySlug.useQuery({ slug: slug || "" });
  const { data: modules, isLoading: modulesLoading } = trpc.modules.getByPathId.useQuery(
    { pathId: path?.id || 0 },
    { enabled: !!path?.id }
  );
  const { data: userProgress } = trpc.progress.getAll.useQuery(undefined, { enabled: isAuthenticated });

  const getModuleProgress = (moduleId: number) => {
    if (!userProgress) return null;
    return userProgress.find((p) => p.moduleId === moduleId);
  };

  const completedModules = modules?.filter((m) => {
    const progress = getModuleProgress(m.id);
    return progress?.status === "completed";
  }).length || 0;

  const totalModules = modules?.length || 0;
  const progressPercent = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  if (pathLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Path Not Found</h1>
          <p className="text-muted-foreground mb-4">The learning path you're looking for doesn't exist.</p>
          <Link href="/paths">
            <Button>Browse All Paths</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/logo.png" alt="AI Learning Curve" className="h-12" />
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/paths">
                <Button variant="ghost">Learning Paths</Button>
              </Link>
              <Link href="/resources">
                <Button variant="ghost">Resources</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Path Header */}
      <section className="py-12 bg-gradient-to-br from-cyan-50 via-blue-50 to-background dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-background">
        <div className="container">
          <div className="max-w-4xl">
            <Link href="/paths">
              <Button variant="ghost" className="mb-4 -ml-4">
                ← Back to Paths
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{path.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{path.description}</p>
            
            <div className="flex items-center gap-4 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[path.difficulty]}`}>
                {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
              </span>
              {path.estimatedHours && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{path.estimatedHours} hours</span>
                </div>
              )}
              {totalModules > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>{totalModules} modules</span>
                </div>
              )}
            </div>

            {isAuthenticated && totalModules > 0 && (
              <div className="mt-6 p-4 bg-card rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedModules} / {totalModules} modules completed
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modules List */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Course Modules</h2>
            
            {modulesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : modules && modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module, index) => {
                  const progress = getModuleProgress(module.id);
                  const isCompleted = progress?.status === "completed";
                  const isInProgress = progress?.status === "in_progress";
                  
                  return (
                    <Card key={module.id} className="hover:shadow-md transition-all group">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {isCompleted ? (
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                              <Circle className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-muted-foreground">Module {index + 1}</span>
                              {isInProgress && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  In Progress
                                </span>
                              )}
                            </div>
                            <CardTitle className="group-hover:text-primary transition-colors">{module.title}</CardTitle>
                            <CardDescription className="mt-2">{module.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="capitalize">{module.difficulty}</span>
                            {module.estimatedMinutes && <span>• {module.estimatedMinutes} min</span>}
                          </div>
                          <Link href={`/modules/${module.slug}`}>
                            <Button variant={isCompleted ? "outline" : "default"} className="gap-2">
                              {isCompleted ? "Review" : isInProgress ? "Continue" : "Start"} <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No modules available yet. Check back soon!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
