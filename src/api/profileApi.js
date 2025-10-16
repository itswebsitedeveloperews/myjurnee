import {extractData, userAuthFetch} from './server';

export const getProfile = data =>
  userAuthFetch.post('/viewprofile', data).then(extractData);

export const updateProfileData = data =>
  userAuthFetch.post('/saveprofile', data).then(extractData);
