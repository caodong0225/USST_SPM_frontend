import request from '../utils/request';

export const createQuestion = (data: any) => {
    return request({
        url: `/question/create`,
        method: 'post',
        data
    });
}

export const getQuestionList = (courseId: number)=> {
    return request({
        url: `/question/preview/${courseId}/list`,
        method: 'get',
    });
}

export const deleteQuestion = (questionId: number) => {
    return request({
        url: `/question/delete/${questionId}`,
        method: 'delete',
    });
}