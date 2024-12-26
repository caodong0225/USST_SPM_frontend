import { createRouter, createWebHistory } from 'vue-router'
import { useUserInfoStore } from "../store";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('../views/layout/index.vue'),
            redirect: '/home',
            children: [
                {
                    path: 'home',
                    name: 'home',
                    component: () => import('../views/home/index.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('../views/settings/index.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'courses',
                    name: 'courses',
                    component: () => import('../views/courses/index.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'questions',
                    name: 'questions',
                    component: () => import('../views/questions/index.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/questions/:id',
                    name: 'addAnswerChildren',
                    component: () => import('../views/questions/addAnswerChildren.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/questions/list/:id',
                    name: 'manageQuestion',
                    component: () => import('../views/questions/manageQuestion.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'papers/:id',
                    name: 'papers',
                    component: () => import('../views/papers/index.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'announcements',
                    name: 'announcements',
                    component: () => import('../views/announcements/index.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/course/detail/:id',
                    name: 'CourseDetail',
                    component: () => import('../views/courses/courseDetail.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/courses/add',
                    name: 'CourseAdd',
                    component: () => import('../views/courses/addCourse.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/courses/my',
                    name: 'MyCourses',
                    component: () => import('@/views/courses/my.vue'),
                    meta: {
                        requiresAuth: true,
                        title: '我创建的课程'
                    }
                }

            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/login/index.vue')
        },
        {
            path: '/reg',
            name: 'reg',
            component: () => import('../views/reg/index.vue')
        },
    ]
})

// 添加全局路由守卫
router.beforeEach((to, _, next) => {
    const userInfoStore = useUserInfoStore()

    // 检查是否需要登录
    if (to.meta.requiresAuth && !userInfoStore.userInfo.sessionId) {
        next('/login')
    } else {
        next()
    }
})

export default router 