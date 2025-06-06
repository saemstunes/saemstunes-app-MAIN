
import { supabase } from "@/integrations/supabase/client";

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  questions: QuizQuestion[];
  category: string;
  access_level: 'free' | 'premium' | 'basic' | 'private';
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number | null;
  answers: Record<string, any>;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

const parseQuestions = (questions: any): QuizQuestion[] => {
  if (Array.isArray(questions)) {
    return questions;
  }
  if (typeof questions === 'string') {
    try {
      return JSON.parse(questions);
    } catch {
      return [];
    }
  }
  return [];
};

const parseAnswers = (answers: any): Record<string, any> => {
  if (typeof answers === 'object' && answers !== null) {
    return answers;
  }
  if (typeof answers === 'string') {
    try {
      return JSON.parse(answers);
    } catch {
      return {};
    }
  }
  return {};
};

export const fetchQuizzes = async (): Promise<Quiz[]> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quizzes:', error.message);
    throw error;
  }

  // Parse the questions JSON field
  return (data || []).map(quiz => ({
    ...quiz,
    questions: parseQuestions(quiz.questions)
  }));
};

export const fetchQuizById = async (quizId: string): Promise<Quiz | null> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single();

  if (error) {
    console.error('Error fetching quiz:', error.message);
    return null;
  }

  // Parse the questions JSON field
  return {
    ...data,
    questions: parseQuestions(data.questions)
  };
};

export const fetchQuizzesByCategory = async (category: string): Promise<Quiz[]> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('category', category)
    .order('difficulty', { ascending: true });

  if (error) {
    console.error('Error fetching quizzes by category:', error.message);
    throw error;
  }

  // Parse the questions JSON field
  return (data || []).map(quiz => ({
    ...quiz,
    questions: parseQuestions(quiz.questions)
  }));
};

export const saveQuizAttempt = async (
  userId: string,
  quizId: string,
  score: number,
  answers: Record<string, any>,
  completed: boolean = true
): Promise<QuizAttempt | null> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_id: quizId,
      score,
      answers,
      completed
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving quiz attempt:', error.message);
    return null;
  }

  // Parse the answers JSON field
  return {
    ...data,
    answers: parseAnswers(data.answers)
  };
};

export const fetchUserQuizAttempts = async (userId: string): Promise<QuizAttempt[]> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user quiz attempts:', error.message);
    return [];
  }

  // Parse the answers JSON field
  return (data || []).map(attempt => ({
    ...attempt,
    answers: parseAnswers(attempt.answers)
  }));
};

export const getQuizProgress = async (userId: string, quizId: string): Promise<QuizAttempt | null> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('quiz_id', quizId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching quiz progress:', error.message);
    return null;
  }

  if (!data) return null;

  // Parse the answers JSON field
  return {
    ...data,
    answers: parseAnswers(data.answers)
  };
};

export const getDifficultyLabel = (difficulty: number): string => {
  if (difficulty <= 3) return "Beginner";
  if (difficulty <= 6) return "Intermediate";
  return "Advanced";
};

export const getDifficultyColor = (difficulty: number): string => {
  if (difficulty <= 3) return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
  if (difficulty <= 6) return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
};
