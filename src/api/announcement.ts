import request from "../utils/request";

export const fetchAnnouncement = (pageNum?: number, pageSize?: number) => {
    return request({
        url: `/course/announcements/list?pageNum=${pageNum}&pageSize=${pageSize}`,  // 动态替换分页参数
        method: 'get'
    });
}