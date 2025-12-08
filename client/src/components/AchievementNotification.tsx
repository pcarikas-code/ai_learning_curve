import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AchievementNotificationProps {
  achievement: {
    title: string;
    description: string;
    icon: string;
    points: number;
    rarity: string;
  };
  onClose: () => void;
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

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = iconMap[achievement.icon] || Award;
  const gradientClass = rarityColors[achievement.rarity] || rarityColors.common;

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="w-80 border-2 border-[#06B6D4] shadow-2xl bg-background">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center animate-bounce`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-[#06B6D4] font-semibold uppercase">
                  Achievement Unlocked!
                </p>
                <CardTitle className="text-base mt-1">{achievement.title}</CardTitle>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs px-2 py-1 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] font-semibold capitalize">
              {achievement.rarity}
            </span>
            <span className="text-xs font-semibold text-[#06B6D4]">
              +{achievement.points} points
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
