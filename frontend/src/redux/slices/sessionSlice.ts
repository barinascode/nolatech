
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  active: boolean;
  hire_date: string;
  created_at: string;
  updated_at: string;
}

interface SessionState {
  token: string | null;
  employee: Employee | null;
}

const initialState: SessionState = {
  token: null,
  employee: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ token: string; employee: Employee }>) => {
      state.token = action.payload.token;
      state.employee = action.payload.employee;
    },
    clearSession: (state) => {
      state.token = null;
      state.employee = null;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
