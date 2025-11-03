import { createSlice } from '@reduxjs/toolkit';
//Data for bottomtab
const initialState = {
  profileData: {},
  userId: '',
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    onProfileDataSuccess: (state, data) => {
      const { payload } = data;
      state.profileData = payload;
    },
    onUserIdSuccess: (state, data) => {
      const { payload } = data;
      state.userId = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { onProfileDataSuccess, onUserIdSuccess } = profileSlice.actions;

export default profileSlice.reducer;
