import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('./views/layout/index.vue'),
            redirect: '/home', // 将dashboard设为首页home
            children: [
                {
                    path: 'home',
                    name: 'home',
                    // lazy loading
                    component: () => import('./views/home/index.vue')
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('./views/settings/index.vue')
                },
                {
                    path: 'courses',
                    name: 'courses',
                    component: () => import('./views/courses/index.vue')
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            // lazy loading
            component: () => import('./views/login/index.vue')
        },
        {
            path: '/reg',
            name: 'reg',
            // lazy loading
            component: () => import('./views/reg/index.vue')
        }
    ]
})

export default router
