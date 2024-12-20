import request from '../utils/request';

export const getPapers = (id: string) => {
    return request({
        url: `/paper/${id}/list`,
        method: 'get',
    });
}