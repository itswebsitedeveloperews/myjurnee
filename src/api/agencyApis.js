import {extractData, userAuthFetch, userRawFetch} from './server';

export const getPlans = () =>
  userAuthFetch.get('/paymentplans').then(extractData);

export const savePlanPayment = data =>
  userRawFetch.post('/addagencypayment', data).then(extractData);

export const saveAgencyDoc = data =>
  userRawFetch.post('/addagency', data).then(extractData);

export const agencyArchitectureList = data =>
  userAuthFetch.post('/getarchitect', data).then(extractData);

export const agencyCustomerList = data =>
  userAuthFetch.post('/getcustomers', data).then(extractData);

export const agencyPastCustomerList = data =>
  userAuthFetch.post('/getpastcustomers', data).then(extractData);

export const agencyPastArchitectList = data =>
  userAuthFetch.post('/getpastarchitect', data).then(extractData);

export const uploadAgencyPriceList = data =>
  userRawFetch.post('/uploadpricelist', data).then(extractData);
