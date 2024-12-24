<template>
  <div class="course-card" @click="navigateToCourse">
    <!-- 课程封面区域 -->
    <div class="course-cover">
      <img :src="imageUrl || '/images/defaults/course-default.jpg'" :alt="title" class="cover-image" />
      <div class="course-status" :class="statusClass">
        <el-icon>
          <component :is="statusIcon" />
        </el-icon>
        {{ statusText }}
      </div>
      <div class="course-teacher">
        <el-avatar :size="32" :src="teacher?.avatar || '/images/defaults/avatar-default.jpg'">
          {{ teacher?.name?.charAt(0) }}
        </el-avatar>
        <span class="teacher-name">{{ teacher?.name }}</span>
      </div>
      <div class="course-code">
        {{ courseCode }}
      </div>
    </div>

    <!-- 课程内容区域 -->
    <div class="course-content">
      <h3 class="course-title" :title="title">{{ title }}</h3>
      <p class="course-description" :title="description">{{ description }}</p>

      <!-- 课程进度 -->
      <div class="course-progress" v-if="status === 'active'">
        <div class="progress-info">
          <span class="progress-label">课程进度</span>
          <span class="progress-value">{{ progress }}%</span>
        </div>
        <el-progress :percentage="progress" :color="progressColor" :stroke-width="8" :show-text="false" />
      </div>

      <!-- 课程信息 -->
      <div class="course-meta">
        <div class="meta-item">
          <el-icon>
            <Calendar />
          </el-icon>
          <span>{{ formatDate(startTime) }}</span>
        </div>
        <div class="meta-item">
          <el-icon>
            <User />
          </el-icon>
          <span>{{ studentCount }}人</span>
        </div>
      </div>

      <!-- 添加更多课程信息 -->
      <div class="course-info">
        <div class="info-item">
          <el-icon>
            <Trophy />
          </el-icon>
          <span>{{ credits }}学分</span>
        </div>
        <div class="info-item">
          <el-icon>
            <School />
          </el-icon>
          <span>{{ department }}</span>
        </div>
        <div class="info-item">
          <el-icon>
            <Location />
          </el-icon>
          <span>{{ location }}</span>
        </div>
      </div>

      <!-- 添加提醒信息 -->
      <div class="course-alerts" v-if="hasAlerts">
        <el-badge :value="announcements" type="danger" v-if="announcements">
          <el-button size="small">未读公告</el-button>
        </el-badge>
        <el-badge :value="assignments" type="warning" v-if="assignments">
          <el-button size="small">待交作业</el-button>
        </el-badge>
      </div>

      <!-- 添加下一次课程信息 -->
      <div class="next-class" v-if="nextClass">
        <h4>下次课程</h4>
        <p class="next-time">{{ formatDateTime(nextClass.time) }}</p>
        <p class="next-location">{{ nextClass.location }}</p>
        <p class="next-topic">{{ nextClass.topic }}</p>
      </div>
    </div>

    <!-- 课程标签和操作 -->
    <div class="course-footer">
      <div class="course-tags">
        <el-tag v-for="tag in tags" :key="tag" :type="getTagType(tag)" size="small" effect="light">
          {{ tag }}
        </el-tag>
      </div>
      <el-button type="primary" link class="enter-btn">
        进入课程
        <el-icon class="el-icon--right">
          <ArrowRight />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

interface Teacher {
  name: string
  avatar?: string
  title?: string
  department?: string
  email?: string
}

interface Props {
  id: number | string
  title: string
  description: string
  startTime: string
  endTime: string
  status: 'upcoming' | 'active' | 'ended'
  imageUrl?: string
  studentCount?: number
  progress?: number
  teacher?: Teacher
  tags?: string[]
  courseCode: string
  credits: number
  maxStudents: number
  location?: string
  schedule?: string[]
  prerequisites?: string[]
  department: string
  category: string
  materials?: {
    name: string
    type: string
    size: number
    url: string
  }[]
  announcements?: number
  assignments?: number
  nextClass?: {
    time: string
    location: string
    topic: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  studentCount: 0,
  progress: 0,
  tags: () => []
})

const router = useRouter()

// 状态相关计算属性
const statusClass = computed(() => `status-${props.status}`)
const statusIcon = computed(() => ({
  upcoming: 'Timer',
  active: 'VideoPlay',
  ended: 'CircleCheck'
})[props.status])

const statusText = computed(() => ({
  upcoming: '未开始',
  active: '进行中',
  ended: '已结束'
})[props.status])

// 进度条颜色
const progressColor = computed(() => {
  if (props.progress >= 80) return '#67C23A'
  if (props.progress >= 50) return '#409EFF'
  return '#E6A23C'
})

// 标签类型
const getTagType = (tag: string) => {
  const tagTypes: Record<string, string> = {
    '必修': 'danger',
    '选修': 'warning',
    '实验': 'success',
    '考试': ''
  }
  return tagTypes[tag] || 'info'
}

// 日期格式化
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 跳转到课程详情
const navigateToCourse = () => {
  router.push(`/course/detail/${props.id}`)
}
</script>

<style scoped>
.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--el-border-color-light);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.course-cover {
  position: relative;
  padding-top: 56.25%;
  background: var(--el-fill-color-light);
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  backdrop-filter: blur(8px);
}

.status-active {
  background: rgba(103, 194, 58, 0.9);
  color: white;
}

.status-upcoming {
  background: rgba(64, 158, 255, 0.9);
  color: white;
}

.status-ended {
  background: rgba(144, 147, 153, 0.9);
  color: white;
}

.course-teacher {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.teacher-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
}

.course-content {
  padding: 1.5rem;
  flex: 1;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-description {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.course-progress {
  margin: 1rem 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.progress-label {
  color: var(--el-text-color-secondary);
}

.progress-value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.course-meta {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
}

.course-footer {
  border-top: 1px solid var(--el-border-color-lighter);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.enter-btn {
  font-weight: 500;
}

@media (max-width: 640px) {
  .course-teacher {
    display: none;
  }

  .course-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

.course-code {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
}

.course-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--el-text-color-regular);
  font-size: 0.875rem;
}

.course-alerts {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.next-class {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--el-color-primary-light-9);
  border-radius: var(--el-border-radius-base);
}

.next-class h4 {
  margin: 0 0 0.5rem;
  color: var(--el-color-primary);
}

.next-time {
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0 0 0.25rem;
}

.next-location,
.next-topic {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  margin: 0;
}
</style>