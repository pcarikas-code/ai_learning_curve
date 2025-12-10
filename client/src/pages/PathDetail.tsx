import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useProgress } from "@/hooks/useProgress";
import { ArrowRight, BookOpen, CheckCircle2, Circle, Clock } from "lucide-react";
import { Link, useParams } from "wouter";

export default function PathDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isModuleCompleted, enrollInPath, isEnrolledInPath } = useProgress();
  
  const { data: path, isLoading: pathLoading } = trpc.learningPaths.getBySlug.useQuery({ slug: slug || "" });
  const { data: modules, isLoading: modulesLoading } = trpc.modules.getByPathId.useQuery(
    { pathId: path?.id || 0 },
    { enabled: !!path?.id }
  );

  const handleEnroll = () => {
    if (!path?.id) return;
    enrollInPath(path.id);
    toast.success("Enrolled successfully!");
  };

  const completedModules = modules?.filter((m) => isModuleCompleted(m.id)).length || 0;
  const totalModules = modules?.length || 0;
  const progressPercent = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  const isEnrolled = path?.id ? isEnrolledInPath(path.id) : false;

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
      <Navigation />

      {/* Path Content */}
      <div className="py-12">
        <div className="container max-w-5xl">
          <Breadcrumb
            items={[
              { label: "Learning Paths", href: "/paths" },
              { label: path.title },
            ]}
          />

          {/* Path Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{path.title}</h1>
            {path.description && (
              <p className="text-xl text-muted-foreground mb-6">{path.description}</p>
            )}
            
            <div className="flex items-center gap-4 flex-wrap mb-6">
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

            {!isEnrolled && (
              <Button size="lg" onClick={handleEnroll} className="gap-2">
                Enroll in This Path <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {isEnrolled && totalModules > 0 && (
              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200 dark:border-cyan-800">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Your Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedModules} / {totalModules} modules
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  {progressPercent === 100 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                      🎉 Congratulations! You've completed this path!
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Modules List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Modules</h2>
            {modulesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !modules || modules.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No modules available for this path yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => {
                  const completed = isModuleCompleted(module.id);
                  return (
                    <Card key={module.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                              )}
                              <CardTitle className="text-lg">
                                {index + 1}. {module.title}
                              </CardTitle>
                            </div>
                            {module.description && (
                              <CardDescription className="ml-8">{module.description}</CardDescription>
                            )}
                          </div>
                          <Link href={`/modules/${module.slug}`}>
                            <Button variant={completed ? "outline" : "default"} size="sm">
                              {completed ? "Review" : "Start"}
                            </Button>
                          </Link>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
