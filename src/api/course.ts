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
export const getUserCoursesPage = (pageNum?: number, pageSize?: number): Promise<AxiosResponse<GeneralDataResponse<IPage<UserCoursesVO>>>> => {
    return request({
        url: `/course/list?pageNum=${pageNum}&pageSize=${pageSize}`,  // 动态替换分页参数
        method: 'get'
    });
};