import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Quiz } from "@/components/Quiz";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useProgress } from "@/hooks/useProgress";
import { CheckCircle2, Clock } from "lucide-react";
import { Streamdown } from "streamdown";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

export default function ModuleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isModuleCompleted, completeModule } = useProgress();
  
  const { data: module, isLoading } = trpc.modules.getBySlug.useQuery({ slug: slug || "" });

  const handleComplete = () => {
    if (!module) return;
    
    completeModule(module.id);
    toast.success("Module completed! 🎉");
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

  const isCompleted = isModuleCompleted(module.id);

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
          </div>

          {/* Module Content */}
          <Card className="mb-8">
            <CardContent className="prose prose-slate dark:prose-invert max-w-none pt-6">
              <Streamdown>{module.content}</Streamdown>
            </CardContent>
          </Card>

          {/* Quiz Section */}
          <div className="mb-8">
            <Quiz moduleId={module.id} />
          </div>

          {/* Action Buttons */}
          {!isCompleted && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleComplete}
                className="gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark as Complete
              </Button>
            </div>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
}
