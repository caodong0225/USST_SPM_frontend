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
export const getAddedQuestions = (paperId: string) => {
    return request({
        url: `/paper/${paperId}/questions/list`,
        method: 'get',
    });
}

export const addPaperQuestion = (paperId: string, data: any) => {
    return request({
        url: `/paper/${paperId}/questions/add`,
        method: 'post',
        data,
    });
}

export const deletePaperQuestion = (paperId: string, questionId: string) => {
    return request({
        url: `/paper/${paperId}/questions/delete/${questionId}`,
        method: 'delete',
    });
}