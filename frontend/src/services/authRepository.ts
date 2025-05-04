
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './auth';

const API_BASE_URL = 'http://localhost:3000/api/v1/auth';

export const authRepository = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // Attempt to parse error message from backend, fallback to generic message
        const errorMessage = data?.message || `Login failed with status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data as LoginResponse;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Login API error:', error.message);
            // Re-throw the original error or a new error with more context
             throw new Error(`Login failed: ${error.message}`);
        }
        console.error('An unexpected error occurred during login:', error);
        throw new Error('Login failed due to an unexpected error.');
    }
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            const errorMessage = responseData?.message || `Registration failed with status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return responseData as RegisterResponse;
    } catch (error) {
         if (error instanceof Error) {
            console.error('Registration API error:', error.message);
            // Re-throw the original error or a new error with more context
             throw new Error(`Registration failed: ${error.message}`);
        }
        console.error('An unexpected error occurred during registration:', error);
        throw new Error('Registration failed due to an unexpected error.');
    }
  }
};
