import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { isFunction } from '../../Utils/Utils';
import {
  getCourse,
  getCourseDetail,
  getLessonDetail,
  createQuizSession,
  getTopicDetail,
  getCourseProgress,
  markLessonComplete,
  enrollCourse,
} from '../../api/courceApi.js';
import {
  onCourseDetailSuccess,
  onCourseSuccess,
  onLessonDetailSuccess,
  onTopicDetailSuccess,
  onCourseProgressSuccess,
  onLessonMarkComplete,
} from './courceSlice';

export const getCourseAction = ({ userId, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      getCourse(userId)
        .then(response => {
          if (response) {
            if (isFunction(onSuccess)) {
              onSuccess(response);
            }
            dispatch(onCourseSuccess(response));
          }
        })
        .catch(err => {
          console.log('----', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getCourseDetailAction = ({ courseId, userId, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      getCourseDetail(courseId, userId)
        .then(response => {
          if (response) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            dispatch(onCourseDetailSuccess(response));
          }
        })
        .catch(err => {
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getLessonDetailAction = ({ lessonId, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          getLessonDetail(lessonId, userId)
            .then(response => {
              if (response) {
                if (isFunction(onSuccess)) {
                  onSuccess();
                }
                dispatch(onLessonDetailSuccess(response));
              }
            })
            .catch(err => {
              if (isFunction(onFailure)) {
                onFailure();
              }
            });
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const createQuizSessionAction = ({ quizUrl, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          if (!userId) {
            if (isFunction(onFailure)) {
              onFailure('User ID not found');
            }
            return;
          }
          createQuizSession(userId, quizUrl)
            .then(response => {
              console.log('Create quiz session response:', response);
              // Check if response has a URL (either response.url or response.ok && response.url)
              if (response?.url) {
                if (isFunction(onSuccess)) {
                  onSuccess(response);
                }
              } else {
                console.log('Quiz session response missing URL:', response);
                if (isFunction(onFailure)) {
                  onFailure(response || 'Failed to create quiz session');
                }
              }
            })
            .catch(err => {
              console.log('Create quiz session error:', err);
              if (isFunction(onFailure)) {
                onFailure(err?.response?.data || err);
              }
            });
        });
    } catch (error) {
      console.log('Error!', error);
      if (isFunction(onFailure)) {
        onFailure(error);
      }
    }
  };
};

export const getTopicDetailAction = ({ topicId, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          getTopicDetail(topicId, userId)
            .then(response => {
              if (response) {
                if (isFunction(onSuccess)) {
                  onSuccess();
                }
                dispatch(onTopicDetailSuccess(response));
              }
            })
            .catch(err => {
              if (isFunction(onFailure)) {
                onFailure();
              }
            });
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const getCourseProgressAction = ({ courseId, userId, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      getCourseProgress(userId, courseId)
        .then(response => {
          if (response) {
            if (isFunction(onSuccess)) {
              onSuccess(response);
            }
            dispatch(onCourseProgressSuccess(response));
          }
        })
        .catch(err => {
          console.log('Course progress error:', err);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
      if (isFunction(onFailure)) {
        onFailure();
      }
    }
  };
};

export const markLessonCompleteAction = ({ lessonId, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          if (!userId) {
            if (isFunction(onFailure)) {
              onFailure('User ID not found');
            }
            return;
          }
          markLessonComplete(userId, lessonId)
            .then(response => {
              if (response) {
                if (isFunction(onSuccess)) {
                  onSuccess(response);
                }
                // Update lesson detail data to mark as completed
                dispatch(onLessonMarkComplete(lessonId));
              } else {
                if (isFunction(onFailure)) {
                  onFailure(response || 'Failed to mark lesson as complete');
                }
              }
            })
            .catch(err => {
              console.log('Mark lesson complete error:', err);
              if (isFunction(onFailure)) {
                onFailure(err?.response?.data || err);
              }
            });
        });
    } catch (error) {
      console.log('Error!', error);
      if (isFunction(onFailure)) {
        onFailure(error);
      }
    }
  };
};

export const enrollCourseAction = ({ courseId, userId, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      enrollCourse(userId, courseId)
        .then(response => {
          if (response) {
            if (isFunction(onSuccess)) {
              onSuccess(response);
            }
          } else {
            if (isFunction(onFailure)) {
              onFailure(response || 'Failed to enroll in course');
            }
          }
        })
        .catch(err => {
          console.log('Enroll course error:', err);
          if (isFunction(onFailure)) {
            onFailure(err?.response?.data || err);
          }
        });
    } catch (error) {
      console.log('Error!', error);
      if (isFunction(onFailure)) {
        onFailure(error);
      }
    }
  };
};
