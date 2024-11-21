import request from '../utils/request' // 引入自定义的axios函数

/**
 * 登录接口（这是JSDoc注释）
 * @param {*} param0 {username: 用户名, password: 密码}
 * @returns Promise对象
 */
export const loginAPI = (params: any) => {
    return request({
        url: '/auth/login',
        method: 'post',
        data: { ...params }
    })
}