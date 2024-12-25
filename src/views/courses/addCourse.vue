<template>
  <div class="page-container">
    <div class="page-header">
      <el-page-header @back="goBack">
        <template #content>
          <span class="page-title">创建新课程</span>
        </template>
      </el-page-header>
    </div>

    <div class="page-content">
      <CourseForm 
        @submit="createCourse"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/store'
import { addCourse } from '@/api/course'
import CourseForm from './components/courseForm.vue'

const router = useRouter()
const userStore = useUserInfoStore()

const goBack = () => {
  router.push('/courses')
}

const createCourse = async (formData: any) => {
  try {
    // 检查权限
    if (!userStore.userInfo.sessionId) {
      ElMessage.error('请先登录')
      router.push('/login')
      return
    }

    if (userStore.userInfo.role < 1) {
      ElMessage.error('您没有权限添加课程')
      return
    }

    const res = await addCourse(formData)
    if (res.data) {
      ElMessage.success('创建成功')
      router.push(`/course/detail/${res.data.id}`)
    }
  } catch (error: any) {
    console.error('创建课程失败:', error)
    ElMessage.error(error.response?.data?.message || '创建失败，请重试')
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
}

.page-content {
  background-color: var(--el-bg-color);
  min-height: calc(100vh - 120px);
}
</style>