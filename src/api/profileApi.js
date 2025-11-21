import { extractData, userAuthFetch, userRawFetch } from './server';

export const getProfile = data =>
  userAuthFetch.post('/viewprofile', data).then(extractData);

export const updateProfileData = data =>
  userAuthFetch.post('/saveprofile', data).then(extractData);

export const setUserFitnessDetails = (userId, gender, age, currentWeight, goalWeight) =>
  userRawFetch.post(`wp-json/mobile/v1/set-user-details/?user_id=${userId}&gender=${gender}&age=${age}&current_weight=${currentWeight}&goal_weight=${goalWeight}`, {}).then(extractData);

export const getUserFitnessDetails = (userId) =>
  userRawFetch.get(`wp-json/mobile/v1/get-user-details/?user_id=${userId}`).then(extractData);
