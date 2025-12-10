import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useProgress } from "@/hooks/useProgress";
import { ArrowRight, BookOpen, Brain, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { EmailRegistrationModal } from "@/components/EmailRegistrationModal";

export default function Dashboard() {
  const { progress, user, showRegistration, setShowRegistration, registerUser } = useProgress();
  const { data: learningPaths } = trpc.learningPaths.list.useQuery();

  const completedCount = progress.completedModules.filter((m) => m.completed).length;
  const enrolledCount = progress.enrolledPaths.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Dashboard Content */}
      <div className="py-12">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, Learner!</h1>
            <p className="text-xl text-muted-foreground">Continue your AI learning journey</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Keep up the great work!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Learning Paths</CardTitle>
                <Clock className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{enrolledCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Paths you're exploring</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Experience Level</CardTitle>
                <Sparkles className="w-4 h-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {progress.experienceLevel || "Not Set"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Your current level</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="progress" className="space-y-6">
            <TabsList>
              <TabsTrigger value="progress">My Progress</TabsTrigger>
              <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            </TabsList>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              {completedCount === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Start Your Learning Journey</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't completed any modules yet. Choose a learning path to begin!
                    </p>
                    <Link href="/paths">
                      <Button className="gap-2">
                        Browse Learning Paths <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Completed Modules</h3>
                  {progress.completedModules.map((module) => (
                    <Card key={module.moduleId}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Module {module.moduleId}</CardTitle>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        {module.score !== undefined && (
                          <CardDescription>Score: {module.score}%</CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Paths Tab */}
            <TabsContent value="paths" className="space-y-6">
              {!learningPaths || learningPaths.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No learning paths available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {learningPaths.map((path) => {
                    const isEnrolled = progress.enrolledPaths.some((p) => p.pathId === path.id);
                    return (
                      <Card key={path.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle>{path.title}</CardTitle>
                          <CardDescription>{path.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {path.difficulty} • {path.estimatedHours}h
                            </div>
                            <Link href={`/paths/${path.slug}`}>
                              <Button variant={isEnrolled ? "default" : "outline"} size="sm">
                                {isEnrolled ? "Continue" : "View Path"}
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
      
      {/* Email Registration Modal */}
      <EmailRegistrationModal 
        open={showRegistration} 
        onComplete={registerUser}
      />
    </div>
  );
}
