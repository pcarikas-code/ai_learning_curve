import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Loader2, User, Lock, Link as LinkIcon, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  // Profile update state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update profile mutation
  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
    },
  });

  // Change password mutation
  const changePassword = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [loading, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ name, email });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return;
    }

    changePassword.mutate({
      currentPassword,
      newPassword,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-12">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
            <p className="text-xl text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">
                <User className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="connected">
                <LinkIcon className="w-4 h-4 mr-2" />
                Connected Accounts
              </TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your personal information and email address</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        disabled={updateProfile.isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        disabled={updateProfile.isPending}
                      />
                      {user.emailVerified === 1 ? (
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Email verified
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-amber-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Email not verified
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Login Method</Label>
                      <div className="text-sm text-muted-foreground capitalize">
                        {user.loginMethod || "Email/Password"}
                      </div>
                    </div>

                    {updateProfile.isError && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {updateProfile.error.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    {updateProfile.isSuccess && (
                      <Alert>
                        <AlertDescription>
                          Profile updated successfully!
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    {user.loginMethod === 'email' 
                      ? 'Update your password to keep your account secure'
                      : `You're signed in with ${user.loginMethod}. Password change is not available for social logins.`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.loginMethod === 'email' ? (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          disabled={changePassword.isPending}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          disabled={changePassword.isPending}
                        />
                        <p className="text-xs text-muted-foreground">
                          Must be at least 6 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          disabled={changePassword.isPending}
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-xs text-red-600">Passwords do not match</p>
                        )}
                      </div>

                      {changePassword.isError && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            {changePassword.error.message}
                          </AlertDescription>
                        </Alert>
                      )}

                      {changePassword.isSuccess && (
                        <Alert>
                          <AlertDescription>
                            Password changed successfully!
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        disabled={changePassword.isPending || newPassword !== confirmPassword}
                      >
                        {changePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Change Password
                      </Button>
                    </form>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Password management is handled by your {user.loginMethod} account.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Connected Accounts Tab */}
            <TabsContent value="connected">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Manage your social login connections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Mail className="w-8 h-8 text-gray-600" />
                      <div>
                        <div className="font-medium">Email/Password</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    {user.loginMethod === 'email' && (
                      <div className="text-sm text-green-600 font-medium">Connected</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <div>
                        <div className="font-medium">Google</div>
                        <div className="text-sm text-muted-foreground">Sign in with Google</div>
                      </div>
                    </div>
                    {user.loginMethod === 'google' ? (
                      <div className="text-sm text-green-600 font-medium">Connected</div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/api/auth/google'}>
                        Connect
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <svg className="w-8 h-8" viewBox="0 0 23 23">
                        <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                        <path fill="#f35325" d="M1 1h10v10H1z" />
                        <path fill="#81bc06" d="M12 1h10v10H12z" />
                        <path fill="#05a6f0" d="M1 12h10v10H1z" />
                        <path fill="#ffba08" d="M12 12h10v10H12z" />
                      </svg>
                      <div>
                        <div className="font-medium">Microsoft</div>
                        <div className="text-sm text-muted-foreground">Sign in with Microsoft</div>
                      </div>
                    </div>
                    {user.loginMethod === 'microsoft' ? (
                      <div className="text-sm text-green-600 font-medium">Connected</div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/api/auth/microsoft'}>
                        Connect
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <svg className="w-8 h-8" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <div>
                        <div className="font-medium">Facebook</div>
                        <div className="text-sm text-muted-foreground">Sign in with Facebook</div>
                      </div>
                    </div>
                    {user.loginMethod === 'facebook' ? (
                      <div className="text-sm text-green-600 font-medium">Connected</div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/api/auth/facebook'}>
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
