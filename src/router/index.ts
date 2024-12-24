const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
            title: '课程概览',
            icon: 'Menu'
        }
    },
    {
        path: '/papers',
        name: 'Papers',
        component: () => import('@/views/papers/index.vue'),
        meta: {
            title: '试卷管理',
            icon: 'Document'
        }
    }
    // ... 其他路由
] 