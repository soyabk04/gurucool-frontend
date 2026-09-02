import { api } from "@/api/axios";

import type {
  QuizQuestion,
  QuizAnswer,
  QuizSubmitResponse,
} from "@/types/course";

/**
 * Get quiz questions for a chapter.
 *
 * The backend intentionally removes the correct answer,
 * so the frontend never receives the answer key.
 */
export const getQuizQuestions = async (
  chapterId: string
): Promise<QuizQuestion[]> => {
  const response = await api.get(
    `/courses/questions/${chapterId}`
  );

  return response.data;
};

/**
 * Submit the user's quiz answers.
 */
export const submitQuiz = async (
  userAnswers: QuizAnswer[]
): Promise<QuizSubmitResponse> => {
  const response = await api.post(
    "/courses/quiz/submit",
    {
      userAnswers,
    }
  );

  return response.data;
};