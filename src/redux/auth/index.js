import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: [],
  architectWorkType: [],
  customerWorkType: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onLogin: (state, data) => {
      // const {
      //   payload: {item},
      // } = data;
      // console.log('iam in reduxer', data);
    },
    getArchitectWorkTypesSuccess: (state, data) => {
      const {payload} = data;
      state.architectWorkType = payload;
    },
    getCustomerWorkTypesSuccess: (state, data) => {
      const {payload} = data;
      state.customerWorkType = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onLogin,
  getArchitectWorkTypesSuccess,
  getCustomerWorkTypesSuccess,
} = authSlice.actions;

export default authSlice.reducer;
