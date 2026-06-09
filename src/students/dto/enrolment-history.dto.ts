/**
 * Response shape returned by GET /students/:id/enrolment-history.
 *
 * Derived from the existing Student document — no new schema fields required.
 * If per-module enrollment tracking is needed in future, extend this DTO
 * and add a sub-document array to the Student schema at that time.
 */
export class EnrolmentHistoryDto {
  // MongoDB _id of the student document
  studentId: string;

  // Human-readable generated student ID (e.g. "STU-1717600000000-042")
  studentCode: string;

  name: string;
  email: string;
  phone: string;

  // List of module/course names the student enrolled in
  modules: string[];

  // Intake batch name
  batch: string;

  // Current registration status
  status: 'pending' | 'approved' | 'rejected';

  // ISO date string — when the registration was submitted
  enrolledAt: string;

  // ISO date string — when the admin approved the registration (null if not yet approved)
  approvedAt: string | null;

  // Reason provided if the registration was rejected
  rejectionReason?: string;
}