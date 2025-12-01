import { extractData, userAuthFetch, userRawFetch } from './server';

export const getProfile = (userId) =>
  userRawFetch.get(`wp-json/mobile/v1/get-profile/?user_id=${userId}`).then(extractData);

export const updateProfile = (data) =>
  userRawFetch.post('wp-json/mobile/v1/update-profile/', data).then(extractData);

export const updateProfileData = data =>
  userAuthFetch.post('/saveprofile', data).then(extractData);

export const setUserFitnessDetails = (userId, gender, age, currentWeight, currentWeightType, goalWeight, goalWeightType) =>
  userRawFetch.post(`wp-json/mobile/v1/set-user-details/?user_id=${userId}&gender=${gender}&age=${age}&current_weight=${currentWeight}&current_weight_type=${currentWeightType}&goal_weight=${goalWeight}&goal_weight_type=${goalWeightType}`, {}).then(extractData);

export const getUserFitnessDetails = (userId) =>
  userRawFetch.get(`wp-json/mobile/v1/get-user-details/?user_id=${userId}`).then(extractData);
