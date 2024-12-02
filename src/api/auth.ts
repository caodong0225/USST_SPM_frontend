import request from '../utils/request'
import {loginDTO} from "../model/dto/LoginDTO.ts";
import {registerDTO} from "../model/dto/RegisterDTO.ts";
import {LoginDataResponseVO} from "../model/response/BaseResponse.ts";
import {AxiosResponse} from "axios";
import {BaseDataResponse} from "../model/response/BaseDataResponse.ts";
import {GeneralDataResponse} from "../model/response/GeneralDataResponse.ts";
import {UsersVO} from "../model/vo/UsersVO.ts"; // 引入自定义的axios函数

/**
 * 登录接口
 * @param params 登录的 DTO 对象
 * @returns 返回一个包含 BaseResponse 的 Promise
 */
export const loginAPI = (params: loginDTO): Promise<AxiosResponse<LoginDataResponseVO>> => {
    return request<LoginDataResponseVO>({
        url: '/auth/login',
        method: 'post',
        data: { ...params },
    });
};

/**
 * 注册接口
 * @param params 注册的 DTO 对象
 * @returns 返回一个包含 BaseResponse 的 Promise
 */
export const registerAPI = (params: registerDTO): Promise<AxiosResponse<GeneralDataResponse<UsersVO>>> => {
    return request<GeneralDataResponse<UsersVO>>({
        url: '/auth/register',
        method: 'post',
        data: { ...params },
    });
};

/**
 * 退出登录接口
 * @returns 返回一个包含 BaseResponse 的 Promise
 */
export const logoutAPI = () => {
    return request<BaseDataResponse>({
        url: '/auth/logout',
        method: 'post',
    });
};