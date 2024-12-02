import axios from 'axios';
import router from '../router';
import { ElMessage } from 'element-plus';

// 定义公共的前缀
const baseURL = '/api';
const instance = axios.create({ baseURL });

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 在这里可以为所有请求添加统一的请求头等操作
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 检查响应数据中的 `code`，统一处理非 200 的情况
        if ('code' in response.data && response.data.code !== 200) {
            ElMessage.error(response.data.message);
            return Promise.reject(response.data);
        }
        console.log(response);
        // 返回响应的 data 部分，而不是整个 AxiosResponse
        return response.data;
    },
    (error) => {
        console.dir(error);
        if (error.response?.status === 401) {
            ElMessage.error('用户身份已过期~');
            router.push('/login');
        }
        return Promise.reject(error);
    }
);


export default instance;
