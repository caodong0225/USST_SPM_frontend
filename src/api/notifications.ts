import request from "../utils/request";

export const fetchNotifications = (isRead?: boolean) => {
    const fetchUrl = isRead === undefined ? '/notification/list' : `/notification/list?isRead=${isRead}`;
    return request({
        url: fetchUrl,  // 动态替换参数
        method: 'get'
    });
}