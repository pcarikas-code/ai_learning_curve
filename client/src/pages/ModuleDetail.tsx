import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ModuleNotes } from "@/components/ModuleNotes";
import { Quiz } from "@/components/Quiz";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Bookmark, BookmarkCheck, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Streamdown } from "streamdown";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

export default function ModuleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useUtils();
  
  const { data: module, isLoading } = trpc.modules.getBySlug.useQuery({ slug: slug || "" });
  const { data: progress } = trpc.progress.get.useQuery(
    { moduleId: module?.id || 0 },
    { enabled: !!module?.id && isAuthenticated }
  );
  const { data: isBookmarked } = trpc.bookmarks.check.useQuery(
    { itemType: "module", itemId: module?.id || 0 },
    { enabled: !!module?.id && isAuthenticated }
  );

  const updateProgress = trpc.progress.update.useMutation({
    onSuccess: () => {
      utils.progress.get.invalidate();
      utils.progress.getAll.invalidate();
    },
  });

  const addBookmark = trpc.bookmarks.add.useMutation({
    onSuccess: () => {
      utils.bookmarks.check.invalidate();
      toast.success("Module bookmarked!");
    },
  });

  const removeBookmark = trpc.bookmarks.remove.useMutation({
    onSuccess: () => {
      utils.bookmarks.check.invalidate();
      toast.success("Bookmark removed");
    },
  });

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (module && isAuthenticated && !hasStarted && !progress) {
      setHasStarted(true);
      updateProgress.mutate({
        moduleId: module.id,
        status: "in_progress",
        progressPercent: 0,
      });
    }
  }, [module, isAuthenticated, progress, hasStarted]);

  const handleComplete = () => {
    if (!module) return;
    
    updateProgress.mutate({
      moduleId: module.id,
      status: "completed",
      progressPercent: 100,
      completedAt: new Date(),
    });
    
    toast.success("Module completed! 🎉");
  };

  const handleToggleBookmark = () => {
    if (!module) return;
    
    if (isBookmarked) {
      removeBookmark.mutate({ itemType: "module", itemId: module.id });
    } else {
      addBookmark.mutate({ itemType: "module", itemId: module.id });
    }
  };

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Module Not Found</h1>
          <p className="text-muted-foreground mb-4">The module you're looking for doesn't exist.</p>
          <Link href="/paths">
            <Button>Browse Learning Paths</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = progress?.status === "completed";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Module Content */}
      <article className="py-12">
        <div className="container max-w-4xl">
          {module && (
            <Breadcrumb
              items={[
                { label: "Learning Paths", href: "/paths" },
                { label: "Path", href: `/paths/${module.pathId}` },
                { label: module.title },
              ]}
            />
          )}
          {/* Module Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{module.title}</h1>
            {module.description && (
              <p className="text-xl text-muted-foreground mb-6">{module.description}</p>
            )}
            
            <div className="flex items-center gap-4 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[module.difficulty]}`}>
                {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
              </span>
              {module.estimatedMinutes && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{module.estimatedMinutes} minutes</span>
                </div>
              )}
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>

            {isAuthenticated && progress && !isCompleted && (
              <div className="mt-6 p-4 bg-card rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Progress</span>
                  <span className="text-sm text-muted-foreground">{progress.progressPercent}%</span>
                </div>
                <Progress value={progress.progressPercent} className="h-2" />
              </div>
            )}
          </div>

          {/* Module Content */}
          <Card className="mb-8">
            <CardContent className="prose prose-slate dark:prose-invert max-w-none pt-6">
              <Streamdown>{module.content}</Streamdown>
            </CardContent>
          </Card>

          {/* Module Notes */}
          {isAuthenticated && (
            <div className="mb-8">
              <ModuleNotes moduleId={module.id} />
            </div>
          )}

          {/* Quiz Section */}
          <div className="mb-8">
            <Quiz moduleId={module.id} />
          </div>

          {/* Action Buttons */}
          {isAuthenticated && !isCompleted && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={updateProgress.isPending}
                className="gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark as Complete
              </Button>
            </div>
          )}

          {!isAuthenticated && (
            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200 dark:border-cyan-800">
              <CardContent className="py-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Sign in to track your progress</h3>
                <p className="text-muted-foreground mb-4">
                  Create an account to save your progress, take quizzes, and earn certificates.
                </p>
                <a href={getLoginUrl()}>
                  <Button size="lg">Sign In</Button>
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
}
