
import type { FetchEmployeesResponse } from './employees';

// Use environment variable for base URL if available, otherwise fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_EMPLOYEES || 'http://localhost:3000/api/v1/employees';

export const employeesRepository = {
  /**
   * Fetches a list of all employees.
   * @param token The authentication token.
   * @returns A promise that resolves to the employee list response.
   */
  async fetchEmployees(token: string): Promise<FetchEmployeesResponse> {
    if (!token) {
      console.error('fetchEmployees error: Auth token is required.');
      throw new Error('Authentication token is required.');
    }

    const url = `${API_BASE_URL}`;
    console.log(`Fetching employees from: ${url}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the auth token
        },
      });

      console.log(`Fetch employees response status: ${response.status}`);

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.message || `Failed to fetch employees with status: ${response.status}`;
        console.error('Fetch Employees API Error Data:', data);
        throw new Error(errorMessage);
      }

       if (data && Array.isArray(data.employees)) {
           console.log(`Successfully fetched ${data.employees.length} employees.`);
       } else {
           console.warn('API did not return the expected structure for employees:', data);
           // Return a default structure or throw error based on requirements
           return { employees: [], total: 0, page: 1, limit: 0 };
       }

      return data as FetchEmployeesResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Fetch Employees API error:', error.message, error.stack);
        throw new Error(`Failed to retrieve employees. Please check your connection or try again later. (Details: ${error.message})`);
      }
      console.error('An unexpected error occurred during employee fetch:', error);
      throw new Error('Fetching employees failed due to an unexpected network or server error.');
    }
  },

  // Add other employee-related API calls here if needed (e.g., fetchById, create, update)
};
