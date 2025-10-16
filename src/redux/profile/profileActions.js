import {StorageKeys, localStorageHelper} from '../../Common/localStorageHelper';
import {isFunction} from '../../Utils/Utils';
import {getProfile, updateProfileData} from '../../api/profileApi';

import {onProfileDataSuccess} from './profileSlice';

export const getProfileData = ({onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          formdata.append('user_id', userId);
          getProfile(formdata)
            .then(response => {
              // console.log('profile response', response);
              if (response?.status == 200) {
                if (isFunction(onSuccess)) {
                  onSuccess();
                }
                dispatch(onProfileDataSuccess(response?.data || {}));
              }
            })
            .catch(err => {
              console.log('-view profile error---', err.response.data);
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

export const saveUserDetails = ({
  name,
  email,
  mobileNum,
  onSuccess,
  onFailure,
}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          formdata.append('user_id', userId);
          formdata.append('full_name', name);
          formdata.append('email', email);
          formdata.append('mobile', mobileNum);

          updateProfileData(formdata)
            .then(response => {
              if (response?.status == 200) {
                if (isFunction(onSuccess)) {
                  onSuccess();
                }
                dispatch(getProfileData({}));
              }
            })
            .catch(err => {
              console.log('-update profile error---', err.response.data);
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
