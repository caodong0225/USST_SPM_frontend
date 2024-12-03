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