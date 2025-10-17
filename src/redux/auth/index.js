import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  architectWorkType: [],
  customerWorkType: [],
  isAuthenticated: false,
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onLogin: (state, data) => {
      const { payload } = data;
      state.isAuthenticated = true;
      state.user = payload;
      state.token = payload?.token;
    },
    onLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    getArchitectWorkTypesSuccess: (state, data) => {
      const { payload } = data;
      state.architectWorkType = payload;
    },
    getCustomerWorkTypesSuccess: (state, data) => {
      const { payload } = data;
      state.customerWorkType = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onLogin,
  onLogout,
  getArchitectWorkTypesSuccess,
  getCustomerWorkTypesSuccess,
} = authSlice.actions;

export default authSlice.reducer;
