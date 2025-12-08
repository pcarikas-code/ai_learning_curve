import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  Crown,
  Cpu,
  Eye,
  FileText,
  Footprints,
  GraduationCap,
  Map,
  MessageSquare,
  Network,
  Sparkles,
  Star,
  Sunrise,
  Trophy,
} from "lucide-react";

interface AchievementBadgeProps {
  achievement: {
    id: number;
    key: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    points: number;
    rarity: string;
  };
  earnedAt?: string;
  locked?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  Crown,
  Cpu,
  Eye,
  FileText,
  Footprints,
  GraduationCap,
  Map,
  MessageSquare,
  Network,
  Sparkles,
  Star,
  Sunrise,
  Trophy,
};

const rarityColors: Record<string, string> = {
  common: "from-gray-400 to-gray-500",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500",
};

const rarityBorders: Record<string, string> = {
  common: "border-gray-300",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400",
};

export function AchievementBadge({ achievement, earnedAt, locked = false }: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon] || Award;
  const gradientClass = rarityColors[achievement.rarity] || rarityColors.common;
  const borderClass = rarityBorders[achievement.rarity] || rarityBorders.common;

  return (
    <Card
      className={`relative overflow-hidden transition-all hover:scale-105 ${
        locked ? "opacity-50 grayscale" : ""
      } ${earnedAt ? `border-2 ${borderClass}` : "border-gray-200"}`}
    >
      {earnedAt && (
        <div className="absolute top-2 right-2">
          <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center ${
              locked ? "grayscale" : ""
            }`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{achievement.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground capitalize">{achievement.rarity}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-[#06B6D4]">{achievement.points} pts</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className="text-sm">{achievement.description}</CardDescription>
        {earnedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Earned {new Date(earnedAt).toLocaleDateString()}
          </p>
        )}
        {locked && <p className="text-xs text-muted-foreground mt-2">🔒 Locked</p>}
      </CardContent>
    </Card>
  );
}
