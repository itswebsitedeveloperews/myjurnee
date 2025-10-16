import {createSlice} from '@reduxjs/toolkit';
//Data for bottomtab
const initialState = {
  profileData: {},
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    onProfileDataSuccess: (state, data) => {
      const {payload} = data;
      state.profileData = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {onProfileDataSuccess} = profileSlice.actions;

export default profileSlice.reducer;
