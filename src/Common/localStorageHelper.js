import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

export const StorageKeys = {
  FCM_TOKEN: 'fcmToken',
  PHONE: 'PHONE',
  USER_ID: 'USER_ID',
  USER_NAME: 'USER_NAME',
  USER_NICKNAME: 'USER_NICKNAME',
  USER_TYPE: 'USER_TYPE',
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  NAME: 'NAME',
  IS_LOGGED: 'IS_LOGGED',
  FIRST_TIME_LOGIN: 'FIRST_TIME_LOGIN',
  ONBOARDING_SHOWN: 'ONBOARDING_SHOWN',
  TEMP_SIGNUP_CREDENTIALS: 'TEMP_SIGNUP_CREDENTIALS', // Temporary storage for signup credentials
};

class LocalStorageHelper {
  getItemsFromStorage = keys =>
    new Promise((resolve, reject) => {
      AsyncStorage.multiGet(keys)
        .then(resp => {
          const finalVal = _.reduce(
            resp,
            (obj, values) => {
              const key = values[0];
              obj[key] = values[1];
              return obj;
            },
            {},
          );
          resolve(finalVal);
        })
        .catch(err => {
          console.log('get Items From Storage error ', err);
          reject(err);
        });
    });

  getItemFromStorage = key =>
    new Promise((resolve, reject) => {
      AsyncStorage.getItem(key)
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          console.log('get Item From Storage error ', err);
          reject(err);
        });
    });

  getArrayItemFromStorage = key =>
    new Promise((resolve, reject) => {
      AsyncStorage.getItem(key)
        .then(resp => {
          resolve(JSON.parse(resp));
        })
        .catch(err => {
          console.log('get Item From Storage error ', err);
          reject(err);
        });
    });

  setStorageItems = data =>
    new Promise((resolve, reject) => {
      AsyncStorage.multiSet(_.toPairs(data))
        .then(resp => {
          console.log('setStorageItemse success: ');
          resolve(resp);
        })
        .catch(err => {
          console.log('setStorageItemse error: ', err);
          reject(err);
        });
    });

  setStorageItem = ({ key, value }) =>
    new Promise((resolve, reject) => {
      AsyncStorage.setItem(key, value)
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          console.log('set Storage Item error: ', err);
          reject(err);
        });
    });

  setStorageArrayItem = ({ key, value }) =>
    new Promise((resolve, reject) => {
      AsyncStorage.setItem(key, JSON.stringify(value))
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          console.log('set Storage Item error: ', err);
          reject(err);
        });
    });

  removeStorageItems = keys =>
    new Promise((resolve, reject) => {
      AsyncStorage.multiRemove(keys)
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          console.log('remove Storage Items error: ', err);
          reject(err);
        });
    });

  clearStorage = () =>
    new Promise((resolve, reject) => {
      AsyncStorage.clear()
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          console.log('clear Storage: ', err);
          reject(err);
        });
    });
}
export const localStorageHelper = new LocalStorageHelper();
