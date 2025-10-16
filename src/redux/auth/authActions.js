import {
  getArchitectWorkTypesSuccess,
  getCustomerWorkTypesSuccess,
  onLogin,
} from '.';
import {StorageKeys, localStorageHelper} from '../../Common/localStorageHelper';
import {isFunction} from '../../Utils/Utils';
import {
  getArchitectWorkTypes,
  getCustomerWorkTypes,
  logout,
  saveArchitectWorkTypes,
  saveCustomerWorkTypes,
  saveProject,
  signIn,
  updateUserType,
  userDelete,
  verifyOtp,
} from '../../api/authApis';

export const LogUserIn = ({mobileNum, onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      formdata.append('mobile', mobileNum);

      signIn(formdata)
        .then(response => {
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess(response);
            }
            dispatch(onLogin(response));
          }
        })
        .catch(err => {
          console.log(err);
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

export const VerifyOTP = ({mobileNum, otpValue, onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();
      formdata.append('mobile', mobileNum);
      formdata.append('otp', otpValue);

      verifyOtp(formdata)
        .then(response => {
          console.log('verify otp response---', response);

          if (response.status == 200) {
            const storageData = {};

            storageData[StorageKeys.ACCESS_TOKEN] =
              response?.access_token || '';
            storageData[StorageKeys.IS_LOGGED] = 'true';
            storageData[StorageKeys.USER_ID] = String(response?.user_id) || '';
            storageData[StorageKeys.USER_TYPE] =
              response?.user_type_name || 'null';
            localStorageHelper
              .setStorageItems(storageData)
              .then(() => {
                console.log('Saved user credentials in localstorage');

                if (isFunction(onSuccess)) {
                  onSuccess(response);
                }
              })
              .catch(error => {
                console.log('handleOTPForMainApp error:', error);
                throw new Error('Error saving data.');
              });
          } else {
            if (isFunction(onFailure)) {
              onFailure(response?.message);
            }
          }
        })
        .catch(err => {
          console.log(err.response.data);
        });
    } catch (error) {
      console.log('Error!', error);
      if (isFunction(onFailure)) {
        onFailure(error);
      }
    }
  };
};

export const UpdateUserType = ({user_type, onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();

      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          formdata.append('user_id', userId);
          formdata.append('user_type', user_type);
          return updateUserType(formdata)
            .then(response => {
              if (response?.status == 200) {
                if (isFunction(onSuccess)) {
                  onSuccess();
                }
              }
            })
            .catch(err => {
              console.log('error in update user type', err.response.data);
              if (isFunction(onFailure)) {
                onFailure();
              }
            });
        });
    } catch (error) {
      console.log('Error!', error);
      if (isFunction(onFailure)) {
        onFailure();
      }
    }
  };
};

export const getArchitectWorkType = ({onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      getArchitectWorkTypes()
        .then(response => {
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            if (response?.data) {
              var updatedArr = response.data.map((item, index) => {
                if (index == 0) {
                  return {...item, selected: true};
                } else {
                  return {...item, selected: false};
                }
              });
            }
            dispatch(getArchitectWorkTypesSuccess(updatedArr || []));
          }
        })
        .catch(err => {
          console.log('error in get architect work type', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const saveArchitectWorkType = ({payload, onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      saveArchitectWorkTypes(payload)
        .then(response => {
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
          }
        })
        .catch(err => {
          console.log('error in save architect work type', err.response.data);
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

export const saveArchitectProject = ({payload, onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      saveProject(JSON.stringify(payload))
        .then(response => {
          console.log('save project response', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
          }
        })
        .catch(err => {
          console.log('error in save project', err.response.data);
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

export const getCustomerWorkType = ({onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      getCustomerWorkTypes()
        .then(response => {
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
            if (response?.data) {
              var updatedArr = response.data.map((item, index) => {
                if (index == 0) {
                  return {...item, selected: true};
                } else {
                  return {...item, selected: false};
                }
              });
            }
            dispatch(getCustomerWorkTypesSuccess(updatedArr || []));
          }
        })
        .catch(err => {
          console.log('error in get customer work type', err.response.data);
          if (isFunction(onFailure)) {
            onFailure();
          }
        });
    } catch (error) {
      console.log('Error!', error);
    }
  };
};

export const saveCustomerWorkType = ({payload, onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      saveCustomerWorkTypes(payload)
        .then(response => {
          console.log('save cust work type', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
          }
        })
        .catch(err => {
          console.log('error in save customer work type', err.response.data);
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

export const logoutAction = ({onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      logout()
        .then(response => {
          console.log('logout response ', response);
          if (response?.status == 200) {
            if (isFunction(onSuccess)) {
              onSuccess();
            }
          }
        })
        .catch(err => {
          console.log('error in logout', err.response.data);
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

export const deleteAccountAction = ({onSuccess, onFailure}) => {
  return async dispatch => {
    try {
      var formdata = new FormData();

      localStorageHelper
        .getItemFromStorage(StorageKeys.USER_ID)
        .then(async userId => {
          formdata.append('user_id', userId);
          return userDelete(formdata)
            .then(response => {
              if (response?.status == 200) {
                if (isFunction(onSuccess)) {
                  onSuccess();
                }
              }
            })
            .catch(err => {
              console.log('error in update user type', err.response.data);
              if (isFunction(onFailure)) {
                onFailure();
              }
            });
        });
    } catch (error) {
      console.log('Error!', error);
      if (isFunction(onFailure)) {
        onFailure();
      }
    }
  };
};
