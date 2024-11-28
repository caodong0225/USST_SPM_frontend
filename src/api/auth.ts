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

/**
 * 注册接口
 * @param params 注册的DTO对象
 * @returns
 */
export const registerAPI = (params: any) => {
    const { repassword, ...filteredParams } = params; // 移除 repassword 属性
    console.log(filteredParams); // 打印移除后的对象
    delete params.repassword; // 删除 repassword 属性
    return request({
        url: '/auth/register',
        method: 'post',
        data: { ...filteredParams }
    })
}

/**
 * 退出登录接口
 */
export const logoutAPI = () => {
    return request({
        url: '/auth/logout',
        method: 'post'
    })
}