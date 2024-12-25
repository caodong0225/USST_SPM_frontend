import axios from 'axios';
import router from '../router';
import { ElMessage } from 'element-plus';
import { useUserInfoStore } from '../store';

// 定义公共的前缀
const baseURL = '/api';
const instance = axios.create({ baseURL, timeout: 60000 });

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const userStore = useUserInfoStore();
        const token = userStore.userInfo.sessionId;

        // 打印详细的请求信息
        console.log('发送请求:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            token: token
        });

        // 修改 token 的添加方式
        if (token) {
            // config.headers['Authorization'] = token;  // 方式1
            config.headers['Authorization'] = `Bearer ${token}`;  // 方式2
            // config.headers['token'] = token;  // 方式3
        }

        return config;
    },
    (error) => {
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        console.log('收到响应:', response.data);
        return response.data;
    },
    (error) => {
        console.error('请求错误:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            config: error.config
        });

        // 修改错误处理逻辑
        if (error.response?.status === 403) {
            const userStore = useUserInfoStore();
            console.log('当前用户信息:', userStore.userInfo); // 打印用户信息

            // 检查是否真的没有登录
            if (!userStore.userInfo.sessionId) {
                ElMessage.error('请先登录');
                router.push('/login');
            } else {
                ElMessage.error('权限不足，请联系管理员');
            }
        }
        return Promise.reject(error);
    }
);


export default instance;
