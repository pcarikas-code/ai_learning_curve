import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import { ArrowRight, BookOpen, BookmarkCheck, Brain, CheckCircle2, Clock, Sparkles, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Dashboard() {
  const { isAuthenticated, user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: userProgress } = trpc.progress.getAll.useQuery(undefined, { enabled: isAuthenticated });
  const { data: bookmarks } = trpc.bookmarks.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: learningPaths } = trpc.learningPaths.list.useQuery();
  const { data: allModules } = trpc.modules.getByPathId.useQuery(
    { pathId: 1 },
    { enabled: false }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>You need to sign in to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button className="w-full">Sign In</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedCount = userProgress?.filter((p) => p.status === "completed").length || 0;
  const inProgressCount = userProgress?.filter((p) => p.status === "in_progress").length || 0;
  const totalStarted = completedCount + inProgressCount;

  const recentProgress = userProgress
    ?.sort((a, b) => {
      const dateA = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0;
      const dateB = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Dashboard Content */}
      <div className="py-12">
        <div className="container">
          {/* Email Verification Banner */}
          {user && user.emailVerified === 0 && user.email && (
            <EmailVerificationBanner email={user.email} />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || "Learner"}!</h1>
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
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{inProgressCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Modules you're working on</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
                <BookmarkCheck className="w-4 h-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{bookmarks?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Saved for later</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="progress" className="space-y-6">
            <TabsList>
              <TabsTrigger value="progress">My Progress</TabsTrigger>
              <TabsTrigger value="paths">Learning Paths</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            </TabsList>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              {totalStarted === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Start Your Learning Journey</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't started any modules yet. Choose a learning path to begin!
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
                  <h2 className="text-2xl font-bold">Recent Activity</h2>
                  {recentProgress?.map((progress) => (
                    <Card key={progress.id} className="hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">Module #{progress.moduleId}</CardTitle>
                            <CardDescription>
                              Last accessed: {progress.lastAccessedAt ? new Date(progress.lastAccessedAt).toLocaleDateString() : 'Never'}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {progress.status === "completed" ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progress.progressPercent}%</span>
                          </div>
                          <Progress value={progress.progressPercent} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Learning Paths Tab */}
            <TabsContent value="paths" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">All Learning Paths</h2>
                <Link href="/paths">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningPaths?.slice(0, 6).map((path) => (
                  <Card key={path.id} className="hover:shadow-md transition-all group">
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">{path.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/paths/${path.slug}`}>
                        <Button className="w-full gap-2">
                          Explore <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Bookmarks Tab */}
            <TabsContent value="bookmarks" className="space-y-6">
              {!bookmarks || bookmarks.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookmarkCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Bookmarks Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Bookmark modules and resources to save them for later.
                    </p>
                    <Link href="/paths">
                      <Button className="gap-2">
                        Browse Content <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Your Bookmarks</h2>
                  {bookmarks.map((bookmark) => (
                    <Card key={bookmark.id} className="hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {bookmark.itemType === "module" ? "Module" : "Resource"} #{bookmark.itemId}
                            </CardTitle>
                            <CardDescription>
                              Saved on {new Date(bookmark.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <BookmarkCheck className="w-5 h-5 text-cyan-600" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
