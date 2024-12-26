import request from '@/utils/request';

// 创建试题
export const createQuestion = (data: {
    courseId: number;
    questionType: string;
    question: string;
    questionLevel: string;
    options: string;
    explanation: string;
    answers: string;
}) => {
    return request({
        url: '/question/create',
        method: 'post',
        data
    });
};

// 更新试题
export const updateQuestion = (data: {
    id: number;
    questionType: string;
    question: string;
    questionLevel: string;
    options: string;
    explanation: string;
    answers: string;
}) => {
    return request({
        url: '/question/update',
        method: 'put',
        data
    });
};

// 获取试题列表
export const getQuestionList = () => {
    return request({
        url: '/question/questionList',
        method: 'get'
    });
};

// 获取试题详情
export const getQuestionDetail = (id: number) => {
    return request({
        url: `/question/detail/${id}`,
        method: 'get'
    });
};

// 删除试题
export const deleteQuestion = (questionId: number) => {
    return request({
        url: `/question/delete/${questionId}`,
        method: 'delete'
    });
};

// 获取试卷试题列表
export const getPaperQuestionList = (paperId: string) => {
    return request({
        url: `/question/preview/paper/${paperId}`,
        method: 'get'
    });
};