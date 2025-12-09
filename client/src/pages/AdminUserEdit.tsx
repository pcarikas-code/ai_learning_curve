import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Trophy, 
  Target,
  Clock,
  Loader2
} from "lucide-react";
import { useLocation, useParams } from "wouter";

export default function AdminUserEdit() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const userId = parseInt(params.id || "0");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [emailVerified, setEmailVerified] = useState(0);

  const { data: user, isLoading: userLoading } = trpc.admin.getUser.useQuery(
    { userId },
    { enabled: currentUser?.role === 'admin' && userId > 0 }
  );

  const { data: activity, isLoading: activityLoading } = trpc.admin.getUserActivity.useQuery(
    { userId },
    { enabled: currentUser?.role === 'admin' && userId > 0 }
  );

  const updateUser = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      // Refetch user data
      window.location.reload();
    },
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setEmailVerified(user.emailVerified);
    }
  }, [user]);

  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
            <CardDescription>The requested user could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation('/admin')}>
              Back to Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser.mutate({
      userId,
      name,
      email,
      role,
      emailVerified,
    });
  };

  const completedModules = activity?.progress?.filter(p => p.status === 'completed').length || 0;
  const totalEnrollments = activity?.enrollments?.length || 0;
  const totalAchievements = activity?.achievements?.length || 0;
  const averageQuizScore = activity?.quizzes?.length 
    ? Math.round(activity.quizzes.reduce((acc, q) => acc + (q.score || 0), 0) / activity.quizzes.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-12">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation('/admin')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Edit User</h1>
                <p className="text-xl text-muted-foreground">Manage user profile and view activity</p>
              </div>
              <div className="flex gap-2">
                {user.emailVerified === 1 ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                )}
                {user.role === 'admin' && (
                  <Badge variant="default" className="bg-blue-600">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed Modules</CardTitle>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedModules}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalEnrollments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Trophy className="w-4 h-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalAchievements}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Quiz Score</CardTitle>
                <Target className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{averageQuizScore}%</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Clock className="w-4 h-4 mr-2" />
                Activity History
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>Edit user information and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="User's full name"
                          disabled={updateUser.isPending}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="user@example.com"
                          disabled={updateUser.isPending}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={(value: "user" | "admin") => setRole(value)}>
                          <SelectTrigger id="role">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emailVerified">Email Verification Status</Label>
                        <Select 
                          value={emailVerified.toString()} 
                          onValueChange={(value) => setEmailVerified(parseInt(value))}
                        >
                          <SelectTrigger id="emailVerified">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Unverified</SelectItem>
                            <SelectItem value="1">Verified</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Account Information</Label>
                      <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm text-muted-foreground">User ID</p>
                          <p className="font-medium">{user.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Login Method</p>
                          <p className="font-medium capitalize">{user.loginMethod || 'Email'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Created At</p>
                          <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Sign In</p>
                          <p className="font-medium">{new Date(user.lastSignedIn).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {updateUser.isError && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {updateUser.error.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    {updateUser.isSuccess && (
                      <Alert>
                        <AlertDescription>
                          User updated successfully!
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={updateUser.isPending}
                    >
                      {updateUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <div className="space-y-6">
                {/* Learning Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                    <CardDescription>Module completion and progress tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activityLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : activity?.progress && activity.progress.length > 0 ? (
                      <div className="space-y-4">
                        {activity.progress.slice(0, 10).map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">Module ID: {p.moduleId}</p>
                              <p className="text-sm text-muted-foreground">
                                Last accessed: {p.lastAccessedAt ? new Date(p.lastAccessedAt).toLocaleDateString() : 'Never'}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Progress</p>
                                <p className="font-bold">{p.progressPercent}%</p>
                              </div>
                              <Badge variant={p.status === 'completed' ? 'default' : 'secondary'}>
                                {p.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription>No learning progress recorded yet.</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Path Enrollments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Path Enrollments</CardTitle>
                    <CardDescription>Learning paths the user has enrolled in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activityLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : activity?.enrollments && activity.enrollments.length > 0 ? (
                      <div className="space-y-4">
                        {activity.enrollments.map((e) => (
                          <div key={e.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">Path ID: {e.pathId}</p>
                              <p className="text-sm text-muted-foreground">
                                Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Progress</p>
                              <p className="font-bold">{e.progressPercent}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription>No path enrollments yet.</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Badges and milestones earned</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activityLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : activity?.achievements && activity.achievements.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {activity.achievements.map((a) => (
                          <div key={a.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <Trophy className="w-8 h-8 text-yellow-600" />
                            <div>
                              <p className="font-medium">Achievement ID: {a.achievementId}</p>
                              <p className="text-sm text-muted-foreground">
                                Earned: {new Date(a.earnedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription>No achievements earned yet.</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Quiz Attempts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz History</CardTitle>
                    <CardDescription>Recent quiz attempts and scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activityLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : activity?.quizzes && activity.quizzes.length > 0 ? (
                      <div className="space-y-4">
                        {activity.quizzes.slice(0, 10).map((q) => (
                          <div key={q.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">Quiz ID: {q.quizId}</p>
                              <p className="text-sm text-muted-foreground">
                                Attempted: {new Date(q.attemptedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Score</p>
                                <p className="font-bold text-lg">{q.score}%</p>
                              </div>
                              <Badge variant={q.passed ? 'default' : 'destructive'}>
                                {q.passed ? 'Passed' : 'Failed'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription>No quiz attempts yet.</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
