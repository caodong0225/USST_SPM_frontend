import request from "../utils/request";

export const fetchAnnouncement = (pageNum?: number, pageSize?: number) => {
    return request({
        url: `/course/announcements/list?pageNum=${pageNum}&pageSize=${pageSize}`,  // 动态替换分页参数
        method: 'get'
    });
}

export const createAnnouncement = (courseId: number , data: any) => {
    return request({
        url: `/course/${courseId}/announcement`,
        method: 'post',
        data
    });
}

export const fetchCourseAnnouncement = (courseId?: number ,pageNum?: number, pageSize?: number) => {
    return request({
        url: `/course/${courseId}/announcement?pageNum=${pageNum}&pageSize=${pageSize}`,  // 动态替换分页参数
        method: 'get'
    });
}