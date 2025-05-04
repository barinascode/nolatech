
import type {
    FetchEvaluationsResponse,
    CreateEvaluationRequest,
    CreateEvaluationResponse,
    FetchEvaluationDetailsResponse,
    UpdateEvaluationRequest,
    UpdateEvaluationResponse,
    FetchAssignedEvaluationsResponse // Add new type
} from './evaluations';

// Use environment variable for base URL if available, otherwise fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1/evaluations';

export const evaluationsRepository = {
  /**
   * Fetches evaluations where the specified employee is the creator (employee_id).
   * @param employeeId The ID of the employee whose created evaluations are to be fetched.
   * @param token The authentication token.
   * @returns A promise that resolves to an array of evaluations.
   */
  async fetchEvaluationsByEmployee(employeeId: string, token: string): Promise<FetchEvaluationsResponse> {
    if (!employeeId) {
        console.error('fetchEvaluationsByEmployee error: Employee ID is required.');
        throw new Error('Employee ID is required to fetch evaluations.');
    }
    if (!token) {
         console.error('fetchEvaluationsByEmployee error: Auth token is required.');
        throw new Error('Authentication token is required.');
    }

    const url = `${API_BASE_URL}/employee/${employeeId}`;
    console.log(`Fetching evaluations from: ${url}`); // Log the URL being fetched

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the auth token
        },
      });

      // Log response status
      console.log(`Fetch evaluations response status: ${response.status}`);

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.message || `Failed to fetch evaluations with status: ${response.status}`;
        console.error('Fetch Evaluations API Error Data:', data); // Log error data from API
        throw new Error(errorMessage);
      }

       // Log success and potentially the first item if data exists
      if (Array.isArray(data)) {
        console.log(`Successfully fetched ${data.length} evaluations.`);
        // if (data.length > 0) {
        //   console.log('First evaluation item:', data[0]); // Log first item for structure check
        // }
      } else {
         console.warn('API did not return an array for evaluations:', data);
         // Handle cases where the API might return a different structure unexpectedly
         return []; // Return empty array or handle as appropriate
      }


      // Assuming the API directly returns the array of evaluations as specified
      return data as FetchEvaluationsResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Fetch Evaluations API error:', error.message, error.stack);
        // Provide a more user-friendly error message if possible
        throw new Error(`Failed to retrieve evaluations. Please check your connection or try again later. (Details: ${error.message})`);
      }
      console.error('An unexpected error occurred during evaluation fetch:', error);
      throw new Error('Fetching evaluations failed due to an unexpected network or server error.');
    }
  },

    /**
   * Fetches evaluations assigned to a specific employee as an evaluator.
   * @param evaluatorId The ID of the employee whose assigned evaluations are to be fetched.
   * @param token The authentication token.
   * @returns A promise that resolves to an array of evaluations.
   * @todo Replace placeholder URL with the actual API endpoint for assigned evaluations.
   */
  async fetchAssignedEvaluations(evaluatorId: string, token: string): Promise<FetchAssignedEvaluationsResponse> {
    if (!evaluatorId) {
      console.error('fetchAssignedEvaluations error: Evaluator ID is required.');
      throw new Error('Evaluator ID is required to fetch assigned evaluations.');
    }
    if (!token) {
      console.error('fetchAssignedEvaluations error: Auth token is required.');
      throw new Error('Authentication token is required.');
    }

    // TODO: Replace this URL with the correct endpoint for fetching evaluations assigned to an evaluator
    // Example: const url = `${API_BASE_URL}/assigned-to/${evaluatorId}`;
    // Using fetchEvaluationsByEmployee as a temporary placeholder for UI development
    const url = `${API_BASE_URL}/employee/${evaluatorId}`; // <-- !! PLACEHOLDER !!
    console.warn(`Using placeholder URL for fetchAssignedEvaluations: ${url}. Replace with correct endpoint.`);
    console.log(`Fetching assigned evaluations from (placeholder): ${url}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`Fetch assigned evaluations response status: ${response.status}`);
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.message || `Failed to fetch assigned evaluations with status: ${response.status}`;
        console.error('Fetch Assigned Evaluations API Error Data:', data);
        throw new Error(errorMessage);
      }

      if (Array.isArray(data)) {
        console.log(`Successfully fetched ${data.length} assigned evaluations (using placeholder).`);
      } else {
        console.warn('API did not return an array for assigned evaluations (using placeholder):', data);
        return [];
      }

      return data as FetchAssignedEvaluationsResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Fetch Assigned Evaluations API error:', error.message, error.stack);
        throw new Error(`Failed to retrieve assigned evaluations. (Details: ${error.message})`);
      }
      console.error('An unexpected error occurred during assigned evaluation fetch:', error);
      throw new Error('Fetching assigned evaluations failed due to an unexpected network or server error.');
    }
  },


   /**
   * Creates a new evaluation.
   * @param evaluationData The data for the new evaluation.
   * @param token The authentication token.
   * @returns A promise that resolves to the newly created evaluation data.
   */
  async createEvaluation(evaluationData: CreateEvaluationRequest, token: string): Promise<CreateEvaluationResponse> {
    if (!token) {
      console.error('createEvaluation error: Auth token is required.');
      throw new Error('Authentication token is required.');
    }

    const url = `${API_BASE_URL}`; // POST to the base URL
    console.log(`Creating evaluation at: ${url} with data:`, JSON.stringify(evaluationData)); // Log stringified data

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(evaluationData),
      });

      console.log(`Create evaluation response status: ${response.status}`);

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.message || `Failed to create evaluation with status: ${response.status}`;
        console.error('Create Evaluation API Error Data:', data);
        throw new Error(errorMessage);
      }

      console.log('Successfully created evaluation:', data);
      return data as CreateEvaluationResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Create Evaluation API error:', error.message, error.stack);
        throw new Error(`Failed to create evaluation. Please check the data and try again. (Details: ${error.message})`);
      }
      console.error('An unexpected error occurred during evaluation creation:', error);
      throw new Error('Creating evaluation failed due to an unexpected network or server error.');
    }
  },

  /**
   * Fetches the details of a single evaluation by its ID.
   * @param evaluationId The ID of the evaluation to fetch.
   * @param token The authentication token.
   * @returns A promise that resolves to the evaluation details.
   */
  async fetchEvaluationById(evaluationId: string, token: string): Promise<FetchEvaluationDetailsResponse> {
    if (!evaluationId) {
      console.error('fetchEvaluationById error: Evaluation ID is required.');
      throw new Error('Evaluation ID is required.');
    }
    if (!token) {
      console.error('fetchEvaluationById error: Auth token is required.');
      throw new Error('Authentication token is required.');
    }

    const url = `${API_BASE_URL}/${evaluationId}`;
    console.log(`Fetching evaluation details from: ${url}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`Fetch evaluation details response status: ${response.status}`);
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.message || `Failed to fetch evaluation details with status: ${response.status}`;
        console.error('Fetch Evaluation Details API Error Data:', data);
        throw new Error(errorMessage);
      }

      console.log('Successfully fetched evaluation details:', data);
      return data as FetchEvaluationDetailsResponse;
    } catch (error) {
       if (error instanceof Error) {
        console.error('Fetch Evaluation Details API error:', error.message, error.stack);
        throw new Error(`Failed to retrieve evaluation details. (Details: ${error.message})`);
      }
      console.error('An unexpected error occurred during evaluation detail fetch:', error);
      throw new Error('Fetching evaluation details failed due to an unexpected network or server error.');
    }
  },

  /**
   * Updates an existing evaluation.
   * @param evaluationId The ID of the evaluation to update.
   * @param evaluationData The updated data for the evaluation.
   * @param token The authentication token.
   * @returns A promise that resolves to the updated evaluation data.
   */
  async updateEvaluation(evaluationId: string, evaluationData: UpdateEvaluationRequest, token: string): Promise<UpdateEvaluationResponse> {
    if (!evaluationId) {
      console.error('updateEvaluation error: Evaluation ID is required.');
      throw new Error('Evaluation ID is required.');
    }
    if (!token) {
      console.error('updateEvaluation error: Auth token is required.');
      throw new Error('Authentication token is required.');
    }

    const url = `${API_BASE_URL}/${evaluationId}`; // PUT to the specific evaluation URL
    console.log(`Updating evaluation at: ${url} with data:`, JSON.stringify(evaluationData)); // Log stringified data

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(evaluationData),
      });

      console.log(`Update evaluation response status: ${response.status}`);
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.message || `Failed to update evaluation with status: ${response.status}`;
        console.error('Update Evaluation API Error Data:', data);
        throw new Error(errorMessage);
      }

      console.log('Successfully updated evaluation:', data);
      return data as UpdateEvaluationResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Update Evaluation API error:', error.message, error.stack);
        throw new Error(`Failed to update evaluation. Please check the data and try again. (Details: ${error.message})`);
      }
      console.error('An unexpected error occurred during evaluation update:', error);
      throw new Error('Updating evaluation failed due to an unexpected network or server error.');
    }
  },

  // Add other evaluation-related API calls here (e.g., delete)
};
