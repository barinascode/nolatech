
/**
 * Represents the structure of an employee object from the API.
 */
export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  active: boolean;
  hire_date: string;
  created_at: string;
  updated_at: string;
  // Optional fields sometimes present in API responses
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  password?: string; // Included in some responses, but usually not needed/wanted client-side
}

/**
 * Represents the response structure when fetching a list of employees.
 */
export interface FetchEmployeesResponse {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
}
