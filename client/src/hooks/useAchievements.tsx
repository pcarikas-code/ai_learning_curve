import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { AchievementNotification } from "@/components/AchievementNotification";

export function useAchievements() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const checkAllMutation = trpc.achievements.checkAll.useMutation();

  const checkAchievements = useCallback(async () => {
    try {
      const result = await checkAllMutation.mutateAsync();
      if (result.newAchievements && result.newAchievements.length > 0) {
        setNotifications((prev) => [...prev, ...result.newAchievements]);
      }
      return result.newAchievements;
    } catch (error) {
      console.error("Error checking achievements:", error);
      return [];
    }
  }, [checkAllMutation]);

  const removeNotification = useCallback((achievementId: number) => {
    setNotifications((prev) => prev.filter((a) => a.id !== achievementId));
  }, []);

  const NotificationContainer = useCallback(() => {
    return (
      <>
        {notifications.map((achievement, index) => (
          <div key={achievement.id} style={{ top: `${index * 120 + 16}px` }}>
            <AchievementNotification
              achievement={achievement}
              onClose={() => removeNotification(achievement.id)}
            />
          </div>
        ))}
      </>
    );
  }, [notifications, removeNotification]);

  return {
    checkAchievements,
    notifications,
    NotificationContainer,
  };
}
