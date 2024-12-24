<template>
  <div class="course-info-container">
    <!-- 基本信息卡片 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <el-icon>
            <InfoFilled />
          </el-icon>
          <span>基本信息</span>
        </div>
      </template>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">课程名称</span>
          <span class="value">{{ courseInfo?.course.courseName }}</span>
        </div>
        <div class="info-item">
          <span class="label">课程编号</span>
          <span class="value">{{ courseInfo?.course.courseId }}</span>
        </div>
        <div class="info-item">
          <span class="label">开课时间</span>
          <span class="value">{{ formatDate(courseInfo?.course.startTime) }}</span>
        </div>
        <div class="info-item">
          <span class="label">结课时间</span>
          <span class="value">{{ formatDate(courseInfo?.course.endTime) }}</span>
        </div>
        <div class="info-item">
          <span class="label">课程状态</span>
          <el-tag :type="getStatusType(courseInfo?.course.status)">
            {{ getStatusText(courseInfo?.course.status) }}
          </el-tag>
        </div>
        <div class="info-item">
          <span class="label">学生人数</span>
          <span class="value">{{ courseInfo?.studentCount || 0 }} 人</span>
        </div>
      </div>
    </el-card>

    <!-- 教师信息卡片 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <el-icon>
            <User />
          </el-icon>
          <span>授课教师</span>
        </div>
      </template>
      <div class="teacher-info">
        <el-avatar :size="64" :src="courseInfo?.teacher.avatar" class="teacher-avatar">
          {{ courseInfo?.teacher.nickname?.charAt(0) }}
        </el-avatar>
        <div class="teacher-details">
          <h3 class="teacher-name">{{ courseInfo?.teacher.nickname }}</h3>
          <p class="teacher-title">{{ courseInfo?.teacher.title || '教授' }}</p>
          <p class="teacher-contact">
            <el-icon>
              <Message />
            </el-icon>
            {{ courseInfo?.teacher.email || '暂无联系方式' }}
          </p>
        </div>
      </div>
    </el-card>

    <!-- 课程描述卡片 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <el-icon>
            <Document />
          </el-icon>
          <span>课程描述</span>
        </div>
      </template>
      <div class="course-description" v-if="courseInfo?.course.courseDesc">
        {{ courseInfo?.course.courseDesc }}
      </div>
      <el-empty v-else description="暂无课程描述" />
    </el-card>

    <!-- 课程资料卡片 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <el-icon>
            <Folder />
          </el-icon>
          <span>课程资料</span>
          <el-button v-if="isTeacher" type="primary" link class="upload-btn" @click="handleUpload">
            <el-icon>
              <Upload />
            </el-icon>上传资料
          </el-button>
        </div>
      </template>
      <div class="materials-list" v-if="materials.length">
        <div v-for="material in materials" :key="material.id" class="material-item">
          <el-icon>
            <Document />
          </el-icon>
          <span class="material-name">{{ material.name }}</span>
          <span class="material-size">{{ formatFileSize(material.size) }}</span>
          <div class="material-actions">
            <el-button type="primary" link @click="downloadMaterial(material)">
              <el-icon>
                <Download />
              </el-icon>下载
            </el-button>
            <el-button v-if="isTeacher" type="danger" link @click="deleteMaterial(material)">
              <el-icon>
                <Delete />
              </el-icon>删除
            </el-button>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无课程资料" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { useUserInfoStore } from '@/store'

const props = defineProps({
  courseInfo: {
    type: Object,
    required: true
  }
})

const userStore = useUserInfoStore()
const isTeacher = computed(() => userStore.userInfo.role > 0)

// 模拟课程资料数据
const materials = ref([
  {
    id: 1,
    name: '课程大纲.pdf',
    size: 1024 * 1024 * 2.5, // 2.5MB
    url: '#'
  },
  {
    id: 2,
    name: '第一章课件.pptx',
    size: 1024 * 1024 * 5.8, // 5.8MB
    url: '#'
  }
])

const formatDate = (date: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD') : '未设置'
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    'active': 'success',
    'upcoming': 'warning',
    'ended': 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'active': '进行中',
    'upcoming': '未开始',
    'ended': '已结束'
  }
  return texts[status] || '未知状态'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleUpload = () => {
  // 实现上传功能
}

const downloadMaterial = (material: any) => {
  // 实现下载功能
}

const deleteMaterial = (material: any) => {
  // 实现删除功能
}
</script>

<style scoped>
.course-info-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-card {
  height: fit-content;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
}

.value {
  font-size: 1rem;
  color: var(--el-text-color-primary);
}

.teacher-info {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.teacher-avatar {
  flex-shrink: 0;
}

.teacher-details {
  flex: 1;
}

.teacher-name {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 500;
}

.teacher-title {
  margin: 0 0 0.5rem;
  color: var(--el-text-color-secondary);
}

.teacher-contact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--el-text-color-regular);
}

.course-description {
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--el-border-radius-base);
  background: var(--el-fill-color-light);
}

.material-name {
  flex: 1;
  font-weight: 500;
}

.material-size {
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
}

.material-actions {
  display: flex;
  gap: 0.5rem;
}

.upload-btn {
  margin-left: auto;
}

@media (max-width: 768px) {
  .course-info-container {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .material-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .material-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
}
</style>