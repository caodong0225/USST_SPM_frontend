import request from '../utils/request';

/**
 * 获取课程列表接口
 * @param params 分页参数
 * @returns 返回一个包含课程列表的 Promise
 */
export const getUserCoursesPage = (pageNum?: number, pageSize?: number) => {
    return request({
        url: `/course/list?pageNum=${pageNum}&pageSize=${pageSize}`,  // 动态替换分页参数
        method: 'get'
    });
};

/**
 * 获取课程详情接口
 * @param courseId 课程 ID
 * @returns 返回一个包含课程详情的 Promise
 */
export const getCourseDetail = (courseId: number) => {
    return request({
        url: `/course/get/${courseId}`,
        method: 'get'
    });
}

export const addCourse = (course: any) => {
    return request({
        url: '/course/add',
        method: 'post',
        data: course
    });
}

export const deleteCourse = (courseId: number) => {
    return request({
        url: `/course/delete/${courseId}`,
        method: 'delete'
    });

}

export const getCourseParticipate = (courseId: number) => {
    return request({
        url: `/course/participants/list/${courseId}`,
        method: 'get'
    });
}

export const addCourseParticipate = (courseId: number, userId: number) => {
    return request({
        url: `/course/participants/add/${courseId}?userId=${userId}`,
        method: 'post'
    });
}

export const deleteCourseParticipate = (courseId: number, userId: number) => {
    return request({
        url: `/course/participants/delete/${courseId}?userId=${userId}`,
        method: 'delete'
    });
}

export const getMyCreatedCourses = (current: number , page:number) => {
    return request({
        url: `/course/myCreated/list?pageNum=${current}&pageSize=${page}`,
        method: 'get'
    });
}