{
    path: '/questions',
        component: Layout,
            children: [
                {
                    path: '',
                    name: 'Questions',
                    component: () => import('@/views/questions/questionList.vue'),
                    meta: {
                        title: '题库管理',
                        requiresAuth: true
                    }
                },
                {
                    path: 'create',
                    name: 'CreateQuestion',
                    component: () => import('@/views/questions/addAnswerChildren.vue'),
                    meta: {
                        title: '创建试题',
                        requiresAuth: true
                    }
                },
                {
                    path: 'update/:id',
                    name: 'UpdateQuestion',
                    component: () => import('@/views/questions/updateQuestion.vue'),
                    meta: {
                        title: '更新试题',
                        requiresAuth: true
                    }
                }
            ]
} 