<template>
  <PageLayout title="我创建的课程">
    <div class="my-courses">
      <!-- 顶部操作区 -->
      <div class="action-bar">
        <el-button type="primary" @click="$router.push('/courses/add')">
          <el-icon><Plus /></el-icon>创建课程
        </el-button>
      </div>

      <!-- 课程列表 -->
      <div class="courses-grid">
        <el-empty 
          v-if="!courses.length && !loading" 
          description="还没有创建任何课程"
        >
          <el-button type="primary" @click="$router.push('/courses/add')">
            立即创建
          </el-button>
        </el-empty>

        <el-card
          v-else
          v-for="course in courses"
          :key="course.id"
          class="course-card"
          @click="$router.push(`/courses/${course.id}`)"
        >
          <div class="course-cover">
            <el-image
              :src="course.coursePic || '/images/defaults/course-default.jpg'"
              fit="cover"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="course-tags">
              <el-tag size="small" effect="plain" type="info">
                {{ course.type || '通识课程' }}
              </el-tag>
            </div>
            <div class="course-status" :class="course.status">
              {{ getStatusText(course.status) }}
            </div>
            <div class="course-progress">
              <div class="progress-info">
                <span class="progress-text">课程进度</span>
                <span class="progress-value">{{ getProgressText(course) }}</span>
              </div>
              <el-progress 
                :percentage="calculateProgress(course)"
                :status="getProgressStatus(course)"
                :stroke-width="4"
              />
            </div>
          </div>
          <div class="course-info">
            <div class="course-header">
              <h3 class="course-title">{{ course.courseName }}</h3>
              <el-tag 
                size="small" 
                :type="course.difficulty || 'info'"
              >
                {{ getDifficultyText(course.difficulty) }}
              </el-tag>
            </div>
            <p class="course-desc">{{ course.courseDesc }}</p>
            <div class="course-meta">
              <div class="meta-left">
                <span class="time">
                  <el-icon><Calendar /></el-icon>
                  {{ formatDate(course.startTime, 'YYYY-MM-DD HH:mm') }}
                </span>
                <span class="duration" v-if="course.duration">
                  <el-icon><Timer /></el-icon>
                  {{ course.duration || '4周' }}
                </span>
              </div>
              <div class="meta-right">
                <span class="students">
                  <el-icon><User /></el-icon>
                  {{ course.studentCount || 0 }}人
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[8, 12, 24]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Picture, Calendar, User, Timer } from '@element-plus/icons-vue'
import { getMyCreatedCourses } from '@/api/course'
import { formatDate } from '@/utils/date'
import PageLayout from '@/components/layout/PageLayout.vue'

const loading = ref(false)
const courses = ref([])
const currentPage = ref(1)
const pageSize = ref(8)
const total = ref(0)

// 获取课程列表
const fetchCourses = async () => {
  loading.value = true
  try {
    const res = await getMyCreatedCourses(currentPage.value, pageSize.value)
    courses.value = res.data.records
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取课程列表失败')
  } finally {
    loading.value = false
  }
}

// 状态文本映射
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'upcoming': '即将开始',
    'ongoing': '进行中',
    'ended': '已结束'
  }
  return statusMap[status] || status
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchCourses()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchCourses()
}

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  const difficultyMap: Record<string, string> = {
    'easy': '入门',
    'medium': '进阶',
    'hard': '高级',
  }
  return difficultyMap[difficulty] || '入门'
}

// 计算课程进度
const calculateProgress = (course: any) => {
  const now = new Date().getTime()
  const start = new Date(course.startTime).getTime()
  const end = new Date(course.endTime).getTime()
  
  if (now < start) return 0
  if (now > end) return 100
  
  return Math.round(((now - start) / (end - start)) * 100)
}

// 获取进度状态
const getProgressStatus = (course: any) => {
  const progress = calculateProgress(course)
  if (progress === 0) return ''
  if (progress === 100) return 'success'
  return 'warning'
}

// 获取进度文本
const getProgressText = (course: any) => {
  const progress = calculateProgress(course)
  if (progress === 0) return '未开始'
  if (progress === 100) return '已结束'
  return `${progress}%`
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.my-courses {
  padding: 20px;
}

.action-bar {
  margin-bottom: 20px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.course-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.course-card:hover {
  transform: translateY(-4px);
}

.course-cover {
  position: relative;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.course-cover .el-image {
  width: 100%;
  height: 100%;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 24px;
}

.course-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.course-status.upcoming {
  background-color: var(--el-color-warning);
}

.course-status.ongoing {
  background-color: var(--el-color-success);
}

.course-status.ended {
  background-color: var(--el-color-info);
}

.course-info {
  padding: 12px 0;
}

.course-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.course-desc {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.meta-left {
  display: flex;
  gap: 16px;
}

.meta-left span, .meta-right span {
  display: flex;
  align-items: center;
}

.meta-left .el-icon, .meta-right .el-icon {
  margin-right: 4px;
}

.course-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}

.course-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .my-courses {
    padding: 10px;
  }

  .courses-grid {
    gap: 10px;
  }
}

/* 深色主题适配 */
:deep(.el-progress-bar__outer) {
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-progress-bar__inner) {
  transition: all 0.3s;
}
</style> 