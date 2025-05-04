
import { configureStore } from '@reduxjs/toolkit';
import { sessionSlice } from './slices/sessionSlice';
import { authSlice } from './slices/authSlice';
import { evaluationsSlice } from './slices/evaluationsSlice'; // Import the evaluations slice
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'; // Import types and constants for ignored actions
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const sessionPersistConfig = {
  key: 'session', // Keep session persisted
  storage,
};

const authPersistConfig = {
  key: 'auth', // Persist auth state
  storage,
  // blacklist: ['registrationError'] // Optionally blacklist error messages from being persisted
};

// No persistence config for evaluations needed by default, as it's fetched on load.

const persistedSessionReducer = persistReducer(sessionPersistConfig, sessionSlice.reducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authSlice.reducer);

export const store = configureStore({
  reducer: {
    session: persistedSessionReducer,
    auth: persistedAuthReducer,
    evaluations: evaluationsSlice.reducer, // Add the evaluations reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
         // Ignore specific action types from redux-persist and async thunks
        ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            'evaluations/fetchMyEvaluations/pending', // Updated action names
            'evaluations/fetchMyEvaluations/fulfilled',
            'evaluations/fetchMyEvaluations/rejected',
            'evaluations/fetchAssignedEvaluations/pending', // Add assigned actions
            'evaluations/fetchAssignedEvaluations/fulfilled',
            'evaluations/fetchAssignedEvaluations/rejected',
            'evaluations/fetchEvaluationDetails/pending',
            'evaluations/fetchEvaluationDetails/fulfilled',
            'evaluations/fetchEvaluationDetails/rejected',
            'evaluations/createEvaluation/pending',
            'evaluations/createEvaluation/fulfilled',
            'evaluations/createEvaluation/rejected',
            'evaluations/updateEvaluation/pending',
            'evaluations/updateEvaluation/fulfilled',
            'evaluations/updateEvaluation/rejected',
            'evaluations/clearEvaluations',
            'evaluations/clearAssignedEvaluationsError', // Add clear assigned error
            'evaluations/clearCreateEvaluationError',
            'evaluations/clearUpdateEvaluationError',
            'evaluations/clearDetailsError',
        ],
         // Ignore specific field paths in actions that might not be serializable (e.g., functions, promises, Date objects)
        ignoredActionPaths: [
            'meta.arg',
            'payload.config',
            'payload.request',
            'payload.headers',
            'payload.start_date', // Ignore Date objects before serialization
            'payload.end_date',
            'meta.arg.start_date',
            'meta.arg.end_date',
            'meta.arg.evaluationData.start_date', // For update payload
            'meta.arg.evaluationData.end_date',
         ],
         // Ignore specific parts of the state that redux-persist adds
        ignoredPaths: [
            'session._persist',
            'auth._persist',
            'evaluations.evaluations.*.start_date', // Ignore Date objects in state if they exist
            'evaluations.evaluations.*.end_date',
            'evaluations.assignedEvaluations.*.start_date', // Ignore dates in assigned list
            'evaluations.assignedEvaluations.*.end_date',
            'evaluations.currentEvaluation.start_date', // Ignore Date in currentEvaluation
            'evaluations.currentEvaluation.end_date',
        ],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
