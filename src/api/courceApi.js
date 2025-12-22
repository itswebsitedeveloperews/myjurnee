import { extractData, userAuthFetch, userRawFetch } from './server';

export const getCourse = (userId) =>
    userAuthFetch.get(`/wp-json/learndash/v1/courses?user_id=${userId}`).then(extractData);

export const getCourseDetail = (id, userId) =>
    userAuthFetch.get(`wp-json/learndash/v1/course-details/?course_id=${id}&user_id=${userId}`).then(extractData);

export const getLessonDetail = (lessonId, userId) =>
    userAuthFetch
        .get(`/wp-json/learndash/v1/lesson-details/?lesson_id=${lessonId}&user_id=${userId}`)
        .then(extractData);

export const createQuizSession = (userId, quizUrl) => {
    const encodedUrl = encodeURIComponent(quizUrl);
    return userAuthFetch
        .post(`/wp-json/learndash/v1/session/create?user_id=${userId}&url=${encodedUrl}`)
        .then(extractData);
};

export const getTopicDetail = (topicId, userId) =>
    userAuthFetch
        .get(`/wp-json/learndash/v1/topic-details/?topic_id=${topicId}&user_id=${userId}`)
        .then(extractData);

export const getCourseProgress = (userId, courseId) =>
    userRawFetch
        .post('/wp-json/custom-api/v1/course-progress', {
            user_id: userId,
            course_id: courseId,
        })
        .then(extractData);

export const markLessonComplete = (userId, lessonId) =>
    userAuthFetch
        .post(`/wp-json/learndash/v1/lesson-topics/mark-complete?user_id=${userId}&lesson_id=${lessonId}`)
        .then(extractData);

export const enrollCourse = (userId, courseId) =>
    userAuthFetch
        .post(`/wp-json/learndash/v1/enroll?user_id=${userId}&course_id=${courseId}`)
        .then(extractData);