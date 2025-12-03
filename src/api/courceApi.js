import { extractData, userAuthFetch, userRawFetch } from './server';

export const getCourse = (userId) =>
    userAuthFetch.get(`/wp-json/learndash/v1/courses?user_id=${userId}`).then(extractData);

export const getCourseDetail = (id) =>
    userAuthFetch.get(`wp-json/learndash/v1/course-details/?id=${id}`).then(extractData);