import { extractData, userAuthFetch, userRawFetch } from './server';

export const getMembershipPlans = () =>
  userRawFetch.get('wp-json/pmpro/v1/membership_levels').then(extractData);

export const getCheckoutSession = (data) =>
  userRawFetch.post('wp-json/pmpro-rn/v1/create-checkout', data).then(extractData);

export const getMembershipByEmail = (data) =>
  userRawFetch.post('wp-json/pmpro-rn/v1/membership-by-email', data).then(extractData);
