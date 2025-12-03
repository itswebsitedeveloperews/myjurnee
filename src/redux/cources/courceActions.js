import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { isFunction } from '../../Utils/Utils';
import {
  getCourse,
  getCourseDetail,
} from '../../api/courceApi.js';
import {
  onCourseDetailSuccess,
  onCourseSuccess,
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

export const getCourseDetailAction = ({ courseId, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      getCourseDetail(courseId)
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
