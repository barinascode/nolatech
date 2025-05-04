
/**
 * Represents the request body for the login API.
 */
export interface LoginRequest {
  /**
   * The user's email address.
   */
  email: string;
  /**
   * The user's password.
   */
  password: string;
}

/**
 * Represents the request body for the registration API.
 */
export interface RegisterRequest {
  /**
   * The user's first name.
   */
  first_name: string;
  /**
   * The user's last name.
   */
  last_name: string;
  /**
   * The user's email address.
   */
  email: string;
  /**
   * The user's password.
   */
  password: string;
}


/**
 * Represents the employee data.
 */
export interface Employee {
  /**
   * The unique identifier for the employee.
   */
  _id: string;
  /**
   * The first name of the employee.
   */
  first_name: string;
  /**
   * The last name of the employee.
   */
  last_name: string;
  /**
   * The email address of the employee.
   */
  email: string;
  /**
   * The role of the employee.
   */
  role: string;
  /**
   * Indicates whether the employee is active.
   */
  active?: boolean; // Made optional as it's not in register response
  /**
   * The date when the employee was hired.
   */
  hire_date?: string; // Made optional as it's not in register response
  /**
   * The date when the employee was created.
   */
  created_at?: string; // Made optional as it's not in register response
  /**
   * The date when the employee was last updated.
   */
  updated_at?: string; // Made optional as it's not in register response
}

/**
 * Represents the response from the login API.
 */
export interface LoginResponse {
  /**
   * The authentication token.
   */
  token: string;
  /**
   * The employee data.
   */
  employee: Employee;
}

/**
 * Represents the response from the registration API.
 */
export interface RegisterResponse extends Omit<Employee, 'active' | 'hire_date' | 'created_at' | 'updated_at'> {}


/**
 * Asynchronously authenticates a user with the provided credentials.
 *
 * @param credentials The user's login credentials.
 * @returns A promise that resolves to a LoginResponse object containing the authentication token and employee data.
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  // This is a placeholder/mock function. It should be removed or updated
  // when the actual API call is implemented in authRepository.
  console.log('login called with ', credentials);

  return {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhpam9AZ21haWwuY29tIiwicm9sZSI6IkVtcGxveWVlIiwiaWF0IjoxNzQ2MzA5NzIzLCJleHAiOjE3NDYzMTMzMjN9.zHcGIw7RFnaBpmAjHaELndZRJGWMdfNntj9ayhDPXzE',
    employee: {
      _id: '68165f0371c6aa482c26105a',
      first_name: 'Esteban',
      last_name: 'Tapia',
      email: 'hijo@gmail.com',
      role: 'Employee',
      active: true,
      hire_date: '2025-05-03T22:02:03.008Z',
      created_at: '2025-05-03T22:02:03.008Z',
      updated_at: '2025-05-03T22:02:03.008Z',
    },
  };
}

/**
 * Asynchronously registers a new user.
 *
 * @param data The user's registration data.
 * @returns A promise that resolves to a RegisterResponse object containing the newly created employee data.
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
   // This is a placeholder/mock function. It should be removed or updated
  // when the actual API call is implemented in authRepository.
  console.log('register called with ', data);
  // Simulate API response structure
  return {
    _id: '6816df41d1e0e5140f0729ec', // Example ID
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    role: 'Employee', // Default role from example response
  };
}
