import { createRouter, createWebHistory } from 'vue-router'
import {useUserInfoStore} from "./store";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('./views/layout/index.vue'),
            redirect: '/home', // 将 dashboard 设为首页
            children: [
                {
                    path: 'home',
                    name: 'home',
                    component: () => import('./views/home/index.vue'),
                    meta: { requiresAuth: true } // 需要登录
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('./views/settings/index.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'courses',
                    name: 'courses',
                    component: () => import('./views/courses/index.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'announcements',
                    name: 'announcements',
                    component: () => import('./views/announcements/index.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/course/detail/:id',
                    name: 'CourseDetail',
                    component: () => import('./views/courses/courseDetail.vue'), // 替换为实际的课程详情组件路径
                    meta: { requiresAuth: true }
                },
                {
                    path: '/courses/add',
                    name: 'CourseAdd',
                    component: () => import('./views/courses/addCourse.vue'), // 替换为实际的课程详情组件路径
                    meta: { requiresAuth: true }
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/login/index.vue')
        },
        {
            path: '/reg',
            name: 'reg',
            component: () => import('./views/reg/index.vue')
        }
    ]
})

// 添加全局路由守卫
router.beforeEach((to, _, next) => {
    const userInfoStore = useUserInfoStore() // 获取 Pinia 的用户信息 Store

    // 检查是否需要登录
    if (to.meta.requiresAuth && !userInfoStore.userInfo.sessionId) {
        // 如果未登录，跳转到登录页面
        next('/login')
    } else {
        // 允许导航到目标页面
        next()
    }
})


export default router