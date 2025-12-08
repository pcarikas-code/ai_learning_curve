import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, RotateCcw, Clock } from "lucide-react";
import { toast } from "sonner";

interface QuizProps {
  moduleId: number;
  onComplete?: (score: number, passed: boolean) => void;
}

export function Quiz({ moduleId, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizAttemptId, setQuizAttemptId] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: quiz, isLoading } = trpc.quizzes.getByModuleId.useQuery({ moduleId });
  const { data: questions } = trpc.quizzes.getQuestions.useQuery(
    { quizId: quiz?.id || 0 },
    { enabled: !!quiz?.id }
  );
  const { data: attempts } = trpc.quizzes.getAttempts.useQuery(
    { quizId: quiz?.id || 0 },
    { enabled: !!quiz?.id }
  );

  const submitAttempt = trpc.quizzes.submitAttempt.useMutation({
      onSuccess: (data: { attemptId: number; score: number; passed: boolean; correctCount: number; totalQuestions: number }) => {
      setQuizAttemptId(data.attemptId);
      setShowResults(true);
      utils.quizzes.getAttempts.invalidate({ quizId: quiz?.id || 0 });
      
      if (onComplete) {
        onComplete(data.score, data.passed);
      }

      if (data.passed) {
        toast.success(`Congratulations! You passed with ${data.score}%`);
      } else {
        toast.error(`Score: ${data.score}%. Passing score is ${quiz?.passingScore}%`);
      }
    },
    onError: () => {
      toast.error("Failed to submit quiz");
    },
  });

  // Timer effect
  useEffect(() => {
    if (quiz?.timeLimit && !showResults && timeRemaining === null) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
    }

    if (timeRemaining !== null && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, timeRemaining, showResults]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = () => {
    if (!quiz || !questions) return;

    const answers = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[q.id] ?? -1,
    }));

    submitAttempt.mutate({
      quizId: quiz.id,
      answers,
    });
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizAttemptId(null);
    setTimeRemaining(quiz?.timeLimit ? quiz.timeLimit * 60 : null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Quiz...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Quiz Available</CardTitle>
          <CardDescription>This module doesn't have a quiz yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>No questions available for this quiz.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  // Results view
  if (showResults && quizAttemptId) {
    const correctCount = questions.filter((q) => {
      const selected = selectedAnswers[q.id];
      return selected === q.correctAnswer;
    }).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passingScore;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {passed ? (
                  <>
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Quiz Passed!
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-500" />
                    Quiz Not Passed
                  </>
                )}
              </CardTitle>
              <CardDescription>
                Your score: {score}% (Passing: {quiz.passingScore}%)
              </CardDescription>
            </div>
            <Button onClick={handleRetake} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score summary */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Correct Answers</span>
              <span className="text-2xl font-bold">
                {correctCount} / {questions.length}
              </span>
            </div>
            <Progress value={score} className="h-2" />
          </div>

          {/* Question review */}
          <div className="space-y-4">
            <h3 className="font-semibold">Review Your Answers</h3>
            {questions.map((question, index) => {
              const selected = selectedAnswers[question.id];
              const isCorrect = selected === question.correctAnswer;
              const options = JSON.parse(question.options || '[]');

              return (
                <Card key={question.id} className={isCorrect ? "border-green-500" : "border-red-500"}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2 mb-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Your answer:</span>{" "}
                            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                              {options[selected]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="font-medium">Correct answer:</span>{" "}
                              <span className="text-green-600">{options[question.correctAnswer]}</span>
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-muted-foreground mt-2">
                              <span className="font-medium">Explanation:</span> {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Previous attempts */}
          {attempts && attempts.length > 1 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Previous Attempts</h3>
              <div className="space-y-2">
                {attempts.slice(0, 5).map((attempt, index) => (
                  <div key={attempt.id} className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm">
                      Attempt {attempts.length - index}: {attempt.score}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Quiz taking view
  const options = JSON.parse(currentQuestion.options || '[]');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>{quiz.title}</CardTitle>
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span className={timeRemaining < 60 ? "text-red-500 font-bold" : ""}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
        <CardDescription>{quiz.description}</CardDescription>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
          <div className="space-y-2">
            {(options as string[]).map((option: string, index: number) => {
              const isSelected = selectedAnswers[currentQuestion.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20"
                      : "border-border hover:border-cyan-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-cyan-500 bg-cyan-500" : "border-border"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              disabled={selectedAnswers[currentQuestion.id] === undefined}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitAttempt.isPending}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Quiz
            </Button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 justify-center flex-wrap">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                selectedAnswers[q.id] !== undefined
                  ? "bg-cyan-500 text-white"
                  : index === currentQuestionIndex
                  ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 border-2 border-cyan-500"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
