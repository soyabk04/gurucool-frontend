import { useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Loader2,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import {
  submitQuiz
} from "@/services/quiz.service";
import type {
  QuizQuestion,
  QuizSubmitResponse,
} from "@/types/course";

interface ChapterQuizProps {
  questions: QuizQuestion[];
  onPassed: () => Promise<void> | void;
}

export default function ChapterQuiz({
  questions,
  onPassed,
}: ChapterQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState<QuizSubmitResponse | null>(null);

  const currentQuestion = questions[currentIndex];

  const selectedAnswer = currentQuestion
    ? answers[currentQuestion._id]
    : undefined;

  const isLastQuestion =
    currentIndex === questions.length - 1;

  const handleAnswerChange = (answer: string) => {
    if (!currentQuestion || result) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: answer,
    }));
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      return;
    }

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!currentQuestion || !selectedAnswer) {
      return;
    }

    const unanswered = questions.some(
      (question) => !answers[question._id]
    );

    if (unanswered) {
      return;
    }

    try {
      setSubmitting(true);

      const userAnswers = questions.map((question) => ({
        questionId: question._id,
        answer: answers[question._id],
      }));

      const quizResult = await submitQuiz(userAnswers);
      console.log("Quiz result:", quizResult);
      setResult(quizResult);

      if (quizResult.passed) {
        await onPassed();
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
  };

  if (!questions.length) {
    return (
      <Card className="overflow-hidden rounded-2xl border bg-card">
        <CardContent className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <CircleHelp className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">
              No quiz questions available
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              This chapter does not have any quiz questions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  /*
   * Quiz result screen
   */
  if (result) {
    const percentage =
      result.totalMarks === 0
        ? 0
        : Math.round(
            (result.score / result.totalMarks) * 100
          );

    return (
      <Card className="overflow-hidden rounded-2xl border bg-card">
        <CardContent className="flex min-h-[400px] items-center justify-center p-8">
          <div className="w-full max-w-md text-center">
            {result.passed ? (
              <>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>

                <h2 className="text-2xl font-bold">
                  Quiz Passed
                </h2>

                <p className="mt-2 text-muted-foreground">
                  Congratulations! You passed the chapter quiz.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>

                <h2 className="text-2xl font-bold">
                  Quiz Not Passed
                </h2>

                <p className="mt-2 text-muted-foreground">
                  You need to pass the quiz to complete this chapter.
                </p>
              </>
            )}

            <div className="mt-6 rounded-xl border bg-muted/30 p-5">
              <div className="text-3xl font-bold">
                {result.score} / {result.totalMarks}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {percentage}% score
              </p>

              <p className="mt-3 text-sm">
                Passing marks:{" "}
                <span className="font-semibold">
                  {result.passingMarks}
                </span>
              </p>
            </div>

            {result.passed ? (
              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Chapter completed
              </div>
            ) : (
              <Button
                className="mt-6"
                onClick={handleRetry}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <Card className="overflow-hidden rounded-2xl border bg-card">
      <CardHeader className="border-b px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CircleHelp className="h-5 w-5 text-primary" />

              <h2 className="text-lg font-semibold">
                Chapter Quiz
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Answer all questions to complete this chapter.
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-medium">
              {currentIndex + 1} / {questions.length}
            </p>

            <p className="text-xs text-muted-foreground">
              {answeredCount} answered
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: `${
                ((currentIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Question {currentIndex + 1}
            </p>

            <h3 className="text-xl font-semibold leading-relaxed">
              {currentQuestion.question}
            </h3>

            <p className="mt-2 text-xs text-muted-foreground">
              {currentQuestion.marks}{" "}
              {currentQuestion.marks === 1 ? "mark" : "marks"}
            </p>
          </div>

          <RadioGroup
            value={selectedAnswer}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {currentQuestion.options.map(
              (option, index) => {
                const optionId = `${currentQuestion._id}-${index}`;

                return (
                  <Label
                    key={optionId}
                    htmlFor={optionId}
                    className={`
                      flex cursor-pointer items-center gap-4
                      rounded-xl border p-4
                      transition-all
                      hover:bg-muted/60
                      ${
                        selectedAnswer === option
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : ""
                      }
                    `}
                  >
                    <RadioGroupItem
                      id={optionId}
                      value={option}
                    />

                    <span className="flex-1 text-sm leading-6">
                      {option}
                    </span>
                  </Label>
                );
              }
            )}
          </RadioGroup>

          <div className="mt-8 flex items-center justify-between gap-4 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || submitting}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {!isLastQuestion ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!selectedAnswer || submitting}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={
                  !selectedAnswer ||
                  answeredCount !== questions.length ||
                  submitting
                }
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Submit Quiz
                  </>
                )}
              </Button>
            )}
          </div>

          {answeredCount !== questions.length && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Answer all {questions.length} questions before
              submitting.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}