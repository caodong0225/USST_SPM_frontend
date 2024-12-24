import request from '../utils/request';

export const updateUserExtraInfo = (id: number, key: string, data: any) => {
    return request({
        url: `/user/change/${id}/ext/${key}`,
        method: 'put',
        data
    });
}

export const getUserExtraInfo = (id: number) => {
    return request({
        url: `/user/get/${id}`,
        method: 'get'
    });
}

export const getUserList = (current?: number, size?: number) => {
    return request({
        url: `/user/list?current=${current}&size=${size}`,
        method: 'get',
    });
}

// 更新用户信息
export function updateUserInfo(data: any) {
    return request({
        url: '/user/update',
        method: 'put',
        data
    })
}

// 上传头像
export function uploadAvatar(data: FormData) {
    return request({
        url: '/user/avatar',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}