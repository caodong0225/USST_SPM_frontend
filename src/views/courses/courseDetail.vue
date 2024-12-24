<template>
  <PageLayout>
    <div class="course-detail">
      <!-- 课程头部信息 -->
      <div class="course-header"
        :style="{ backgroundImage: `url(${courseInfo?.course.coursePic || '/course-default.jpg'})` }">
        <div class="header-content">
          <div class="course-info">
            <h1 class="course-title">{{ courseInfo?.course.courseName }}</h1>
            <div class="course-meta">
              <div class="meta-item">
                <el-icon>
                  <Calendar />
                </el-icon>
                <span>{{ formatDate(courseInfo?.course.startTime) }} 开课</span>
              </div>
              <div class="meta-item">
                <el-icon>
                  <User />
                </el-icon>
                <span>{{ courseInfo?.studentCount || 0 }} 名学生</span>
              </div>
              <div class="meta-item">
                <el-icon>
                  <UserFilled />
                </el-icon>
                <span>{{ courseInfo?.teacher.nickname }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程导航 -->
      <div class="course-nav">
        <el-menu mode="horizontal" :default-active="activeTab" @select="handleTabChange">
          <el-menu-item index="info">
            <el-icon>
              <InfoFilled />
            </el-icon>课程信息
          </el-menu-item>
          <el-menu-item index="announcement">
            <el-icon>
              <Bell />
            </el-icon>课程公告
          </el-menu-item>
          <el-menu-item index="papers">
            <el-icon>
              <Document />
            </el-icon>课程测验
          </el-menu-item>
          <el-menu-item index="students">
            <el-icon>
              <User />
            </el-icon>班级成员
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 课程内容区域 -->
      <div class="course-content">
        <!-- 课程信息 -->
        <CourseInformation v-if="activeTab === 'info'" :course-info="courseInfo" />

        <!-- 课程公告 -->
        <CreateAnnouncement v-if="activeTab === 'announcement'" :course-id="courseId" />

        <!-- 课程测验 -->
        <TableWithPagination v-if="activeTab === 'papers'" :table-data="paperInfo" :course-id="courseId" />

        <!-- 班级成员 -->
        <Students v-if="activeTab === 'students'" :course-id="courseId" />
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCourseDetail } from '@/api/course'
import { getPapers } from '@/api/paper'
import dayjs from 'dayjs'

import CourseInformation from './components/courseInfo.vue'
import TableWithPagination from './components/coursePapers.vue'
import CreateAnnouncement from './components/createAnnouncement.vue'
import Students from './components/students.vue'

const route = useRoute()
const courseId = route.params.id as string
const courseInfo = ref<any>(null)
const paperInfo = ref<any[]>([])
const activeTab = ref('info')

// 获取课程详情
const fetchCourseDetail = async () => {
  try {
    const { data } = await getCourseDetail(courseId)
    courseInfo.value = data
  } catch (error) {
    console.error('获取课程详情失败:', error)
  }
}

// 获取试卷列表
const fetchPapers = async () => {
  try {
    const { data } = await getPapers(courseId)
    paperInfo.value = data
  } catch (error) {
    console.error('获取试卷列表失败:', error)
  }
}

// 处理标签切换
const handleTabChange = (tab: string) => {
  activeTab.value = tab
}

// 格式化日期
const formatDate = (date: string) => {
  return date ? dayjs(date).format('YYYY-MM-DD') : ''
}

onMounted(() => {
  fetchCourseDetail()
  fetchPapers()
})
</script>

<style scoped>
.course-detail {
  min-height: 100vh;
  background: var(--el-bg-color);
}

.course-header {
  position: relative;
  height: 240px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
}

.course-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8));
}

.header-content {
  position: relative;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.course-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.course-meta {
  display: flex;
  gap: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.course-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  border-bottom: 1px solid var(--el-border-color-light);
}

.course-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .course-header {
    height: 180px;
  }

  .course-title {
    font-size: 1.5rem;
  }

  .course-meta {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .course-content {
    padding: 1rem;
  }
}
</style>