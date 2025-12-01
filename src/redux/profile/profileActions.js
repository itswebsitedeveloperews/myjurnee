import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { isFunction } from '../../Utils/Utils';
import { getProfile, updateProfile, updateProfileData } from '../../api/profileApi';

import { onProfileDataSuccess } from './profileSlice';

export const getProfileData = ({ onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          getProfile(userId)
            .then(response => {
              // console.log('profile response', response);
              if (response?.success == true) {
                if (isFunction(onSuccess)) {
                  onSuccess();
                }
                dispatch(onProfileDataSuccess(response?.data || {}));
              }
            })
            .catch(err => {
              console.log('-view profile error---', err.response?.data || err);
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

export const updateUserProfile = ({
  fullName,
  phone,
  weight,
  weightType,
  gender,
  age,
  profileImage,
  onSuccess,
  onFailure,
}) => {
  return async dispatch => {
    try {
      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          const data = {
            user_id: parseInt(userId),
            full_name: fullName,
            phone: phone,
            weight: weight,
            weight_type: weightType,
            gender: gender,
            age: parseInt(age),
          };

          // Add profile_image only if provided
          if (profileImage) {
            data.profile_image = profileImage;
          }

          updateProfile(data)
            .then(response => {
              if (response?.success == true) {
                if (isFunction(onSuccess)) {
                  onSuccess();
                }
                // Refresh profile data after update
                dispatch(getProfileData({}));
              } else {
                if (isFunction(onFailure)) {
                  onFailure(response?.message || 'Failed to update profile');
                }
              }
            })
            .catch(err => {
              console.log('-update profile error---', err.response?.data || err);
              if (isFunction(onFailure)) {
                onFailure(err.response?.data?.message || 'Failed to update profile');
              }
            });
        });
    } catch (error) {
      console.log('Error!', error);
      if (isFunction(onFailure)) {
        onFailure('An error occurred');
      }
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
