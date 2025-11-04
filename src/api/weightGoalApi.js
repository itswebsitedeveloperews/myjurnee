import { extractData, userAuthFetch, userRawFetch } from './server';

export const getWeightLogs = (id) =>
    userRawFetch.get(`wp-json/mobile/v1/get-progress?user_id=${id}`).then(extractData);

export const setWeightGoal = data =>
    userRawFetch.post(`wp-json/mobile/v1/set-goal-weight`, data).then(extractData);

export const saveWeightProgress = data =>
    userRawFetch.post(`wp-json/mobile/v1/submit-progress`, data).then(extractData);

export const deleteWeightLog = (id) =>
    userAuthFetch.post(`wp-json/mobile/v1/progress/delete?id=${id}`).then(extractData);

export const getGoalWeight = (id) =>
    userRawFetch.get(`wp-json/mobile/v1/get-goal-weight/?user_id=${id}`).then(extractData);