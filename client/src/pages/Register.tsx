import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { UserPlus } from "lucide-react";

export default function Register() {
  const handleRegister = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Join AI Learning Curve</CardTitle>
          <CardDescription className="text-center">
            Create your account to start learning AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleRegister}
            className="w-full h-12 text-lg"
            size="lg"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Sign Up with Manus
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
