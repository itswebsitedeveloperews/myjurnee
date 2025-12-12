import { createSlice } from '@reduxjs/toolkit';
//Data for bottomtab
const initialState = {
  courseData: [],
  courseDetailData: {},
  lessonDetailData: {}
};

export const courceSlice = createSlice({
  name: 'cource',
  initialState,
  reducers: {
    onCourseSuccess: (state, data) => {
      const { payload } = data;
      state.courseData = payload;
    },

    onCourseDetailSuccess: (state, data) => {
      const { payload } = data;
      state.courseDetailData = payload;
    },

    onLessonDetailSuccess: (state, data) => {
      const { payload } = data;
      state.lessonDetailData = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onCourseSuccess,
  onCourseDetailSuccess,
  onLessonDetailSuccess
} = courceSlice.actions;

export default courceSlice.reducer;
