export interface Lesson {
  id: number;
  title: string;
  visualIcon: string;
  shortDescription: string;
  content: string; // Markdown formatted bite-sized educational lesson
  challengeType: 'explain_back' | 'multiple_choice';
  challengePrompt: string;
  multipleChoiceOptions?: string[]; // Used if type is multiple_choice
  correctAnswer?: string; // Used if type is multiple_choice
  successCriteriaHint: string;
}

export interface Course {
  title: string;
  topic: string;
  difficulty: string;
  summary: string;
  lessons: Lesson[];
}

export interface EvaluationResult {
  passed: boolean;
  score: number; // 0-100
  feedback: string; // style encouraging feedback
  suggestedCorrection?: string;
}

export interface CourseGenerationRequest {
  topic?: string;
  materialText?: string;
  difficultyLevel?: string;
}

export interface ChallengeEvaluationRequest {
  courseTitle: string;
  lessonTitle: string;
  challengePrompt: string;
  userAnswer: string;
  challengeType: 'explain_back' | 'multiple_choice';
  correctAnswer?: string;
}
