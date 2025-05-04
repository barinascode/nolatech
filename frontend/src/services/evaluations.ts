/**
 * Represents a simplified view of an employee, often nested within other objects.
 */
export interface EmployeeBrief {
  _id: string;
  first_name: string;
  last_name: string;
  email?: string; // Email might not always be present in brief details
  role?: string;
  active?: boolean; // Optional fields based on context
  hire_date?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string; // Sometimes APIs use different casing
  updatedAt?: string;
  __v?: number; // Version key, often included but not usually needed
}

/**
 * Represents a question within an evaluation.
 */
export interface EvaluationQuestion {
  type: 'open' | 'scale'; // Add other types as needed
  text: string;
  _id: string; // Ensure _id is always present in the fetched question data
  competency?: string; // Optional based on type (e.g., for 'scale')
  options?: string[]; // Optional based on type (e.g., for 'multiple_choice')
}

/**
 * Represents a brief view of feedback provided for an evaluation.
 */
export interface FeedbackBrief {
  _id: string;
  evaluator_id: string; // Keep as string ID for simplicity here, can be expanded later if needed
  evaluation_id: string;
  comment?: string; // Optional
  rating?: number; // Optional, might be present for overall feedback
  competency_scores?: Record<string, number>; // Optional, common for scale questions
  replied?: boolean; // Optional, indicates if feedback was acknowledged/replied to
  date?: string; // Date feedback was submitted
  __v?: number;
}

/**
 * Represents the main Evaluation data structure based on the API response.
 * This is used for both listing and detailed view.
 */
export interface Evaluation {
  /** Unique identifier for the evaluation */
  _id: string;
  /** Name of the evaluation */
  name: string;
  /** Description of the evaluation */
  description: string;
  /** The employee who created/owns the evaluation template */
  employee_id: EmployeeBrief;
  /** Employees assigned to provide feedback */
  evaluator_ids: EmployeeBrief[]; // Can be brief or full employee details depending on API endpoint
  /** ISO Date string when the evaluation period starts */
  start_date: string;
  /** ISO Date string when the evaluation period ends */
  end_date: string;
  /** Current status of the evaluation process */
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  /** Array of questions included in the evaluation */
  questions: EvaluationQuestion[];
  /** Array of feedback submitted so far (can be brief or full feedback details) */
  feedback_ids: FeedbackBrief[];
  /** The employee being evaluated in this instance */
  evaluated_id: EmployeeBrief; // Can be brief or full employee details
  createdAt?: string; // Optional timestamps
  updatedAt?: string;
  __v?: number; // Optional version key
}


/**
 * Represents the response structure when fetching evaluations for an employee.
 * It's an array of Evaluation objects.
 */
export type FetchEvaluationsResponse = Evaluation[];

/**
 * Represents the response structure when fetching evaluations assigned to an employee.
 * It's an array of Evaluation objects.
 */
export type FetchAssignedEvaluationsResponse = Evaluation[];

/**
 * Represents the response structure when fetching a single evaluation by its ID.
 * It's a single Evaluation object.
 */
export type FetchEvaluationDetailsResponse = Evaluation;


/**
 * Represents the request body for creating a new evaluation.
 */
export interface CreateEvaluationRequest {
  name: string;
  description: string;
  employee_id: string; // ID of the creator
  evaluator_ids: string[]; // Array of employee IDs
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  questions: Omit<EvaluationQuestion, '_id'>[]; // Questions without IDs for creation
  evaluated_id: string; // ID of the employee being evaluated
}

/**
 * Represents the response structure after successfully creating an evaluation.
 * It mirrors the main Evaluation structure but might have slight differences initially.
 */
export interface CreateEvaluationResponse extends Omit<Evaluation, 'status' | 'feedback_ids'> {
   status: 'pending'; // Newly created evaluations start as pending
   feedback_ids: []; // Initially empty
   createdAt?: string;
   updatedAt?: string;
   __v?: number;
}


/**
 * Represents the request body for updating an existing evaluation.
 * Note: employee_id might not be updatable, depending on API logic.
 * Status might also be handled differently (e.g., separate endpoint).
 */
export interface UpdateEvaluationRequest {
  name: string;
  description: string;
  evaluator_ids: string[]; // Array of employee IDs
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'; // Include status
  questions: Array<Omit<EvaluationQuestion, '_id'> & { _id?: string }>; // Allow existing IDs for updates
  evaluated_id: string; // ID of the employee being evaluated
  employee_id?: string; // Usually creator ID is not changed, but check API requirements
}

/**
 * Represents the response structure after successfully updating an evaluation.
 * Usually returns the updated Evaluation object.
 */
export type UpdateEvaluationResponse = Evaluation;
