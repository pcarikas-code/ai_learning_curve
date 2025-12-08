import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, Target, Brain, ChevronRight, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

interface WelcomeWizardProps {
  onComplete: () => void;
}

export function WelcomeWizard({ onComplete }: WelcomeWizardProps) {
  const [step, setStep] = useState(1);
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [, setLocation] = useLocation();

  const updateProfileMutation = trpc.user.updateOnboarding.useMutation({
    onSuccess: () => {
      onComplete();
    },
  });

  const goals = [
    { id: "career", label: "Career Change", description: "Transition into AI/ML roles" },
    { id: "skill", label: "Skill Upgrade", description: "Enhance current technical skills" },
    { id: "academic", label: "Academic Learning", description: "Study for courses or research" },
    { id: "hobby", label: "Personal Interest", description: "Learn AI as a hobby" },
  ];

  const interests = [
    { id: "fundamentals", label: "AI Fundamentals", icon: "🎯" },
    { id: "ml", label: "Machine Learning", icon: "🤖" },
    { id: "dl", label: "Deep Learning", icon: "🧠" },
    { id: "nlp", label: "Natural Language Processing", icon: "💬" },
    { id: "cv", label: "Computer Vision", icon: "👁️" },
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId) ? prev.filter(g => g !== goalId) : [...prev, goalId]
    );
  };

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId) ? prev.filter(i => i !== interestId) : [...prev, interestId]
    );
  };

  const handleComplete = () => {
    updateProfileMutation.mutate({
      experienceLevel,
      learningGoals: JSON.stringify(selectedGoals),
      interests: JSON.stringify(selectedInterests),
    });
  };

  const canProceed = () => {
    if (step === 1) return experienceLevel !== "";
    if (step === 2) return selectedGoals.length > 0;
    if (step === 3) return selectedInterests.length > 0;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-[#06B6D4]" />
            <CardTitle className="text-2xl">Welcome to AI Learning Curve!</CardTitle>
          </div>
          <CardDescription>
            Let's personalize your learning journey in just 3 quick steps
          </CardDescription>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-[#06B6D4]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-8 w-8 text-[#1E3A8A]" />
                <div>
                  <h3 className="text-lg font-semibold">What's your AI experience level?</h3>
                  <p className="text-sm text-muted-foreground">
                    This helps us recommend the right starting point
                  </p>
                </div>
              </div>

              <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
                <div className="space-y-3">
                  <Label
                    htmlFor="beginner"
                    className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:border-[#06B6D4] transition-colors"
                  >
                    <RadioGroupItem value="beginner" id="beginner" />
                    <div className="flex-1">
                      <div className="font-semibold">Beginner</div>
                      <div className="text-sm text-muted-foreground">
                        New to AI and machine learning
                      </div>
                    </div>
                  </Label>

                  <Label
                    htmlFor="intermediate"
                    className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:border-[#06B6D4] transition-colors"
                  >
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <div className="flex-1">
                      <div className="font-semibold">Intermediate</div>
                      <div className="text-sm text-muted-foreground">
                        Familiar with basic concepts, want to go deeper
                      </div>
                    </div>
                  </Label>

                  <Label
                    htmlFor="advanced"
                    className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:border-[#06B6D4] transition-colors"
                  >
                    <RadioGroupItem value="advanced" id="advanced" />
                    <div className="flex-1">
                      <div className="font-semibold">Advanced</div>
                      <div className="text-sm text-muted-foreground">
                        Experienced, looking for specialized topics
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-[#1E3A8A]" />
                <div>
                  <h3 className="text-lg font-semibold">What are your learning goals?</h3>
                  <p className="text-sm text-muted-foreground">Select all that apply</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goals.map(goal => (
                  <Label
                    key={goal.id}
                    htmlFor={goal.id}
                    className={`flex items-start space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:border-[#06B6D4] transition-colors ${
                      selectedGoals.includes(goal.id) ? "border-[#06B6D4] bg-[#06B6D4]/5" : ""
                    }`}
                  >
                    <Checkbox
                      id={goal.id}
                      checked={selectedGoals.includes(goal.id)}
                      onCheckedChange={() => handleGoalToggle(goal.id)}
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{goal.label}</div>
                      <div className="text-sm text-muted-foreground">{goal.description}</div>
                    </div>
                  </Label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-[#1E3A8A]" />
                <div>
                  <h3 className="text-lg font-semibold">Which topics interest you most?</h3>
                  <p className="text-sm text-muted-foreground">Select your areas of focus</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interests.map(interest => (
                  <Label
                    key={interest.id}
                    htmlFor={interest.id}
                    className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:border-[#06B6D4] transition-colors ${
                      selectedInterests.includes(interest.id) ? "border-[#06B6D4] bg-[#06B6D4]/5" : ""
                    }`}
                  >
                    <Checkbox
                      id={interest.id}
                      checked={selectedInterests.includes(interest.id)}
                      onCheckedChange={() => handleInterestToggle(interest.id)}
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-2xl">{interest.icon}</span>
                      <div className="font-semibold">{interest.label}</div>
                    </div>
                  </Label>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed() || updateProfileMutation.isPending}
              className="bg-[#06B6D4] hover:bg-[#06B6D4]/90"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Start Learning
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
