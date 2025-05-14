export interface AssessmentCourse {
  id: string;
  title: string;
  categoryName: string; 
}
export interface Assessment {
  id: string;
  courseId: string; 
  questions: Question[];
  createdAt: string;
}
export interface Question {
  courseId: string;
  question: string;
  options: string[];
  correctOption: number;
}
export interface AssessmentResult {
  studentName: string;
  marks: number;
  attempts: number;
  passed: boolean;
}