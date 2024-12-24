<template>
  <article class="announcement-card">
    <div class="announcement-header">
      <h1 class="announcement-title">{{ info.announcement.title }}</h1>
      <el-tag :type="getAnnouncementType(info.announcement.type)" size="small">
        {{ getAnnouncementTypeText(info.announcement.type) }}
      </el-tag>
    </div>

    <div class="announcement-meta">
      <div class="meta-item">
        <el-icon>
          <Reading />
        </el-icon>
        <span class="course-name">{{ info.course.courseName }}</span>
      </div>
      <div class="meta-item">
        <el-icon>
          <Clock />
        </el-icon>
        <time class="creation-time">{{ formatDateTime(info.announcement.createdAt) }}</time>
      </div>
      <div class="meta-item">
        <el-icon>
          <User />
        </el-icon>
        <span class="teacher-name">{{ info.user.nickname }}</span>
        <span class="teacher-title">{{ info.user.title }}</span>
      </div>
      <div class="meta-actions" v-if="isTeacher">
        <el-button-group>
          <el-button type="primary" link @click="handleEdit">
            <el-icon>
              <Edit />
            </el-icon>编辑
          </el-button>
          <el-button type="danger" link @click="handleDelete">
            <el-icon>
              <Delete />
            </el-icon>删除
          </el-button>
        </el-button-group>
      </div>
    </div>

    <div class="announcement-body">
      <p class="announcement-content" v-html="formattedContent"></p>

      <!-- 附件列表 -->
      <div class="attachments" v-if="info.announcement.attachments?.length">
        <h4 class="attachments-title">
          <el-icon>
            <Document />
          </el-icon>附件
        </h4>
        <div class="attachment-list">
          <div v-for="file in info.announcement.attachments" :key="file.id" class="attachment-item">
            <el-icon>
              <Document />
            </el-icon>
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
            <el-button type="primary" link @click="downloadFile(file)">
              <el-icon>
                <Download />
              </el-icon>下载
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 阅读状态 -->
    <div class="announcement-footer">
      <div class="read-status">
        <el-icon :class="{ 'has-read': info.hasRead }">
          <View />
        </el-icon>
        <span>{{ info.readCount || 0 }}人已读</span>
      </div>
      <div class="importance" v-if="info.announcement.importance > 0">
        <el-icon>
          <Star />
        </el-icon>
        <span>重要公告</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/store'

interface Attachment {
  id: string
  name: string
  size: number
  url: string
}

interface AnnouncementInfo {
  announcement: {
    id: string
    title: string
    content: string
    createdAt: string
    type: 'notice' | 'homework' | 'exam' | 'other'
    importance: number
    attachments?: Attachment[]
  }
  course: {
    id: string
    courseName: string
  }
  user: {
    id: string
    nickname: string
    title?: string
  }
  hasRead?: boolean
  readCount?: number
}

const props = defineProps<{
  info: AnnouncementInfo
}>()

const userStore = useUserInfoStore()
const isTeacher = computed(() => userStore.isTeacher)

// 格式化日期时间
const formatDateTime = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) return size + 'B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + 'KB'
  return (size / (1024 * 1024)).toFixed(1) + 'MB'
}

// 获取公告类型
const getAnnouncementType = (type: string) => {
  const typeMap: Record<string, string> = {
    notice: 'primary',
    homework: 'success',
    exam: 'danger',
    other: 'info'
  }
  return typeMap[type] || 'info'
}

// 获取公告类型文本
const getAnnouncementTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    notice: '通知',
    homework: '作业',
    exam: '考试',
    other: '其他'
  }
  return textMap[type] || '通知'
}

// 格式化内容（将换行符转换为 HTML）
const formattedContent = computed(() => {
  return props.info.announcement.content.replace(/\n/g, '<br>')
})

// 下载文件
const downloadFile = (file: Attachment) => {
  window.open(file.url, '_blank')
}

// 编辑公告
const handleEdit = () => {
  // 实现编辑功能
}

// 删除公告
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这条公告吗？', '警告', {
      type: 'warning'
    })
    // 实现删除功能
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}
</script>

<style scoped>
.announcement-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.announcement-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.announcement-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--el-text-color-primary);
  flex: 1;
}

.announcement-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--el-border-color-light);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--el-text-color-regular);
  font-size: 0.875rem;
}

.teacher-title {
  color: var(--el-text-color-secondary);
  font-size: 0.75rem;
}

.announcement-body {
  padding: 1.5rem 0;
}

.announcement-content {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--el-text-color-primary);
  margin: 0;
  white-space: pre-wrap;
}

.attachments {
  margin-top: 2rem;
}

.attachments-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: var(--el-text-color-primary);
  margin: 0 0 1rem;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

.file-name {
  flex: 1;
  font-size: 0.875rem;
}

.file-size {
  color: var(--el-text-color-secondary);
  font-size: 0.75rem;
}

.announcement-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--el-border-color-light);
}

.read-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
}

.has-read {
  color: var(--el-color-success);
}

.importance {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--el-color-danger);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .announcement-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .meta-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>