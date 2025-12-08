import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  ClipboardCheck,
  FileText,
  Award,
} from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

interface InteractiveTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function InteractiveTutorial({ onComplete, onSkip }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = [
    {
      title: "Track Your Progress",
      description:
        "Your learning journey is automatically tracked. See completion percentages, time spent, and modules completed across all learning paths on your personalized dashboard.",
      icon: <BarChart3 className="h-12 w-12 text-[#06B6D4]" />,
      highlight: "Dashboard shows real-time progress for all your learning paths",
    },
    {
      title: "Test Your Knowledge",
      description:
        "Each module includes interactive quizzes with immediate feedback. Track your scores, review correct answers, and retake quizzes to improve your understanding.",
      icon: <ClipboardCheck className="h-12 w-12 text-[#06B6D4]" />,
      highlight: "3-5 questions per module with instant feedback",
    },
    {
      title: "Take Personal Notes",
      description:
        "Capture insights as you learn! Add personal notes to any module that auto-save and persist across sessions. Perfect for jotting down key concepts or questions.",
      icon: <FileText className="h-12 w-12 text-[#06B6D4]" />,
      highlight: "Notes support markdown formatting and auto-save",
    },
    {
      title: "Earn Certificates",
      description:
        "Complete all modules in a learning path to earn a personalized certificate. Download, print, or share your achievements on social media to showcase your expertise.",
      icon: <Award className="h-12 w-12 text-[#06B6D4]" />,
      highlight: "Unique certificates with your name and completion date",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onSkip}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="pt-12 pb-8 px-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">{step.icon}</div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#1E3A8A]">{step.title}</h2>
              <p className="text-muted-foreground text-lg">{step.description}</p>
            </div>

            {step.highlight && (
              <div className="bg-[#06B6D4]/10 border-l-4 border-[#06B6D4] p-4 rounded">
                <p className="text-sm font-medium text-[#1E3A8A]">💡 {step.highlight}</p>
              </div>
            )}

            <div className="flex gap-2 justify-center mt-6">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-all ${
                    idx === currentStep
                      ? "bg-[#06B6D4] w-8"
                      : idx < currentStep
                      ? "bg-[#06B6D4]/50"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button onClick={onSkip} variant="ghost" className="text-muted-foreground">
                Skip Tutorial
              </Button>

              <Button
                onClick={handleNext}
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
              >
                {currentStep === steps.length - 1 ? (
                  "Get Started"
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
