import request from '../utils/request';

interface Paper {
    id: number
    createdAt: string
    updatedAt: string
    paperName: string
    paperDesc: string
    paperStartTime: string
    paperEndTime: string
    status: string
    visible: boolean
    courseId: number
}

interface PaperWithQuestions {
    papers: Paper
    questionsNum: number
}

interface PaperResponse {
    code: number
    message: string
    data: PaperWithQuestions[]
}

export const getPapers = (courseId: string | number) => {
    console.log('调用获取试卷列表接口，courseId:', courseId)
    return request<PaperResponse>({
        url: `/paper/${courseId}/list`,
        method: 'get'
    })
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