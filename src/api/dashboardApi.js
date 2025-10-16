import {extractData, userAuthFetch, userRawFetch} from './server';

export const getCategory = () =>
  userAuthFetch.get('/viewcategory').then(extractData);

export const getSubCategorys = data =>
  userAuthFetch.post('/viewsubcategory', data).then(extractData);

export const getProjects = data =>
  userAuthFetch.post('/projects', data).then(extractData);

export const getProjectDetails = data =>
  userAuthFetch.post('/viewprojectdetails', data).then(extractData);

export const getAgencyByProject = data =>
  userAuthFetch.post('/getagenciesbyproject', data).then(extractData);

export const searchCategory = text =>
  userAuthFetch.post('/searchcategory', text).then(extractData);

export const getAgencyforCategory = data =>
  userAuthFetch.post('/allagency', data).then(extractData);

export const getAgencyDetails = data =>
  userAuthFetch.post('/agency', data).then(extractData);

export const saveArchitectWorkProject = data =>
  userRawFetch.post('/saveproject_agencies', data).then(extractData);

export const getAssignedAgencyOfuser = data =>
  userAuthFetch.post('/getagenciesbyuserid', data).then(extractData);
