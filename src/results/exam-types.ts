export const EXAM_TYPES = [
  'Unit Examinations',
  'Practical Examinations',
  'Practice Examinations - 1',
  'Practice Examinations - 2',
  'Practice Examinations - 3',
  'Practice Examinations - 4',
  'Practice Examinations - 5',
  'Practice Examinations - 6',
  'Practice Examinations - 7',
  'Pilot Examinations',
] as const;

export type ExamType = (typeof EXAM_TYPES)[number];

export const EXAM_TYPE_DESCRIPTIONS: Record<ExamType, string> = {
  'Unit Examinations':
    "Assessments conducted after completing each unit to evaluate the student's understanding of that unit.",
  'Practical Examinations':
    "Assessments used to evaluate the student's practical skills and hands-on knowledge.",
  'Practice Examinations - 1':
    'Practice or mock assessments conducted to help students prepare for formal examinations.',
  'Practice Examinations - 2':
    'Practice or mock assessments conducted to help students prepare for formal examinations.',
  'Practice Examinations - 3':
    'Practice or mock assessments conducted to help students prepare for formal examinations.',
  'Practice Examinations - 4':
    'Practice or mock assessments conducted to help students prepare for formal examinations.',
  'Practice Examinations - 5':
    'Practice or mock assessments conducted to help students prepare for formal examinations.',
  'Practice Examinations - 6':
    'Practice or mock assessments conducted to help students prepare for formal examinations.',
  'Practice Examinations - 7':
    'Practice or mock assessments conducted to help students prepare for formal examinations.',
  'Pilot Examinations':
    'Trial assessments conducted before formal examinations to evaluate readiness and identify areas for improvement.',
};

export const getExamTypeDescription = (examType: string) =>
  EXAM_TYPE_DESCRIPTIONS[examType as ExamType] ?? null;
