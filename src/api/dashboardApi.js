import { extractData, userAuthFetch, userRawFetch } from './server';

export const getMembershipPlans = (userId) =>
  userRawFetch.get(`wp-json/pmpro-rn/v1/membership_levels?user_id=${userId}`).then(extractData);

export const getCheckoutSession = (data) =>
  userRawFetch.post('wp-json/pmpro-rn/v1/create-checkout', data).then(extractData);

export const getMembershipByEmail = (data) =>
  userRawFetch.post('wp-json/pmpro-rn/v1/membership-by-email', data).then(extractData);

export const cancelSubscription = (data) =>
  userRawFetch.post('wp-json/pmpro-rn/v1/cancel-subscription', data).then(extractData);
