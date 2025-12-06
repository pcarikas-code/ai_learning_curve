import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpen, Brain, Cpu, Eye, MessageSquare, Network, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated, loading: authLoading } = useAuth();
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/logo.png" alt="AI Learning Curve" className="h-10" />
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/resources">
                <Button variant="ghost">Resources</Button>
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button>Get Started</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-background dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-background" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Master AI from Basics to Advanced</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-900 bg-clip-text text-transparent">
              Navigate Your AI Learning Journey
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A comprehensive, interactive platform designed to guide you through the complexities of Artificial Intelligence. 
              From fundamentals to cutting-edge techniques, master AI at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Continue Learning <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="gap-2">
                    Start Learning <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              )}
              <Link href="/paths">
                <Button size="lg" variant="outline" className="gap-2">
                  <BookOpen className="w-4 h-4" /> Explore Paths
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Learning Path</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Structured learning paths designed to take you from beginner to expert in specific AI domains.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="w-12 h-12 bg-muted rounded-lg mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths?.map((path) => {
                const Icon = iconMap[path.icon || "Brain"];
                const gradientClass = colorMap[path.color || "blue"];
                
                return (
                  <Link key={path.id} href={`/paths/${path.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          {Icon && <Icon className="w-6 h-6 text-white" />}
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">{path.title}</CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="capitalize">{path.difficulty}</span>
                          {path.estimatedHours && <span>• {path.estimatedHours}h</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AI Learning Curve?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master AI, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Learning</h3>
              <p className="text-muted-foreground">
                Follow carefully designed paths that build knowledge progressively from fundamentals to advanced topics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Content</h3>
              <p className="text-muted-foreground">
                Engage with quizzes, code examples, and hands-on exercises to reinforce your learning.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey with detailed progress tracking and personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-500 to-blue-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your AI Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners mastering AI skills for the future.
          </p>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card/50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="AI Learning Curve" className="h-8" />
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AI Learning Curve. Empowering the next generation of AI practitioners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
