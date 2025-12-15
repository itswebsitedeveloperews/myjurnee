import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { isFunction } from '../../Utils/Utils';
import {
  getCourse,
  getCourseDetail,
  getLessonDetail,
} from '../../api/courceApi.js';
import {
  onCourseDetailSuccess,
  onCourseSuccess,
  onLessonDetailSuccess,
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
      getLessonDetail(lessonId)
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
    } catch (error) {
      console.log('Error!', error);
    }
  };
};
