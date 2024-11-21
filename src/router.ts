import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
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
