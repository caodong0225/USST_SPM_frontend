import request from '../utils/request';

export const submit = (paperId : string,data: any) => {
    return request({
        url: `/submit/${paperId}`,
        method: 'post',
        data
    });
}

export const getSubmitList = (paperId: string) => {
    return request({
        url: `/submit/${paperId}/list`,
        method: 'get'
    });
}