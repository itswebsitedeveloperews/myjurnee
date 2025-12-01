import { createSlice } from '@reduxjs/toolkit';
//Data for bottomtab
const initialState = {
  membershipPlansData: [],
  userMembership: {},
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    onMembershipPlansSuccess: (state, data) => {
      const { payload } = data;
      state.membershipPlansData = payload;
    },
    onUserMembershipSuccess: (state, data) => {
      const { payload } = data;
      state.userMembership = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onMembershipPlansSuccess,
  onUserMembershipSuccess,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
