import request from '../utils/request';

export const getPapers = (id: string) => {
    return request({
        url: `/paper/${id}/list`,
        method: 'get',
    });
}

export const createPaper = (data: any) => {
    return request({
        url: '/paper/create',
        method: 'post',
        data,
    });
}

export const deletePaper = (id: string) => {
    return request({
        url: `/paper/delete/${id}`,
        method: 'delete',
    });
}