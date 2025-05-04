
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RegisterResponse } from '@/services/auth';

interface AuthState {
  registeredUser: RegisterResponse | null;
  registrationError: string | null;
}

const initialState: AuthState = {
  registeredUser: null,
  registrationError: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRegisteredUser: (state, action: PayloadAction<RegisterResponse>) => {
      state.registeredUser = action.payload;
      state.registrationError = null; // Clear error on success
    },
    setRegistrationError: (state, action: PayloadAction<string>) => {
      state.registrationError = action.payload;
      state.registeredUser = null; // Clear user data on error
    },
    clearAuthState: (state) => {
      state.registeredUser = null;
      state.registrationError = null;
    }
  },
});

export const { setRegisteredUser, setRegistrationError, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
