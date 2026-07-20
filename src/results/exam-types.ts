export const EXAM_TYPES = [
  'Unit Examinations',
  'Practice Examinations',
  'Practical Examinations',
  'Pilot Examinations',
  'Mid Examinations',
  'Final Examinations',
] as const;

export type ExamType = (typeof EXAM_TYPES)[number];

export const EXAM_TYPE_DESCRIPTIONS: Record<ExamType, string> = {
  'Unit Examinations':
    "Assessments conducted after completing each unit to evaluate the student's understanding of that unit.",
  'Practice Examinations':
    'Practice or mock assessments conducted to help students prepare for formal examinations.',
  'Practical Examinations':
    "Assessments used to evaluate the student's practical skills and hands-on knowledge.",
  'Pilot Examinations':
    'Trial assessments conducted before formal examinations to evaluate readiness and identify areas for improvement.',
  'Mid Examinations':
    "Assessments conducted in the middle of the course or semester to evaluate students' progress before the final examination.",
  'Final Examinations':
    'Final assessments conducted at the end of the course, term, or academic period.',
};

export const getExamTypeDescription = (examType: string) =>
  EXAM_TYPE_DESCRIPTIONS[examType as ExamType] ?? null;
