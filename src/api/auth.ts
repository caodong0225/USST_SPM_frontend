import request from '../utils/request'

/**
 * 登录接口
 * @param params 登录的 DTO 对象
 * @returns 返回一个包含 BaseResponse 的 Promise
 */
export const loginAPI = (params: any) => {
    return request({
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
export const registerAPI = (params: any) => {
    return request({
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
    return request({
        url: '/auth/logout',
        method: 'post',
    });
};