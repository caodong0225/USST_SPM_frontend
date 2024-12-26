<template>
  <el-card class="announcement-card" :class="{ 'is-unread': !announcement.isRead }">
    <div class="announcement-header">
      <div class="header-left">
        <h3 class="title">{{ announcement.title }}</h3>
        <el-tag size="small" type="info" class="type-tag">
          {{ getAnnouncementType(announcement.type) }}
        </el-tag>
      </div>
      <div class="header-actions" v-if="isTeacher">
        <el-button type="primary" link @click="$emit('edit', announcement)">
          <el-icon><Edit /></el-icon>
        </el-button>
        <el-button type="danger" link @click="handleDelete">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>

    <div class="meta-info">
      <div class="author-info">
        <el-avatar :size="24" :src="announcement.authorAvatar">
          {{ announcement.author?.charAt(0) }}
        </el-avatar>
        <span class="author-name">{{ announcement.author }}</span>
      </div>
      <time class="publish-time">{{ formatDate(announcement.date) }}</time>
    </div>

    <div class="announcement-content">
      {{ announcement.content }}
    </div>

    <!-- 附件列表 -->
    <div v-if="announcement.attachments?.length" class="attachments">
      <div class="attachments-header">
        <el-icon><Paperclip /></el-icon>
        <span>附件</span>
      </div>
      <div class="attachment-list">
        <div 
          v-for="file in announcement.attachments" 
          :key="file.id"
          class="attachment-item"
        >
          <el-icon><Document /></el-icon>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
          <el-button type="primary" link size="small" @click="downloadFile(file)">
            <el-icon><Download /></el-icon>下载
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { Edit, Delete, Paperclip, Document, Download } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/date'

interface Props {
  announcement: {
    id: number | string
    title: string
    content: string
    date: string
    author: string
    authorAvatar?: string
    type?: string
    isRead?: boolean
    attachments?: Array<{
      id: number | string
      name: string
      size: number
      url: string
    }>
  }
  isTeacher?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isTeacher: false
})

const emit = defineEmits(['edit', 'delete'])

// 获取公告类型文本
const getAnnouncementType = (type: string) => {
  const types: Record<string, string> = {
    'notice': '通知',
    'homework': '作业',
    'exam': '考试',
    'other': '其他'
  }
  return types[type] || '通知'
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

// 处理删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条公告吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    emit('delete', props.announcement)
  } catch {
    // 用户取消删除
  }
}

// 下载文件
const downloadFile = (file: any) => {
  window.open(file.url)
}
</script>

<style scoped>
.announcement-card {
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.announcement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.announcement-card.is-unread {
  border-left: 3px solid var(--el-color-primary);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.type-tag {
  flex-shrink: 0;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.announcement-content {
  line-height: 1.6;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

.attachments {
  background: var(--el-fill-color-light);
  border-radius: 4px;
  padding: 12px;
}

.attachments-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--el-text-color-secondary);
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--el-bg-color);
  border-radius: 4px;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>
