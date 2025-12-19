import { createSlice } from '@reduxjs/toolkit';
//Data for bottomtab
const initialState = {
  courseData: [],
  courseDetailData: {},
  lessonDetailData: {},
  topicDetailData: {},
  courseProgress: null,
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

    onTopicDetailSuccess: (state, data) => {
      const { payload } = data;
      state.topicDetailData = payload;
    },

    onCourseProgressSuccess: (state, data) => {
      const { payload } = data;
      state.courseProgress = payload;
    },

    onLessonMarkComplete: (state, data) => {
      const { payload: lessonId } = data;
      // Update lesson detail data to mark as completed
      if (state.lessonDetailData && state.lessonDetailData.ID === lessonId) {
        state.lessonDetailData.is_completed = true;
      }
      // Also update in course detail data if it exists
      if (state.courseDetailData && state.courseDetailData.lessons) {
        const lesson = state.courseDetailData.lessons.find(l => l.ID === lessonId);
        if (lesson) {
          lesson.is_completed = true;
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onCourseSuccess,
  onCourseDetailSuccess,
  onLessonDetailSuccess,
  onTopicDetailSuccess,
  onCourseProgressSuccess,
  onLessonMarkComplete,
} = courceSlice.actions;

export default courceSlice.reducer;
