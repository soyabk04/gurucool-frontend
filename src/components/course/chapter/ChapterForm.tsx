import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  CreateChapter,
  ChapterType,
  QuizQuestion,
} from "@/types/course";

interface ChapterFormProps {
  loading?: boolean;
  initialValues?: Partial<CreateChapter>;
  onSubmit: (data: CreateChapter) => Promise<void>;
}

const createEmptyQuestion = (): QuizQuestion => ({
  _id: crypto.randomUUID(),
  question: "",
  options: ["", "", "", ""],
  answer: "",
  marks: 1,
});

const createEmptyQuiz = () => ({
  passingMarks: 0,
  totalMarks: 1,
  questions: [createEmptyQuestion()],
});

export default function ChapterForm({
  loading = false,
  initialValues,
  onSubmit,
}: ChapterFormProps) {
  const [form, setForm] = useState<CreateChapter>({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    type: initialValues?.type ?? "video",
    file: null,
    quizData: initialValues?.quizData,
  });

  const [fileName, setFileName] = useState("");

  const hasQuiz = !!form.quizData;

  // --------------------------------------------------
  // Enable Quiz
  // --------------------------------------------------

  const enableQuiz = () => {
    setForm((prev) => ({
      ...prev,
      quizData: createEmptyQuiz(),
    }));
  };

  // --------------------------------------------------
  // Remove Quiz
  // --------------------------------------------------

  const disableQuiz = () => {
    setForm((prev) => ({
      ...prev,
      quizData: undefined,
    }));
  };

  // --------------------------------------------------
  // Update Question
  // --------------------------------------------------

  const updateQuestion = (
    questionIndex: number,
    data: Partial<QuizQuestion>
  ) => {
    setForm((prev) => {
      if (!prev.quizData) {
        return prev;
      }

      const questions = [...prev.quizData.questions];

      questions[questionIndex] = {
        ...questions[questionIndex],
        ...data,

        // Never allow null answer
        answer:
          data.answer !== undefined
            ? data.answer ?? ""
            : questions[questionIndex].answer ?? "",
      };

      return {
        ...prev,
        quizData: {
          ...prev.quizData,
          questions,
        },
      };
    });
  };

  // --------------------------------------------------
  // Update Option
  // --------------------------------------------------

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setForm((prev) => {
      if (!prev.quizData) {
        return prev;
      }

      const questions = [...prev.quizData.questions];

      const currentQuestion = questions[questionIndex];

      const oldOption =
        currentQuestion.options[optionIndex];

      const options = [
        ...currentQuestion.options,
      ] as [
        string,
        string,
        string,
        string
      ];

      options[optionIndex] = value;

      questions[questionIndex] = {
        ...currentQuestion,
        options,

        // If this option was the correct answer,
        // update the answer when the option changes.
        answer:
          (currentQuestion.answer ?? "") === oldOption
            ? value
            : currentQuestion.answer ?? "",
      };

      return {
        ...prev,
        quizData: {
          ...prev.quizData,
          questions,
        },
      };
    });
  };

  // --------------------------------------------------
  // Add Question
  // --------------------------------------------------

  const addQuestion = () => {
    setForm((prev) => {
      if (!prev.quizData) {
        return prev;
      }

      return {
        ...prev,
        quizData: {
          ...prev.quizData,
          questions: [
            ...prev.quizData.questions,
            createEmptyQuestion(),
          ],
        },
      };
    });
  };

  // --------------------------------------------------
  // Remove Question
  // --------------------------------------------------

  const removeQuestion = (index: number) => {
    setForm((prev) => {
      if (!prev.quizData) {
        return prev;
      }

      if (prev.quizData.questions.length === 1) {
        return prev;
      }

      return {
        ...prev,
        quizData: {
          ...prev.quizData,
          questions:
            prev.quizData.questions.filter(
              (_, questionIndex) =>
                questionIndex !== index
            ),
        },
      };
    });
  };

  // --------------------------------------------------
  // Validate Quiz
  // --------------------------------------------------

  const validateQuiz = (): boolean => {
    if (!form.quizData) {
      return true;
    }

    const {
      passingMarks,
      totalMarks,
      questions,
    } = form.quizData;

    if (totalMarks < 1) {
      alert("Total marks must be at least 1");
      return false;
    }

    if (passingMarks < 0) {
      alert("Passing marks cannot be negative");
      return false;
    }

    if (passingMarks > totalMarks) {
      alert(
        "Passing marks cannot exceed total marks"
      );
      return false;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (!question.question.trim()) {
        alert(
          `Question ${i + 1} is required`
        );
        return false;
      }

      if (question.options.length !== 4) {
        alert(
          `Question ${i + 1} must have exactly 4 options`
        );
        return false;
      }

      if (
        question.options.some(
          (option) => !option.trim()
        )
      ) {
        alert(
          `All 4 options are required for Question ${
            i + 1
          }`
        );
        return false;
      }

      if (!question.answer?.trim()) {
        alert(
          `Please select the correct answer for Question ${
            i + 1
          }`
        );
        return false;
      }

      if (
        !question.options.includes(
          question.answer
        )
      ) {
        alert(
          `Correct answer must be one of the options for Question ${
            i + 1
          }`
        );
        return false;
      }

      if (question.marks < 1) {
        alert(
          `Marks for Question ${
            i + 1
          } must be at least 1`
        );
        return false;
      }
    }

    const calculatedMarks =
      questions.reduce(
        (total, question) =>
          total + question.marks,
        0
      );

    if (calculatedMarks !== totalMarks) {
      alert(
        `Total marks (${totalMarks}) must equal the sum of question marks (${calculatedMarks})`
      );
      return false;
    }

    return true;
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Chapter title is required");
      return;
    }

    // Video/PDF requires file
    if (!form.file) {
      alert(
        form.type === "video"
          ? "Please select a video"
          : "Please select a PDF"
      );
      return;
    }

    // Validate quiz if enabled
    if (hasQuiz) {
      if (!validateQuiz()) {
        return;
      }
    }

    try {
      await onSubmit(form);

      // Reset
      setForm({
        title: "",
        description: "",
        type: "video",
        file: null,
        quizData: undefined,
      });

      setFileName("");
    } catch (error) {
      console.error(
        "Failed to create chapter:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Change Content Type
  // --------------------------------------------------

  const handleTypeChange = (
    value: string | null
  ) => {
    if (!value) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      type: value as ChapterType,
      file: null,
    }));

    setFileName("");
  };

  // --------------------------------------------------
  // Calculated Marks
  // --------------------------------------------------

  const calculatedMarks =
    form.quizData?.questions.reduce(
      (total, question) =>
        total + question.marks,
      0
    ) ?? 0;
  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ------------------------------------------ */}
      {/* Chapter Title */}
      {/* ------------------------------------------ */}

      <div className="space-y-2">
        <Label htmlFor="title">
          Chapter Title
        </Label>

        <Input
          id="title"
          placeholder="Introduction"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />
      </div>

      {/* ------------------------------------------ */}
      {/* Description */}
      {/* ------------------------------------------ */}

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          rows={4}
          placeholder="Chapter description..."
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>

      {/* ------------------------------------------ */}
      {/* Content Type */}
      {/* ------------------------------------------ */}

      <div className="space-y-2">
        <Label>Content Type</Label>

        <Select
          value={form.type}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="video">
              Video
            </SelectItem>

            <SelectItem value="pdf">
              PDF
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ------------------------------------------ */}
      {/* File Upload */}
      {/* ------------------------------------------ */}

      <div className="space-y-2">
        <Label>
          {form.type === "video"
            ? "Upload Video"
            : "Upload PDF"}
        </Label>

        <Input
          type="file"
          accept={
            form.type === "video"
              ? "video/*"
              : ".pdf,application/pdf"
          }
          onChange={(e) => {
            const file =
              e.target.files?.[0] ?? null;

            setForm((prev) => ({
              ...prev,
              file,
            }));

            setFileName(
              file?.name ?? ""
            );
          }}
        />

        {fileName && (
          <p className="text-sm text-muted-foreground">
            Selected: {fileName}
          </p>
        )}
      </div>

      {/* ========================================== */}
      {/* QUIZ SECTION */}
      {/* ========================================== */}

      <div className="rounded-lg border">
        {/* Quiz Header */}

        <div className="flex items-center justify-between p-5">
          <div>
            <h3 className="text-lg font-semibold">
              Chapter Quiz
            </h3>

            <p className="text-sm text-muted-foreground">
              Optionally add a quiz to this chapter.
            </p>
          </div>

          {!hasQuiz ? (
            <Button
              type="button"
              variant="outline"
              onClick={enableQuiz}
            >
              + Add Quiz
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={disableQuiz}
            >
              Remove Quiz
            </Button>
          )}
        </div>

        {/* Quiz Body */}

        {hasQuiz && form.quizData && (
          <div className="space-y-6 border-t p-5">
            {/* -------------------------------------- */}
            {/* Quiz Marks */}
            {/* -------------------------------------- */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Total Marks */}

              <div className="space-y-2">
                <Label>
                  Total Marks
                </Label>

                <Input
                  type="number"
                  min={1}
                  value={
                    form.quizData.totalMarks
                  }
                  onChange={(e) => {
                    const value =
                      Number(
                        e.target.value
                      );

                    setForm((prev) => ({
                      ...prev,
                      quizData:
                        prev.quizData
                          ? {
                              ...prev.quizData,
                              totalMarks:
                                value,
                            }
                          : undefined,
                    }));
                  }}
                />
              </div>

              {/* Passing Marks */}

              <div className="space-y-2">
                <Label>
                  Passing Marks
                </Label>

                <Input
                  type="number"
                  min={0}
                  value={
                    form.quizData
                      .passingMarks
                  }
                  onChange={(e) => {
                    const value =
                      Number(
                        e.target.value
                      );

                    setForm((prev) => ({
                      ...prev,
                      quizData:
                        prev.quizData
                          ? {
                              ...prev.quizData,
                              passingMarks:
                                value,
                            }
                          : undefined,
                    }));
                  }}
                />
              </div>
            </div>

            {/* -------------------------------------- */}
            {/* Questions Header */}
            {/* -------------------------------------- */}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Questions
                </h3>

                <p className="text-sm text-muted-foreground">
                  Add questions with four options.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addQuestion}
              >
                + Add Question
              </Button>
            </div>

            {/* -------------------------------------- */}
            {/* Questions */}
            {/* -------------------------------------- */}

            <div className="space-y-5">
              {form.quizData.questions.map(
                (
                  question,
                  questionIndex
                ) => (
                  <div
                    key={questionIndex}
                    className="space-y-5 rounded-lg border p-5"
                  >
                    {/* Question Header */}

                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        Question{" "}
                        {questionIndex + 1}
                      </h4>

                      {form.quizData!.questions
                        .length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            removeQuestion(
                              questionIndex
                            )
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Question */}

                    <div className="space-y-2">
                      <Label>
                        Question
                      </Label>

                      <Textarea
                        placeholder="Enter question..."
                        value={
                          question.question
                        }
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            {
                              question:
                                e.target
                                  .value,
                            }
                          )
                        }
                      />
                    </div>

                    {/* Options */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {question.options.map(
                        (
                          option,
                          optionIndex
                        ) => (
                          <div
                            key={
                              optionIndex
                            }
                            className="space-y-2"
                          >
                            <Label>
                              Option{" "}
                              {String.fromCharCode(
                                65 +
                                  optionIndex
                              )}
                            </Label>

                            <Input
                              placeholder={`Option ${String.fromCharCode(
                                65 +
                                  optionIndex
                              )}`}
                              value={option}
                              onChange={(e) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  e.target
                                    .value
                                )
                              }
                            />
                          </div>
                        )
                      )}
                    </div>

                    {/* Correct Answer */}

                    <div className="space-y-2">
                      <Label>
                        Correct Answer
                      </Label>

                      <Select
                        value={
                          question.answer ??
                          ""
                        }
                        onValueChange={(
                          value
                        ) => {
                          updateQuestion(
                            questionIndex,
                            {
                              answer:
                                value ??
                                "",
                            }
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>

                        <SelectContent>
                          {question.options.map(
                            (
                              option,
                              optionIndex
                            ) => {
                              if (
                                !option.trim()
                              ) {
                                return null;
                              }

                              return (
                                <SelectItem
                                  key={
                                    optionIndex
                                  }
                                  value={
                                    option
                                  }
                                >
                                  Option{" "}
                                  {String.fromCharCode(
                                    65 +
                                      optionIndex
                                  )}{" "}
                                  —{" "}
                                  {option}
                                </SelectItem>
                              );
                            }
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Marks */}

                    <div className="space-y-2">
                      <Label>
                        Marks
                      </Label>

                      <Input
                        type="number"
                        min={1}
                        value={
                          question.marks
                        }
                        onChange={(e) => {
                          const value =
                            Number(
                              e.target
                                .value
                            );

                          updateQuestion(
                            questionIndex,
                            {
                              marks: Math.max(
                                1,
                                value ||
                                  1
                              ),
                            }
                          );
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            {/* -------------------------------------- */}
            {/* Marks Summary */}
            {/* -------------------------------------- */}

            <div className="rounded-md bg-muted p-4 text-sm">
              <div className="flex justify-between">
                <span>
                  Question marks
                </span>

                <span className="font-medium">
                  {calculatedMarks}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Quiz total marks
                </span>

                <span className="font-medium">
                  {
                    form.quizData
                      .totalMarks
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Passing marks
                </span>

                <span className="font-medium">
                  {
                    form.quizData
                      .passingMarks
                  }
                </span>
              </div>

              {calculatedMarks !==
                form.quizData
                  .totalMarks && (
                <p className="mt-3 text-sm text-destructive">
                  Question marks must
                  equal the quiz total
                  marks.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------ */}
      {/* Submit */}
      {/* ------------------------------------------ */}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Creating..."
          : "Create Chapter"}
      </Button>
    </form>
  );
}