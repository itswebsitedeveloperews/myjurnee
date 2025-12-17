import { extractData, userAuthFetch, userRawFetch } from './server';

export const getCourse = (userId) =>
    userAuthFetch.get(`/wp-json/learndash/v1/courses?user_id=${userId}`).then(extractData);

export const getCourseDetail = (id, userId) =>
    userAuthFetch.get(`wp-json/learndash/v1/course-details/?course_id=${id}&user_id=${userId}`).then(extractData);

export const getLessonDetail = (lessonId, userId) =>
    userAuthFetch
        .get(`/wp-json/learndash/v1/lesson-details/?lesson_id=${lessonId}&user_id=${userId}`)
        .then(extractData);