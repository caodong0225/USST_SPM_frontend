<template>
  <div class="notification-card">
    <div class="notification-header">
      <div class="user-info">
        <el-avatar :src="avatarUrl" :size="40">
          <el-icon>
            <UserFilled />
          </el-icon>
        </el-avatar>
        <div class="text-info">
          <span class="username">{{ title }}</span>
          <span class="time">{{ formatTime(date) }}</span>
        </div>
      </div>
      <div class="notification-type" :class="type">
        {{ getTypeText(type) }}
      </div>
    </div>
    <div class="notification-content">
      {{ content }}
    </div>
    <div class="notification-footer" v-if="attachments?.length">
      <div class="attachments">
        <div v-for="file in attachments" :key="file.id" class="attachment-item">
          <el-icon>
            <Document />
          </el-icon>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Props {
  title: string
  content: string
  date: string | Date
  type?: 'notice' | 'homework' | 'question' | 'grade'
  avatarUrl?: string
  attachments?: Array<{
    id: number | string
    name: string
    size: number
  }>
}

const props = withDefaults(defineProps<Props>(), {
  type: 'notice',
  avatarUrl: '',
  attachments: () => []
})

const formatTime = (date: string | Date) => {
  return dayjs(date).fromNow()
}

const getTypeText = (type: string) => {
  const typeMap = {
    notice: '通知',
    homework: '作业',
    question: '问答',
    grade: '成绩'
  }
  return typeMap[type as keyof typeof typeMap] || '通知'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}
</script>

<style scoped>
.notification-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.text-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
  color: var(--text-color);
}

.time {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.notification-type {
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 500;
}

.notification-type.notice {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.notification-type.homework {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.notification-type.question {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.notification-type.grade {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.notification-content {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.notification-footer {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  margin-top: 1rem;
}

.attachments {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.file-name {
  flex: 1;
  color: var(--text-color);
}

.file-size {
  color: var(--text-secondary);
}
</style>