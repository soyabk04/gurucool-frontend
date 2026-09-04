import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { toast } from "sonner";

import {
  ArrowLeft,
  Check,
  FileVideo,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  getChapter,
  editChapter,
} from "@/services/chapter.services";
import {
  getQuizQuestions,
} from "@/services/quiz.service";

import type { Chapter } from "@/types/course";


// ==========================================
// Types
// ==========================================

type QuizQuestion = {
  _id?: string;
  question: string;
  options: string[];
  answer: string;
  marks: number;
};

type QuizSettings = {
  passingMarks?: number;
  totalMarks?: number;
};

type ChapterWithQuiz = Chapter & {
  quiz?: QuizSettings | null;
};


// ==========================================
// Component
// ==========================================

const EditChapter = () => {
  const { chapterId } =
    useParams<{
      chapterId: string;
    }>();

  const navigate = useNavigate();

  const fileInputRef =
    useRef<HTMLInputElement>(null);


  // ==========================================
  // Chapter
  // ==========================================

  const [chapter, setChapter] =
    useState<ChapterWithQuiz | null>(null);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");


  // ==========================================
  // Video
  // ==========================================

  const [video, setVideo] =
    useState<File | undefined>(undefined);

  const [videoPreview, setVideoPreview] =
    useState<string | null>(null);


  // ==========================================
  // Quiz
  // ==========================================

  const [hasQuiz, setHasQuiz] =
    useState(false);

  const [passingMarks, setPassingMarks] =
    useState(0);

  const [totalMarks, setTotalMarks] =
    useState(0);

  const [questions, setQuestions] =
    useState<QuizQuestion[]>([]);


  // ==========================================
  // State
  // ==========================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);


  // ==========================================
  // Fetch chapter + quiz questions
  // ==========================================

  useEffect(() => {
    if (!chapterId) {
      toast.error(
        "Chapter ID is missing"
      );

      setLoading(false);

      return;
    }

    const fetchChapter = async () => {
      try {
        setLoading(true);

        // --------------------------------------
        // Get chapter
        // --------------------------------------

        const data =
          (await getChapter(
            chapterId
          )) as ChapterWithQuiz;

        setChapter(data);

        setTitle(
          data.title ?? ""
        );

        setDescription(
          data.description ?? ""
        );


        // --------------------------------------
        // Get quiz questions separately
        // --------------------------------------

        try {
          const quizQuestions =
            await getQuizQuestions(
              chapterId
            );

          setQuestions(
            quizQuestions ?? []
          );


          // If questions exist, a quiz exists
          if (
            quizQuestions &&
            quizQuestions.length > 0
          ) {
            setHasQuiz(true);
          } else if (
            data.quiz
          ) {
            // Quiz exists even if it has
            // zero questions.
            setHasQuiz(true);
          } else {
            setHasQuiz(false);
          }


          // ------------------------------------
          // Quiz settings
          // ------------------------------------

          if (data.quiz) {
            setPassingMarks(
              data.quiz.passingMarks ?? 0
            );

            setTotalMarks(
              data.quiz.totalMarks ?? 0
            );
          }
        } catch (quizError) {
          console.error(
            "Failed to fetch quiz questions:",
            quizError
          );

          setQuestions([]);

          // If chapter already tells us that
          // a quiz exists, keep it enabled.
          if (data.quiz) {
            setHasQuiz(true);

            setPassingMarks(
              data.quiz.passingMarks ?? 0
            );

            setTotalMarks(
              data.quiz.totalMarks ?? 0
            );
          } else {
            setHasQuiz(false);
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch chapter:",
          error
        );

        toast.error(
          "Failed to load chapter"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);


  // ==========================================
  // Video selection
  // ==========================================

  const handleVideoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    // ----------------------------------------
    // Validate video type
    // ----------------------------------------

    if (
      !file.type.startsWith("video/")
    ) {
      toast.error(
        "Please select a valid video file"
      );

      event.target.value = "";

      return;
    }


    // ----------------------------------------
    // 500MB limit
    // ----------------------------------------

    const maxSize =
      500 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "Video size cannot exceed 500MB"
      );

      event.target.value = "";

      return;
    }


    // ----------------------------------------
    // Remove previous preview
    // ----------------------------------------

    if (videoPreview) {
      URL.revokeObjectURL(
        videoPreview
      );
    }


    setVideo(file);

    const preview =
      URL.createObjectURL(file);

    setVideoPreview(preview);
  };


  // ==========================================
  // Cleanup preview
  // ==========================================

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(
          videoPreview
        );
      }
    };
  }, [videoPreview]);


  // ==========================================
  // Add quiz
  // ==========================================

  const handleAddQuiz = () => {
    setHasQuiz(true);

    setPassingMarks(0);

    setTotalMarks(0);

    setQuestions([]);
  };


  // ==========================================
  // Remove quiz
  // ==========================================

  const handleRemoveQuiz = () => {
    setHasQuiz(false);

    setPassingMarks(0);

    setTotalMarks(0);

    setQuestions([]);
  };


  // ==========================================
  // Add question
  // ==========================================

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      question: "",
      options: [
        "",
        "",
        "",
        "",
      ],
      answer: "",
      marks: 1,
    };

    setQuestions(
      (current) => [
        ...current,
        newQuestion,
      ]
    );
  };


  // ==========================================
  // Remove question
  // ==========================================

  const handleRemoveQuestion = (
    index: number
  ) => {
    setQuestions(
      (current) =>
        current.filter(
          (_, questionIndex) =>
            questionIndex !== index
        )
    );
  };


  // ==========================================
  // Update question
  // ==========================================

  const handleQuestionChange = (
    index: number,
    value: string
  ) => {
    setQuestions(
      (current) =>
        current.map(
          (question, questionIndex) =>
            questionIndex === index
              ? {
                  ...question,
                  question: value,
                }
              : question
        )
    );
  };


  // ==========================================
  // Update option
  // ==========================================

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      (current) =>
        current.map(
          (
            question,
            currentQuestionIndex
          ) => {
            if (
              currentQuestionIndex !==
              questionIndex
            ) {
              return question;
            }

            const options = [
              ...question.options,
            ];

            options[optionIndex] =
              value;

            return {
              ...question,
              options,
            };
          }
        )
    );
  };


  // ==========================================
  // Update answer
  // ==========================================

  const handleAnswerChange = (
    index: number,
    value: string
  ) => {
    setQuestions(
      (current) =>
        current.map(
          (question, questionIndex) =>
            questionIndex === index
              ? {
                  ...question,
                  answer: value,
                }
              : question
        )
    );
  };


  // ==========================================
  // Update marks
  // ==========================================

  const handleMarksChange = (
    index: number,
    value: number
  ) => {
    setQuestions(
      (current) =>
        current.map(
          (question, questionIndex) =>
            questionIndex === index
              ? {
                  ...question,
                  marks: value,
                }
              : question
        )
    );
  };


  // ==========================================
  // Validate quiz
  // ==========================================

  const validateQuiz = () => {
    if (!hasQuiz) {
      return true;
    }


    if (totalMarks <= 0) {
      toast.error(
        "Total marks must be greater than 0"
      );

      return false;
    }


    if (passingMarks < 0) {
      toast.error(
        "Passing marks cannot be negative"
      );

      return false;
    }


    if (
      passingMarks > totalMarks
    ) {
      toast.error(
        "Passing marks cannot be greater than total marks"
      );

      return false;
    }


    for (
      let index = 0;
      index < questions.length;
      index++
    ) {
      const question =
        questions[index];


      if (
        !question.question.trim()
      ) {
        toast.error(
          `Question ${
            index + 1
          } is required`
        );

        return false;
      }


      if (
        question.options.length !== 4
      ) {
        toast.error(
          `Question ${
            index + 1
          } must have 4 options`
        );

        return false;
      }


      for (
        let optionIndex = 0;
        optionIndex <
        question.options.length;
        optionIndex++
      ) {
        if (
          !question.options[
            optionIndex
          ].trim()
        ) {
          toast.error(
            `Option ${
              optionIndex + 1
            } in question ${
              index + 1
            } is required`
          );

          return false;
        }
      }


      if (
        !question.answer.trim()
      ) {
        toast.error(
          `Select the correct answer for question ${
            index + 1
          }`
        );

        return false;
      }


      if (
        !question.options.includes(
          question.answer
        )
      ) {
        toast.error(
          `Correct answer for question ${
            index + 1
          } is invalid`
        );

        return false;
      }


      if (
        question.marks <= 0
      ) {
        toast.error(
          `Marks for question ${
            index + 1
          } must be greater than 0`
        );

        return false;
      }
    }


    return true;
  };


  // ==========================================
  // Save
  // ==========================================

  const handleSave = async () => {
    if (!chapterId) {
      toast.error(
        "Chapter ID is missing"
      );

      return;
    }


    if (!title.trim()) {
      toast.error(
        "Chapter title is required"
      );

      return;
    }


    if (!description.trim()) {
      toast.error(
        "Chapter description is required"
      );

      return;
    }


    if (!validateQuiz()) {
      return;
    }


    try {
      setSaving(true);

      setUploadProgress(0);


      // ======================================
      // Chapter data
      // ======================================

      const chapterData:
        Partial<Chapter> = {
        title:
          title.trim(),

        description:
          description.trim(),
      };


      // ======================================
      // Quiz data
      // ======================================

      let quizData:
        | {
            deleteQuiz?: boolean;
            passingMarks?: number;
            totalMarks?: number;
            questions?: QuizQuestion[];
          }
        | undefined;


      // ======================================
      // UPDATE / CREATE QUIZ
      // ======================================

      if (hasQuiz) {
        quizData = {
          passingMarks,
          totalMarks,

          questions:
            questions.map(
              (question) => ({
                _id:
                  question._id,

                question:
                  question.question.trim(),

                options:
                  question.options.map(
                    (option) =>
                      option.trim()
                  ),

                answer:
                  question.answer.trim(),

                marks:
                  question.marks,
              })
            ),
        };
      }


      // ======================================
      // DELETE QUIZ
      //
      // Only send deleteQuiz if a quiz
      // actually existed before.
      // ======================================

      else if (
        chapter?.quiz ||
        questions.length > 0
      ) {
        quizData = {
          deleteQuiz: true,
        };
      }


      // ======================================
      // Save
      // ======================================

      await editChapter(
        chapterId,
        chapterData,
        quizData,
        video,
        (
          progress: number
        ) => {
          setUploadProgress(
            progress
          );
        }
      );


      toast.success(
        "Chapter updated successfully"
      );

      navigate(-1);
    } catch (error) {
      console.error(
        "Failed to update chapter:",
        error
      );

      toast.error(
        "Failed to update chapter"
      );
    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  // ==========================================
  // Chapter not found
  // ==========================================

  if (!chapter) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">

        <p className="text-muted-foreground">
          Chapter not found
        </p>

        <Button
          variant="outline"
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>

      </div>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">

      {/* ======================================
          Header
      ======================================= */}

      <div className="flex items-center gap-4">

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate(-1)
          }
          disabled={saving}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>


        <div>

          <h1 className="text-2xl font-semibold">
            Edit Chapter
          </h1>

          <p className="text-sm text-muted-foreground">
            Update chapter information,
            video and quiz
          </p>

        </div>

      </div>


      {/* ======================================
          Chapter Information
      ======================================= */}

      <Card>

        <CardHeader>

          <CardTitle>
            Chapter Information
          </CardTitle>

          <CardDescription>
            Update the basic information
            for this chapter.
          </CardDescription>

        </CardHeader>


        <CardContent className="space-y-6">

          <div className="space-y-2">

            <Label htmlFor="chapter-title">
              Chapter Title
            </Label>

            <Input
              id="chapter-title"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Enter chapter title"
              disabled={saving}
            />

          </div>


          <div className="space-y-2">

            <Label htmlFor="chapter-description">
              Description
            </Label>

            <Textarea
              id="chapter-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Enter chapter description"
              rows={6}
              disabled={saving}
            />

          </div>

        </CardContent>

      </Card>


      {/* ======================================
          Video
      ======================================= */}

      <Card>

        <CardHeader>

          <CardTitle>
            Chapter Video
          </CardTitle>

          <CardDescription>
            Replace the existing chapter
            video if required.
          </CardDescription>

        </CardHeader>


        <CardContent className="space-y-5">

          {!video &&
            chapter.videoUrl && (
              <div className="rounded-lg border p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileVideo className="h-5 w-5" />
                  </div>


                  <div>

                    <p className="font-medium">
                      Current video
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Upload a new video
                      to replace it.
                    </p>

                  </div>

                </div>

              </div>
            )}


          {!video &&
            !chapter.videoUrl && (
              <div className="rounded-lg border border-dashed p-6 text-center">

                <FileVideo className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />

                <p className="font-medium">
                  No video uploaded
                </p>

                <p className="text-sm text-muted-foreground">
                  Upload a video for this chapter.
                </p>

              </div>
            )}


          {video && (
            <div className="rounded-lg border p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileVideo className="h-5 w-5" />
                </div>


                <div className="min-w-0">

                  <p className="font-medium">
                    New video
                  </p>

                  <p className="truncate text-sm text-muted-foreground">
                    {video.name}
                  </p>

                </div>

              </div>

            </div>
          )}


          {videoPreview && (
            <div className="overflow-hidden rounded-lg border">

              <video
                src={videoPreview}
                controls
                className="max-h-[400px] w-full"
              />

            </div>
          )}


          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={
              handleVideoChange
            }
            className="hidden"
          />


          <Button
            type="button"
            variant="outline"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={saving}
          >
            <Upload className="mr-2 h-4 w-4" />

            {video
              ? "Choose Different Video"
              : chapter.videoUrl
                ? "Replace Video"
                : "Upload Video"}
          </Button>


          {video && (
            <p className="text-sm text-muted-foreground">
              The new video will replace
              the current video when you save.
            </p>
          )}

        </CardContent>

      </Card>


      {/* ======================================
          Quiz
      ======================================= */}

      <Card>

        <CardHeader>

          <div className="flex items-start justify-between gap-4">

            <div>

              <CardTitle>
                Chapter Quiz
              </CardTitle>

              <CardDescription>
                Add or update the quiz
                for this chapter.
              </CardDescription>

            </div>


            {hasQuiz && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={
                  handleRemoveQuiz
                }
                disabled={saving}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Quiz
              </Button>
            )}

          </div>

        </CardHeader>


        <CardContent>

          {/* ==================================
              No quiz
          =================================== */}

          {!hasQuiz && (
            <div className="rounded-lg border border-dashed p-8 text-center">

              <p className="mb-1 font-medium">
                No quiz
              </p>

              <p className="mb-5 text-sm text-muted-foreground">
                This chapter does not
                have a quiz.
              </p>


              <Button
                type="button"
                onClick={
                  handleAddQuiz
                }
                disabled={saving}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Quiz
              </Button>

            </div>
          )}


          {/* ==================================
              Quiz editor
          =================================== */}

          {hasQuiz && (
            <div className="space-y-6">

              {/* Quiz settings */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">

                  <Label htmlFor="passing-marks">
                    Passing Marks
                  </Label>

                  <Input
                    id="passing-marks"
                    type="number"
                    min={0}
                    value={passingMarks}
                    onChange={(event) =>
                      setPassingMarks(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    disabled={saving}
                  />

                </div>


                <div className="space-y-2">

                  <Label htmlFor="total-marks">
                    Total Marks
                  </Label>

                  <Input
                    id="total-marks"
                    type="number"
                    min={1}
                    value={totalMarks}
                    onChange={(event) =>
                      setTotalMarks(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    disabled={saving}
                  />

                </div>

              </div>


              {/* Questions header */}

              <div className="flex items-center justify-between gap-4">

                <div>

                  <h3 className="font-semibold">
                    Questions
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {questions.length}{" "}
                    question
                    {questions.length !== 1
                      ? "s"
                      : ""}
                  </p>

                </div>


                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={
                    handleAddQuestion
                  }
                  disabled={saving}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>

              </div>


              {/* No questions */}

              {questions.length === 0 && (
                <div className="rounded-lg border border-dashed p-8 text-center">

                  <p className="font-medium">
                    No questions
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Add questions to
                    this quiz.
                  </p>

                </div>
              )}


              {/* Questions */}

              <div className="space-y-5">

                {questions.map(
                  (
                    question,
                    questionIndex
                  ) => (
                    <div
                      key={
                        question._id ??
                        `new-${questionIndex}`
                      }
                      className="rounded-lg border p-5"
                    >

                      {/* Question header */}

                      <div className="mb-5 flex items-center justify-between gap-4">

                        <h4 className="font-semibold">
                          Question{" "}
                          {questionIndex + 1}
                        </h4>


                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            handleRemoveQuestion(
                              questionIndex
                            )
                          }
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                      </div>


                      {/* Question */}

                      <div className="space-y-2">

                        <Label>
                          Question
                        </Label>

                        <Textarea
                          value={
                            question.question
                          }
                          onChange={(
                            event
                          ) =>
                            handleQuestionChange(
                              questionIndex,
                              event.target
                                .value
                            )
                          }
                          placeholder="Enter your question"
                          rows={3}
                          disabled={saving}
                        />

                      </div>


                      {/* Options */}

                      <div className="mt-5 space-y-4">

                        <Label>
                          Options
                        </Label>


                        {question.options.map(
                          (
                            option,
                            optionIndex
                          ) => (
                            <div
                              key={
                                optionIndex
                              }
                              className="flex items-center gap-3"
                            >

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-medium">
                                {String.fromCharCode(
                                  65 +
                                    optionIndex
                                )}
                              </div>


                              <Input
                                value={
                                  option
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleOptionChange(
                                    questionIndex,
                                    optionIndex,
                                    event.target
                                      .value
                                  )
                                }
                                placeholder={`Option ${String.fromCharCode(
                                  65 +
                                    optionIndex
                                )}`}
                                disabled={
                                  saving
                                }
                              />

                            </div>
                          )
                        )}

                      </div>


                      {/* Answer + marks */}

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">

                        <div className="space-y-2">

                          <Label>
                            Correct Answer
                          </Label>


                          <select
                            value={
                              question.answer
                            }
                            onChange={(
                              event
                            ) =>
                              handleAnswerChange(
                                questionIndex,
                                event.target
                                  .value
                              )
                            }
                            disabled={
                              saving
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >

                            <option value="">
                              Select correct answer
                            </option>


                            {question.options.map(
                              (
                                option,
                                optionIndex
                              ) => (
                                <option
                                  key={
                                    optionIndex
                                  }
                                  value={
                                    option
                                  }
                                >
                                  {String.fromCharCode(
                                    65 +
                                      optionIndex
                                  )}
                                  {". "}
                                  {option ||
                                    `Option ${
                                      optionIndex +
                                      1
                                    }`}
                                </option>
                              )
                            )}

                          </select>

                        </div>


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
                            onChange={(
                              event
                            ) =>
                              handleMarksChange(
                                questionIndex,
                                Number(
                                  event.target
                                    .value
                                )
                              )
                            }
                            disabled={
                              saving
                            }
                          />

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>


              {/* Add another */}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={
                  handleAddQuestion
                }
                disabled={saving}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Question
              </Button>

            </div>
          )}

        </CardContent>

      </Card>


      {/* ======================================
          Actions
      ======================================= */}

      <div className="flex justify-end gap-3">

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate(-1)
          }
          disabled={saving}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>


        <Button
          type="button"
          onClick={
            handleSave
          }
          disabled={saving}
          className="min-w-[170px]"
        >

          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />

              {video
                ? `Uploading ${uploadProgress}%`
                : "Saving..."}
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}

        </Button>

      </div>

    </div>
  );
};


export default EditChapter;
