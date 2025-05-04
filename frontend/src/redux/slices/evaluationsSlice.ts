
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
    Evaluation,
    FetchEvaluationsResponse,
    CreateEvaluationRequest,
    CreateEvaluationResponse,
    FetchEvaluationDetailsResponse,
    UpdateEvaluationRequest,
    UpdateEvaluationResponse,
    FetchAssignedEvaluationsResponse // Add new type
} from '@/services/evaluations';
import { evaluationsRepository } from '@/services/evaluationsRepository';
import type { RootState } from '@/redux/store';

interface EvaluationsState {
  evaluations: Evaluation[]; // Evaluations created by the user
  assignedEvaluations: Evaluation[]; // Evaluations assigned to the user
  currentEvaluation: Evaluation | null; // To store details of the currently viewed/edited evaluation
  loading: boolean; // For list fetching (My Evaluations)
  loadingAssigned: boolean; // For list fetching (Assigned Evaluations)
  loadingDetails: boolean; // For single evaluation fetching
  error: string | null; // For list fetching error (My Evaluations)
  errorAssigned: string | null; // For list fetching error (Assigned Evaluations)
  detailsError: string | null; // For single evaluation fetching error
  creating: boolean;
  createError: string | null;
  updating: boolean; // Add state for update loading
  updateError: string | null; // Add state for update error
}

const initialState: EvaluationsState = {
  evaluations: [],
  assignedEvaluations: [],
  currentEvaluation: null,
  loading: false,
  loadingAssigned: false,
  loadingDetails: false,
  error: null,
  errorAssigned: null,
  detailsError: null,
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
};

// Async thunk for fetching evaluations created by the logged-in employee
export const fetchEvaluations = createAsyncThunk<
  FetchEvaluationsResponse,
  void,
  { state: RootState; rejectValue: string }
>(
  'evaluations/fetchMyEvaluations', // Renamed for clarity
  async (_, { getState, rejectWithValue }) => {
    const { session } = getState();
    const employeeId = session.employee?._id;
    const token = session.token;

    if (!employeeId || !token) {
      const errorMsg = !employeeId ? 'Employee ID not found.' : 'Auth token not found.';
      console.error(`fetchEvaluations rejected: ${errorMsg}`);
      return rejectWithValue(`${errorMsg} Cannot fetch evaluations.`);
    }

    console.log(`Dispatching fetchEvaluations for employeeId: ${employeeId}`);

    try {
      const response = await evaluationsRepository.fetchEvaluationsByEmployee(employeeId, token);
      console.log('Evaluations fetched successfully in thunk:', response.length);
      return response;
    } catch (error: any) {
      console.error('Error in fetchEvaluations thunk:', error.message);
      return rejectWithValue(error.message || 'An unknown error occurred while fetching evaluations');
    }
  }
);

// Async thunk for fetching evaluations assigned to the logged-in employee
export const fetchAssignedEvaluations = createAsyncThunk<
  FetchAssignedEvaluationsResponse,
  void,
  { state: RootState; rejectValue: string }
>(
  'evaluations/fetchAssignedEvaluations',
  async (_, { getState, rejectWithValue }) => {
    const { session } = getState();
    const employeeId = session.employee?._id; // The current user is the evaluator
    const token = session.token;

    if (!employeeId || !token) {
      const errorMsg = !employeeId ? 'Employee ID not found.' : 'Auth token not found.';
      console.error(`fetchAssignedEvaluations rejected: ${errorMsg}`);
      return rejectWithValue(`${errorMsg} Cannot fetch assigned evaluations.`);
    }

    console.log(`Dispatching fetchAssignedEvaluations for evaluatorId: ${employeeId}`);

    try {
      // Use the new repository function
      const response = await evaluationsRepository.fetchAssignedEvaluations(employeeId, token);
      console.log('Assigned evaluations fetched successfully:', response.length);
      return response;
    } catch (error: any) {
      console.error('Error in fetchAssignedEvaluations thunk:', error.message);
      return rejectWithValue(error.message || 'An unknown error occurred while fetching assigned evaluations');
    }
  }
);


// Async thunk for fetching details of a single evaluation
export const fetchEvaluationDetails = createAsyncThunk<
  FetchEvaluationDetailsResponse,
  string, // Argument type: evaluationId
  { state: RootState; rejectValue: string }
>(
  'evaluations/fetchEvaluationDetails',
  async (evaluationId, { getState, rejectWithValue }) => {
    const { session } = getState();
    const token = session.token;

    if (!token) {
      console.error('fetchEvaluationDetails rejected: Auth token not found.');
      return rejectWithValue('Authentication token not found.');
    }
    if (!evaluationId) {
        console.error('fetchEvaluationDetails rejected: Evaluation ID is required.');
        return rejectWithValue('Evaluation ID is required.');
    }

    console.log(`Dispatching fetchEvaluationDetails for ID: ${evaluationId}`);

    try {
      const response = await evaluationsRepository.fetchEvaluationById(evaluationId, token);
      console.log('Evaluation details fetched successfully:', response._id);
      return response;
    } catch (error: any) {
      console.error('Error in fetchEvaluationDetails thunk:', error.message);
      return rejectWithValue(error.message || 'An unknown error occurred while fetching evaluation details');
    }
  }
);


// Async thunk for creating a new evaluation
export const createEvaluation = createAsyncThunk<
  CreateEvaluationResponse,
  CreateEvaluationRequest,
  { state: RootState; rejectValue: string }
>(
  'evaluations/createEvaluation',
  async (evaluationData, { getState, rejectWithValue }) => {
    const { session } = getState();
    const token = session.token;

    if (!token) {
      console.error('createEvaluation rejected: Auth token not found.');
      return rejectWithValue('Authentication token not found. Cannot create evaluation.');
    }

    console.log('Dispatching createEvaluation...');

    try {
      const response = await evaluationsRepository.createEvaluation(evaluationData, token);
      console.log('Evaluation created successfully in thunk:', response._id);
      return response;
    } catch (error: any) {
      console.error('Error in createEvaluation thunk:', error.message);
      return rejectWithValue(error.message || 'An unknown error occurred while creating the evaluation');
    }
  }
);

// Async thunk for updating an existing evaluation
export const updateEvaluation = createAsyncThunk<
  UpdateEvaluationResponse,
  { evaluationId: string; evaluationData: UpdateEvaluationRequest }, // Argument type
  { state: RootState; rejectValue: string } // ThunkAPI config
>(
  'evaluations/updateEvaluation',
  async ({ evaluationId, evaluationData }, { getState, rejectWithValue }) => {
    const { session } = getState();
    const token = session.token;

    if (!token) {
      console.error('updateEvaluation rejected: Auth token not found.');
      return rejectWithValue('Authentication token not found.');
    }
     if (!evaluationId) {
        console.error('updateEvaluation rejected: Evaluation ID is required.');
        return rejectWithValue('Evaluation ID is required.');
    }

    console.log(`Dispatching updateEvaluation for ID: ${evaluationId}`);

    try {
      const response = await evaluationsRepository.updateEvaluation(evaluationId, evaluationData, token);
      console.log('Evaluation updated successfully:', response._id);
      return response; // Payload of fulfilled action
    } catch (error: any) {
      console.error('Error in updateEvaluation thunk:', error.message);
      return rejectWithValue(error.message || 'An unknown error occurred while updating the evaluation');
    }
  }
);


export const evaluationsSlice = createSlice({
  name: 'evaluations',
  initialState,
  reducers: {
    clearEvaluationsError: (state) => {
      state.error = null;
    },
    clearAssignedEvaluationsError: (state) => {
      state.errorAssigned = null;
    },
    clearDetailsError: (state) => {
        state.detailsError = null;
    },
    clearCreateEvaluationError: (state) => {
      state.createError = null;
    },
     clearUpdateEvaluationError: (state) => {
      state.updateError = null;
    },
    clearEvaluations: (state) => { // Clears all evaluation-related state
      state.evaluations = [];
      state.assignedEvaluations = [];
      state.currentEvaluation = null;
      state.loading = false;
      state.loadingAssigned = false;
      state.loadingDetails = false;
      state.error = null;
      state.errorAssigned = null;
      state.detailsError = null;
      state.creating = false;
      state.createError = null;
      state.updating = false;
      state.updateError = null;
      console.log('Cleared all evaluations state.');
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Evaluations Cases
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action: PayloadAction<FetchEvaluationsResponse>) => {
        state.loading = false;
        state.evaluations = action.payload;
        state.error = null;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch evaluations.';
        state.evaluations = [];
      })
      // Fetch Assigned Evaluations Cases
      .addCase(fetchAssignedEvaluations.pending, (state) => {
        state.loadingAssigned = true;
        state.errorAssigned = null;
      })
      .addCase(fetchAssignedEvaluations.fulfilled, (state, action: PayloadAction<FetchAssignedEvaluationsResponse>) => {
        state.loadingAssigned = false;
        state.assignedEvaluations = action.payload;
        state.errorAssigned = null;
      })
      .addCase(fetchAssignedEvaluations.rejected, (state, action) => {
        state.loadingAssigned = false;
        state.errorAssigned = action.payload ?? 'Failed to fetch assigned evaluations.';
        state.assignedEvaluations = [];
      })
      // Fetch Evaluation Details Cases
       .addCase(fetchEvaluationDetails.pending, (state) => {
        state.loadingDetails = true;
        state.detailsError = null;
        state.currentEvaluation = null; // Clear previous details
      })
      .addCase(fetchEvaluationDetails.fulfilled, (state, action: PayloadAction<FetchEvaluationDetailsResponse>) => {
        state.loadingDetails = false;
        state.currentEvaluation = action.payload;
        state.detailsError = null;
      })
      .addCase(fetchEvaluationDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.detailsError = action.payload ?? 'Failed to fetch evaluation details.';
        state.currentEvaluation = null;
      })
       // Create Evaluation Cases
       .addCase(createEvaluation.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createEvaluation.fulfilled, (state, action: PayloadAction<CreateEvaluationResponse>) => {
        state.creating = false;
        // Don't add directly, rely on fetchEvaluations to refresh the list
        // state.evaluations.push(action.payload); // Potential inconsistencies
        state.createError = null;
      })
      .addCase(createEvaluation.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload ?? 'Failed to create evaluation.';
      })
      // Update Evaluation Cases
       .addCase(updateEvaluation.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateEvaluation.fulfilled, (state, action: PayloadAction<UpdateEvaluationResponse>) => {
        state.updating = false;
        // Update the evaluation in the list if it exists
        const index = state.evaluations.findIndex(ev => ev._id === action.payload._id);
        if (index !== -1) {
          state.evaluations[index] = action.payload;
        }
        // Also update in assigned evaluations list if present
        const assignedIndex = state.assignedEvaluations.findIndex(ev => ev._id === action.payload._id);
        if (assignedIndex !== -1) {
          state.assignedEvaluations[assignedIndex] = action.payload;
        }
        // Update currentEvaluation if it's the one being edited
        if (state.currentEvaluation?._id === action.payload._id) {
          state.currentEvaluation = action.payload;
        }
        state.updateError = null;
      })
      .addCase(updateEvaluation.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload ?? 'Failed to update evaluation.';
      });
  },
});

export const {
    clearEvaluationsError,
    clearAssignedEvaluationsError,
    clearDetailsError,
    clearCreateEvaluationError,
    clearUpdateEvaluationError,
    clearEvaluations
} = evaluationsSlice.actions;

export default evaluationsSlice.reducer;
