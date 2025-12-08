import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AchievementBadge } from "@/components/AchievementBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Award, TrendingUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Achievements() {
  const { user, isAuthenticated } = useAuth();
  const { data: earnedAchievements, isLoading: loadingEarned } =
    trpc.achievements.getUserAchievements.useQuery(undefined, {
      enabled: isAuthenticated,
    });
  const { data: allAchievements, isLoading: loadingAll } = trpc.achievements.listAll.useQuery();
  const { data: progress } = trpc.achievements.getProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-20 text-center">
          <Trophy className="h-16 w-16 mx-auto text-[#06B6D4] mb-4" />
          <h1 className="text-3xl font-bold mb-4">Achievements</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to track your achievements and earn badges
          </p>
          <Button asChild className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const earnedMap = new Map(
    earnedAchievements?.map((ea) => [
      ea.achievement.id,
      ea.earnedAt instanceof Date ? ea.earnedAt.toISOString() : ea.earnedAt,
    ]) || []
  );

  const categories = [
    { key: "module", label: "Module Achievements", icon: Award },
    { key: "quiz", label: "Quiz Achievements", icon: Trophy },
    { key: "path", label: "Path Achievements", icon: TrendingUp },
    { key: "special", label: "Special Achievements", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Achievements</h1>
          <p className="text-muted-foreground">
            Track your learning milestones and earn badges
          </p>
        </div>

        {/* Progress Stats */}
        {progress && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Achievements Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {progress.earned} / {progress.total}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-[#1E3A8A] to-[#06B6D4] h-2 rounded-full transition-all"
                    style={{ width: `${(progress.earned / progress.total) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#06B6D4]">{progress.points}</div>
                <p className="text-sm text-muted-foreground mt-2">Keep earning more!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.round((progress.earned / progress.total) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {progress.total - progress.earned} left to unlock
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Achievement Categories */}
        {loadingAll || loadingEarned ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading achievements...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryAchievements = allAchievements?.filter(
                (a) => a.category === category.key
              );

              if (!categoryAchievements || categoryAchievements.length === 0) return null;

              return (
                <div key={category.key}>
                  <div className="flex items-center gap-2 mb-4">
                    <category.icon className="h-5 w-5 text-[#1E3A8A]" />
                    <h2 className="text-2xl font-bold">{category.label}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryAchievements.map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        earnedAt={earnedMap.get(achievement.id)}
                        locked={!earnedMap.has(achievement.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-[#1E3A8A] to-[#06B6D4] text-white">
          <CardContent className="py-8 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Keep Learning!</h3>
            <p className="mb-4 opacity-90">
              Complete modules, ace quizzes, and finish learning paths to unlock more achievements
            </p>
            <Button asChild variant="secondary">
              <Link href="/learning-paths">Explore Learning Paths</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
