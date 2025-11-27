import {
  getArchitectWorkTypesSuccess,
  getCustomerWorkTypesSuccess,
  onLogin,
} from '.';
import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { isFunction } from '../../Utils/Utils';

// Utility function to clean HTML tags from error messages
const cleanErrorMessage = (message) => {
  if (!message) return 'Login failed';

  return message
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .trim(); // Remove leading/trailing whitespace
};
import {
  jwtLogin,
  logout,
  signIn,
  register,
  forgotPassword,
} from '../../api/authApis';

export const LogUserIn = ({ mobileNum, onSuccess, onFailure }) => {
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

export const JWTLogin = ({ username, password, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      jwtLogin(username, password)
        .then(response => {
          console.log('JWT login response---', response);

          if (response?.success) {
            const storageData = {};

            storageData[StorageKeys.ACCESS_TOKEN] = response?.data?.token || '';
            storageData[StorageKeys.IS_LOGGED] = 'true';
            storageData[StorageKeys.USER_ID] = String(response?.data?.user_id) || '';
            storageData[StorageKeys.USER_NAME] = String(response?.data?.user_display_name) || '';
            storageData[StorageKeys.USER_NICKNAME] = String(response?.data?.user_nicename) || '';

            localStorageHelper
              .setStorageItems(storageData)
              .then(() => {
                console.log('Saved JWT credentials in localstorage');

                if (isFunction(onSuccess)) {
                  onSuccess(response?.data);
                }
                dispatch(onLogin(response?.data));
              })
              .catch(error => {
                console.log('JWT login storage error:', error);
                if (isFunction(onFailure)) {
                  onFailure('Error saving login data');
                }
              });
          } else {
            if (isFunction(onFailure)) {
              onFailure(cleanErrorMessage(response?.message));
            }
          }
        })
        .catch(err => {
          console.log('JWT login error:', err);
          if (isFunction(onFailure)) {
            onFailure(err?.response?.data);
          }
        });
    } catch (error) {
      console.log('JWT Login Error!', error);
      if (isFunction(onFailure)) {
        onFailure('An unexpected error occurred');
      }
    }
  };
};

export const RegisterUser = ({ username, email, password, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      register(username, email, password)
        .then(response => {
          console.log('Register response---', response);

          // Check if response contains user data (id, username, email) indicating successful registration
          if (response?.id && response?.username && response?.email) {
            if (isFunction(onSuccess)) {
              onSuccess(response);
            }
          } else {
            if (isFunction(onFailure)) {
              onFailure(cleanErrorMessage(response?.message || 'Registration failed'));
            }
          }
        })
        .catch(err => {
          console.log('Register error:', err);
          if (isFunction(onFailure)) {
            onFailure(err?.response?.data || 'Registration failed');
          }
        });
    } catch (error) {
      console.log('Register Error!', error);
      if (isFunction(onFailure)) {
        onFailure('An unexpected error occurred during registration');
      }
    }
  };
};

export const ForgotPasswordAction = ({ email, onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      forgotPassword(email)
        .then(response => {
          // console.log('Forgot password response---', response);

          // Check if response contains user data (id, username, email) indicating successful registration
          if (response) {
            if (isFunction(onSuccess)) {
              onSuccess(response);
            }
          } else {
            if (isFunction(onFailure)) {
              onFailure(cleanErrorMessage(response?.message || 'Forgot password failed'));
            }
          }
        })
        .catch(err => {
          console.log('Register error:', err);
          if (isFunction(onFailure)) {
            onFailure(cleanErrorMessage(err?.response?.data?.message || 'Forgot password failed'));
          }
        });
    } catch (error) {
      console.log('Register Error!', error);
      if (isFunction(onFailure)) {
        onFailure('An unexpected error occurred during sending link for forgot password');
      }
    }
  };
};

export const LogUserOut = ({ onSuccess, onFailure }) => {
  return async dispatch => {
    try {
      // Clear all local storage
      localStorageHelper
        .clearStorage()
        .then(() => {
          console.log('User logged out successfully - storage cleared');

          // Reset auth state
          dispatch(onLogin(null));

          if (isFunction(onSuccess)) {
            onSuccess();
          }
        })
        .catch(error => {
          console.log('Logout storage clear error:', error);
          if (isFunction(onFailure)) {
            onFailure('Error clearing user data');
          }
        });
    } catch (error) {
      console.log('Logout Error!', error);
      if (isFunction(onFailure)) {
        onFailure('An unexpected error occurred during logout');
      }
    }
  };
};

