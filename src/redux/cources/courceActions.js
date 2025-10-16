import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { isFunction } from '../../Utils/Utils';
import {
  getCourse,
} from '../../api/courceApi.js';
import {
  onCourseSuccess,
} from './courceSlice';

export const getCourseAction = ({ onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      getCourse()
        .then(response => {
          // console.log('course response action---', response);
          if (response) {
            if (isFunction(onSuccess)) {
              onSuccess();
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

