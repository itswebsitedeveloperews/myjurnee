import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper.js';
import { isFunction } from '../../Utils/Utils.js';
import {
  getWeightLogs,
  saveWeightProgress,
  setWeightGoal,
} from '../../api/weightGoalApi.js';
import {
  onLogsSuccess,
  onSetWeightGoalSuccess
} from './weightLogSlice.js';

export const getWeightLogsAction = ({ userId, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      getWeightLogs(userId)
        .then(response => {
          console.log('weight logs response action---', response);
          if (response?.success) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            dispatch(onLogsSuccess(response?.data || []));
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

export const setWeightGoalAction = ({ payload, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      setWeightGoal(payload)
        .then(response => {
          if (response?.success) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            dispatch(onSetWeightGoalSuccess(response?.data || {}));
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

export const setWeightGoalProgessAction = ({ payload, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      saveWeightProgress(payload)
        .then(response => {
          console.log('weight goal progress response action---', response);
          if (response?.success) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            // dispatch(onSetWeightGoalSuccess(response?.data || {}));
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
