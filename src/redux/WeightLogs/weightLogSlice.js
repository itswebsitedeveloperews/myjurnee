import { createSlice } from '@reduxjs/toolkit';
//Data for bottomtab
const initialState = {
  logsData: [],
  goalWeight: {},
};

export const weightLogSlice = createSlice({
  name: 'weightLogs',
  initialState,
  reducers: {
    onLogsSuccess: (state, data) => {
      const { payload } = data;
      state.logsData = payload;
    },
    onSetWeightGoalSuccess: (state, data) => {
      const { payload } = data;
      state.goalWeight = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onLogsSuccess,
  onSetWeightGoalSuccess
} = weightLogSlice.actions;

export default weightLogSlice.reducer;
