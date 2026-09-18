import {
  useState,
  type FormEvent,
} from "react";

import {
  Image,
  X,
} from "lucide-react";

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
  onSubmit: (
    data: CreateChapter
  ) => Promise<void>;
}

/* =========================================================
   CREATE EMPTY QUESTION
========================================================= */

const createEmptyQuestion =
  (): QuizQuestion => ({
    _id: crypto.randomUUID(),
    question: "",
    image: undefined,
    options: [
      "",
      "",
      "",
      "",
    ],
    answer: "",
    marks: 1,
  });

/* =========================================================
   CREATE EMPTY QUIZ
========================================================= */

const createEmptyQuiz = () => ({
  passingMarks: 0,
  totalMarks: 1,
  questions: [
    createEmptyQuestion(),
  ],
});

/* =========================================================
   COMPONENT
========================================================= */

export default function ChapterForm({
  loading = false,
  initialValues,
  onSubmit,
}: ChapterFormProps) {
  const [form, setForm] =
    useState<CreateChapter>({
      title:
        initialValues?.title ?? "",

      description:
        initialValues?.description ?? "",

      type:
        initialValues?.type ?? "video",

      file: null,

      quizData:
        initialValues?.quizData,
    });

  const [fileName, setFileName] =
    useState("");

  const hasQuiz =
    !!form.quizData;

  /* =========================================================
     ENABLE QUIZ
  ========================================================= */

  const enableQuiz = () => {
    setForm((prev) => ({
      ...prev,
      quizData:
        createEmptyQuiz(),
    }));
  };

  /* =========================================================
     REMOVE QUIZ
  ========================================================= */

  const disableQuiz = () => {
    setForm((prev) => ({
      ...prev,
      quizData: undefined,
    }));
  };

  /* =========================================================
     UPDATE QUESTION
  ========================================================= */

  const updateQuestion = (
    questionIndex: number,
    data: Partial<QuizQuestion>
  ) => {
    setForm((prev) => {
      if (!prev.quizData) {
        return prev;
      }

      const questions = [
        ...prev.quizData.questions,
      ];

      questions[questionIndex] = {
        ...questions[questionIndex],
        ...data,

        // Never allow null answer
        answer:
          data.answer !== undefined
            ? data.answer ?? ""
            : questions[questionIndex]
                .answer ?? "",
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

  /* =========================================================
     UPDATE OPTION
  ========================================================= */

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setForm((prev) => {
      if (!prev.quizData) {
        return prev;
      }

      const questions = [
        ...prev.quizData.questions,
      ];

      const currentQuestion =
        questions[questionIndex];

      const oldOption =
        currentQuestion.options[
          optionIndex
        ];

      const options = [
        ...currentQuestion.options,
      ];

      options[optionIndex] =
        value;

      questions[questionIndex] = {
        ...currentQuestion,

        options,

        // If this option was the correct
        // answer, update the answer.
        answer:
          (currentQuestion.answer ??
            "") === oldOption
            ? value
            : currentQuestion.answer ??
              "",
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

  /* =========================================================
     QUESTION IMAGE
  ========================================================= */

  const handleQuestionImageChange = (
    questionIndex: number,
    file: File | null
  ) => {
    if (!file) {
      return;
    }

    /* -------------------------------------------------------
       Validate image type
    ------------------------------------------------------- */

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Invalid image format. Please use PNG, JPG, JPEG or WebP."
      );

      return;
    }

    /* -------------------------------------------------------
       Validate image size
       Maximum: 5 MB
    ------------------------------------------------------- */

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Question image must be less than 5 MB."
      );

      return;
    }

    /*
     * IMPORTANT:
     *
     * Store the actual File.
     *
     * Do NOT use:
     *
     * URL.createObjectURL(file)
     *
     * because the API needs the actual File
     * to append it to FormData.
     */

    updateQuestion(
      questionIndex,
      {
        // QuizQuestion.image is typed as a string for persisted image URLs,
        // but uploads are kept as the actual File until submission.
        image: file as unknown as QuizQuestion["image"],
      }
    );
  };

  /* =========================================================
     REMOVE QUESTION IMAGE
  ========================================================= */

  const removeQuestionImage = (
    questionIndex: number
  ) => {
    updateQuestion(
      questionIndex,
      {
        image: undefined,
      }
    );
  };

  /* =========================================================
     ADD QUESTION
  ========================================================= */

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

  /* =========================================================
     REMOVE QUESTION
  ========================================================= */

  const removeQuestion = (
    index: number
  ) => {
    setForm((prev) => {
      if (!prev.quizData) {
        return prev;
      }

      // Don't allow removing the last question
      if (
        prev.quizData.questions
          .length === 1
      ) {
        return prev;
      }

      return {
        ...prev,

        quizData: {
          ...prev.quizData,

          questions:
            prev.quizData.questions.filter(
              (_, questionIndex) =>
                questionIndex !==
                index
            ),
        },
      };
    });
  };

  /* =========================================================
     VALIDATE QUIZ
  ========================================================= */

  const validateQuiz = (): boolean => {
    if (!form.quizData) {
      return true;
    }

    const {
      passingMarks,
      totalMarks,
      questions,
    } = form.quizData;

    /* -------------------------------------------------------
       Total marks
    ------------------------------------------------------- */

    if (totalMarks < 1) {
      alert(
        "Total marks must be at least 1"
      );

      return false;
    }

    /* -------------------------------------------------------
       Passing marks
    ------------------------------------------------------- */

    if (passingMarks < 0) {
      alert(
        "Passing marks cannot be negative"
      );

      return false;
    }

    if (
      passingMarks >
      totalMarks
    ) {
      alert(
        "Passing marks cannot exceed total marks"
      );

      return false;
    }

    /* -------------------------------------------------------
       Questions
    ------------------------------------------------------- */

    if (
      questions.length === 0
    ) {
      alert(
        "Please add at least one question"
      );

      return false;
    }

    /* -------------------------------------------------------
       Validate each question
    ------------------------------------------------------- */

    for (
      let i = 0;
      i < questions.length;
      i++
    ) {
      const question =
        questions[i];

      /* -----------------------------------------------------
         Question text
      ----------------------------------------------------- */

      if (
        !question.question.trim()
      ) {
        alert(
          `Question ${
            i + 1
          } is required`
        );

        return false;
      }

      /* -----------------------------------------------------
         Exactly 4 options
      ----------------------------------------------------- */

      if (
        question.options.length !==
        4
      ) {
        alert(
          `Question ${
            i + 1
          } must have exactly 4 options`
        );

        return false;
      }

      /* -----------------------------------------------------
         All options required
      ----------------------------------------------------- */

      if (
        question.options.some(
          (option) =>
            !option.trim()
        )
      ) {
        alert(
          `All 4 options are required for Question ${
            i + 1
          }`
        );

        return false;
      }

      /* -----------------------------------------------------
         Correct answer
      ----------------------------------------------------- */

      if (
        !question.answer?.trim()
      ) {
        alert(
          `Please select the correct answer for Question ${
            i + 1
          }`
        );

        return false;
      }

      /* -----------------------------------------------------
         Correct answer must exist in options
      ----------------------------------------------------- */

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

      /* -----------------------------------------------------
         Marks
      ----------------------------------------------------- */

      if (
        question.marks < 1
      ) {
        alert(
          `Marks for Question ${
            i + 1
          } must be at least 1`
        );

        return false;
      }

      /* -----------------------------------------------------
         Image validation
         Only validate if an image exists
      ----------------------------------------------------- */

      const image: unknown =
        question.image;

      if (
        image instanceof File
      ) {
        const allowedTypes = [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
        ];

        if (
          !allowedTypes.includes(
            image.type
          )
        ) {
          alert(
            `Invalid image format for Question ${
              i + 1
            }`
          );

          return false;
        }

        const maxSize =
          5 * 1024 * 1024;

        if (
          image.size > maxSize
        ) {
          alert(
            `Image for Question ${
              i + 1
            } must be less than 5 MB`
          );

          return false;
        }
      }
    }

    /* -------------------------------------------------------
       Calculate marks
    ------------------------------------------------------- */

    const calculatedMarks =
      questions.reduce(
        (total, question) =>
          total +
          question.marks,
        0
      );

    /* -------------------------------------------------------
       Validate total marks
    ------------------------------------------------------- */

    if (
      calculatedMarks !==
      totalMarks
    ) {
      alert(
        `Total marks (${totalMarks}) must equal the sum of question marks (${calculatedMarks})`
      );

      return false;
    }

    return true;
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    /* -------------------------------------------------------
       Chapter title
    ------------------------------------------------------- */

    if (!form.title.trim()) {
      alert(
        "Chapter title is required"
      );

      return;
    }

    /* -------------------------------------------------------
       Video/PDF requires file
    ------------------------------------------------------- */

    if (!form.file) {
      alert(
        form.type === "video"
          ? "Please select a video"
          : "Please select a PDF"
      );

      return;
    }

    /* -------------------------------------------------------
       Validate quiz
    ------------------------------------------------------- */

    if (hasQuiz) {
      if (
        !validateQuiz()
      ) {
        return;
      }
    }

    try {
      console.log(
        "Submitting chapter:",
        form
      );

      console.log(
        "Submit handler:",
        onSubmit
      );

      console.log(
        "Submit handler type:",
        typeof onSubmit
      );

      await onSubmit(form);

      /* -----------------------------------------------------
         Reset form
      ----------------------------------------------------- */

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

  /* =========================================================
     CHANGE CONTENT TYPE
  ========================================================= */

  const handleTypeChange = (
    value: string | null
  ) => {
    if (!value) {
      return;
    }

    setForm((prev) => ({
      ...prev,

      type:
        value as ChapterType,

      file: null,
    }));

    setFileName("");
  };

  /* =========================================================
     CALCULATED MARKS
  ========================================================= */

  const calculatedMarks =
    form.quizData?.questions.reduce(
      (total, question) =>
        total +
        question.marks,
      0
    ) ?? 0;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =====================================================
          CHAPTER TITLE
      ===================================================== */}

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
              title:
                e.target.value,
            }))
          }
        />
      </div>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          rows={4}
          placeholder="Chapter description..."
          value={
            form.description
          }
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              description:
                e.target.value,
            }))
          }
        />
      </div>

      {/* =====================================================
          CONTENT TYPE
      ===================================================== */}

      <div className="space-y-2">
        <Label>
          Content Type
        </Label>

        <Select
          value={
            form.type ??
            undefined
          }
          onValueChange={
            handleTypeChange
          }
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

      {/* =====================================================
          FILE UPLOAD
      ===================================================== */}

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
              e.target.files?.[0] ??
              null;

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
            Selected:{" "}
            {fileName}
          </p>
        )}
      </div>

      {/* =====================================================
          QUIZ SECTION
      ===================================================== */}

      <div className="rounded-lg border">
        <div className="flex items-center justify-between p-5">
          <div>
            <h3 className="text-lg font-semibold">
              Chapter Quiz
            </h3>

            <p className="text-sm text-muted-foreground">
              Optionally add a quiz
              to this chapter.
            </p>
          </div>

          {!hasQuiz ? (
            <Button
              type="button"
              variant="outline"
              onClick={
                enableQuiz
              }
            >
              + Add Quiz
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={
                disableQuiz
              }
            >
              Remove Quiz
            </Button>
          )}
        </div>

        {hasQuiz &&
          form.quizData && (
            <div className="space-y-6 border-t p-5">

              {/* =================================================
                  QUIZ MARKS
              ================================================= */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* TOTAL MARKS */}

                <div className="space-y-2">
                  <Label>
                    Total Marks
                  </Label>

                  <Input
                    type="number"
                    min={1}
                    value={
                      form.quizData
                        .totalMarks
                    }
                    onChange={(e) => {
                      const value =
                        Number(
                          e.target.value
                        );

                      setForm(
                        (prev) => ({
                          ...prev,

                          quizData:
                            prev.quizData
                              ? {
                                  ...prev.quizData,

                                  totalMarks:
                                    value,
                                }
                              : undefined,
                        })
                      );
                    }}
                  />
                </div>

                {/* PASSING MARKS */}

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

                      setForm(
                        (prev) => ({
                          ...prev,

                          quizData:
                            prev.quizData
                              ? {
                                  ...prev.quizData,

                                  passingMarks:
                                    value,
                                }
                              : undefined,
                        })
                      );
                    }}
                  />
                </div>
              </div>

              {/* =================================================
                  QUESTIONS HEADER
              ================================================= */}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    Questions
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Add questions with
                    four options.
                    Images are
                    optional.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    addQuestion
                  }
                >
                  + Add Question
                </Button>
              </div>

              {/* =================================================
                  QUESTIONS
              ================================================= */}

              <div className="space-y-5">
                {form.quizData.questions.map(
                  (
                    question,
                    questionIndex
                  ) => (
                    <div
                      key={
                        question._id
                      }
                      className="space-y-5 rounded-lg border p-5"
                    >
                      {/* =========================================
                          QUESTION HEADER
                      ========================================= */}

                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          Question{" "}
                          {questionIndex +
                            1}
                        </h4>

                        {form
                          .quizData!
                          .questions
                          .length >
                          1 && (
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

                      {/* =========================================
                          QUESTION TEXT
                      ========================================= */}

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

                      {/* =========================================
                          QUESTION IMAGE
                      ========================================= */}

                      <div className="space-y-3">
                        <div>
                          <Label>
                            Question Image

                            <span className="ml-1 text-muted-foreground">
                              (Optional)
                            </span>
                          </Label>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Add an image
                            to help
                            explain the
                            question.
                            PNG, JPG,
                            JPEG or
                            WebP.
                            Maximum
                            5 MB.
                          </p>
                        </div>

                        {/* =======================================
                            UPLOAD BUTTON
                        ======================================= */}

                        <div>
                          <label
                            htmlFor={`question-image-${question._id}`}
                            className="flex w-fit cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                          >
                            <Image className="h-4 w-4" />

                            {question.image
                              ? "Change Image"
                              : "Upload Image"}
                          </label>

                          <Input
                            id={`question-image-${question._id}`}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file =
                                e.target.files?.[0] ??
                                null;

                              handleQuestionImageChange(
                                questionIndex,
                                file
                              );

                              /*
                               * Allow selecting
                               * the same image
                               * again.
                               */
                              e.target.value =
                                "";
                            }}
                          />
                        </div>

                        {/* =======================================
                            IMAGE PREVIEW
                        ======================================= */}

                        {question.image && (
                          <div className="relative w-fit overflow-hidden rounded-lg border bg-muted">
                            <img
                              src={
                                typeof question.image ===
                                "string"
                                  ? question.image
                                  : URL.createObjectURL(
                                      question.image
                                    )
                              }
                              alt={`Question ${
                                questionIndex +
                                1
                              }`}
                              className="max-h-64 max-w-md object-contain"
                            />

                            {/* REMOVE BUTTON */}

                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-2 top-2 h-8 w-8"
                              onClick={() =>
                                removeQuestionImage(
                                  questionIndex
                                )
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* =========================================
                          OPTIONS
                      ========================================= */}

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
                                value={
                                  option
                                }
                                onChange={(
                                  e
                                ) =>
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

                      {/* =========================================
                          CORRECT ANSWER
                      ========================================= */}

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
                                    {
                                      option
                                    }
                                  </SelectItem>
                                );
                              }
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* =========================================
                          MARKS
                      ========================================= */}

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
                                marks:
                                  Math.max(
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

              {/* =================================================
                  MARKS SUMMARY
              ================================================= */}

              <div className="rounded-md bg-muted p-4 text-sm">
                <div className="flex justify-between">
                  <span>
                    Question marks
                  </span>

                  <span className="font-medium">
                    {
                      calculatedMarks
                    }
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

      {/* =====================================================
          SUBMIT
      ===================================================== */}

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