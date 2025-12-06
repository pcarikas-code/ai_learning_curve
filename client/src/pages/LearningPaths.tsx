import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpen, Brain, Cpu, Eye, MessageSquare, Network, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function LearningPaths() {
  const { data: learningPaths, isLoading } = trpc.learningPaths.list.useQuery();

  const iconMap: Record<string, React.ElementType> = {
    Brain,
    Cpu,
    Network,
    MessageSquare,
    Eye,
  };

  const colorMap: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600",
  };

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/logo.png" alt="AI Learning Curve" className="h-16" />
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

      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-cyan-50 via-blue-50 to-background dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-background">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Learning Paths</h1>
            <p className="text-xl text-muted-foreground">
              Choose a structured learning path to master specific areas of AI. Each path contains carefully curated modules that build upon each other.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Paths Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="w-12 h-12 bg-muted rounded-lg mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths?.map((path) => {
                const Icon = iconMap[path.icon || "Brain"];
                const gradientClass = colorMap[path.color || "blue"];
                const difficultyClass = difficultyColors[path.difficulty];
                
                return (
                  <Card key={path.id} className="h-full hover:shadow-lg transition-all group">
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {Icon && <Icon className="w-7 h-7 text-white" />}
                      </div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">{path.title}</CardTitle>
                      <CardDescription className="text-base">{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyClass}`}>
                          {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                        </span>
                        {path.estimatedHours && (
                          <span className="text-sm text-muted-foreground">
                            {path.estimatedHours} hours
                          </span>
                        )}
                      </div>
                      <Link href={`/paths/${path.slug}`}>
                        <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                          Start Learning <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
