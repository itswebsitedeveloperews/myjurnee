import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import dashboardSlice from './dashboard/dashboardSlice';
import profileSlice from './profile/profileSlice';
import courceSlice from './cources/courceSlice';
import weightLogSlice from './WeightLogs/weightLogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardSlice,
    profile: profileSlice,
    cource: courceSlice,
    weightLogs: weightLogSlice,
  },
});
