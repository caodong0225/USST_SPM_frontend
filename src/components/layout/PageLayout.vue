<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
    title?: string
    showBreadcrumb?: boolean
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    showBreadcrumb: true,
    loading: false
})

const route = useRoute()

const breadcrumbs = computed(() => {
    return route.matched.map(item => ({
        title: item.meta.title || item.name,
        path: item.path
    }))
})
</script>

<template>
    <div class="page-layout">
        <!-- 面包屑导航 -->
        <el-breadcrumb v-if="showBreadcrumb" separator="/" class="page-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="{ path: item.path }">
                {{ item.title }}
            </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 页面标题和操作区 -->
        <div class="page-header">
            <div class="page-title">
                <slot name="icon">
                    <el-icon class="title-icon">
                        <component :is="route.meta.icon || 'Document'" />
                    </el-icon>
                </slot>
                <h1>{{ title || route.meta.title }}</h1>
            </div>
            <div class="page-actions">
                <slot name="actions"></slot>
            </div>
        </div>

        <!-- 内容区域 -->
        <div class="page-content" :class="{ 'is-loading': loading }">
            <slot></slot>

            <!-- 加载状态 -->
            <div v-if="loading" class="content-loading">
                <el-loading />
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.page-breadcrumb {
    margin-bottom: 1rem;
    padding: 0.5rem 0;
    background-color: white;
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
}

.page-title {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.title-icon {
    font-size: 1.5rem;
    color: var(--primary-color);
}

.page-title h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
}

.page-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.page-content {
    flex: 1;
    position: relative;
    min-height: 200px;
}

.content-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    border-radius: var(--border-radius);
}

.is-loading {
    pointer-events: none;
    user-select: none;
}
</style>