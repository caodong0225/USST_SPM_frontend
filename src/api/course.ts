import request from '../utils/request';
import { AxiosResponse } from 'axios';
import {UserCoursesVO} from "../model/dto/UserCoursesVO";
import {IPage} from "../model/response/IPage";
import {GeneralDataResponse} from "../model/response/GeneralDataResponse";

/**
 * 获取课程列表接口
 * @param params 分页参数
 * @returns 返回一个包含课程列表的 Promise
 */
export const getUserCoursesPage = (params: { pageNum?: number, pageSize?: number }): Promise<AxiosResponse<GeneralDataResponse<IPage<UserCoursesVO>>>> => {
    return request({
        url: '/api/courses/list',  // 需要替换为实际的后端接口地址
        method: 'get',
        params: { ...params },
    });
};