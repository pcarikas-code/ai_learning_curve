import { useState, useEffect } from "react";

interface ModuleProgress {
  moduleId: number;
  completed: boolean;
  score?: number;
  completedAt?: string;
}

interface PathEnrollment {
  pathId: number;
  enrolledAt: string;
}

interface UserProgress {
  completedModules: ModuleProgress[];
  enrolledPaths: PathEnrollment[];
  experienceLevel?: string;
  learningGoals?: string[];
  interests?: string[];
  onboardingCompleted: boolean;
}

const STORAGE_KEY = "ai_learning_progress";

const defaultProgress: UserProgress = {
  completedModules: [],
  enrolledPaths: [],
  onboardingCompleted: false,
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage:", error);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  const saveProgress = (newProgress: UserProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  };

  // Mark module as completed
  const completeModule = (moduleId: number, score?: number) => {
    const existingIndex = progress.completedModules.findIndex(
      (m) => m.moduleId === moduleId
    );

    let newCompleted: ModuleProgress[];
    if (existingIndex >= 0) {
      // Update existing
      newCompleted = [...progress.completedModules];
      newCompleted[existingIndex] = {
        moduleId,
        completed: true,
        score,
        completedAt: new Date().toISOString(),
      };
    } else {
      // Add new
      newCompleted = [
        ...progress.completedModules,
        {
          moduleId,
          completed: true,
          score,
          completedAt: new Date().toISOString(),
        },
      ];
    }

    saveProgress({
      ...progress,
      completedModules: newCompleted,
    });
  };

  // Enroll in a path
  const enrollInPath = (pathId: number) => {
    const alreadyEnrolled = progress.enrolledPaths.some(
      (p) => p.pathId === pathId
    );

    if (!alreadyEnrolled) {
      saveProgress({
        ...progress,
        enrolledPaths: [
          ...progress.enrolledPaths,
          { pathId, enrolledAt: new Date().toISOString() },
        ],
      });
    }
  };

  // Update onboarding status
  const completeOnboarding = (data: {
    experienceLevel?: string;
    learningGoals?: string[];
    interests?: string[];
  }) => {
    saveProgress({
      ...progress,
      ...data,
      onboardingCompleted: true,
    });
  };

  // Check if module is completed
  const isModuleCompleted = (moduleId: number): boolean => {
    return progress.completedModules.some(
      (m) => m.moduleId === moduleId && m.completed
    );
  };

  // Check if enrolled in path
  const isEnrolledInPath = (pathId: number): boolean => {
    return progress.enrolledPaths.some((p) => p.pathId === pathId);
  };

  // Get module score
  const getModuleScore = (moduleId: number): number | undefined => {
    return progress.completedModules.find((m) => m.moduleId === moduleId)
      ?.score;
  };

  // Clear all progress
  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(defaultProgress);
  };

  return {
    progress,
    completeModule,
    enrollInPath,
    completeOnboarding,
    isModuleCompleted,
    isEnrolledInPath,
    getModuleScore,
    clearProgress,
  };
}
