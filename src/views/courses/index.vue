<template>
  <PageLayout title="我的课程">
    <div class="courses-page">
      <!-- 顶部统计卡片 -->
      <div class="stats-cards">
        <el-card v-for="stat in courseStats" :key="stat.title" class="stat-card">
          <template #header>
            <div class="stat-header">
              <el-icon :size="24" :class="stat.iconClass">
                <component :is="stat.icon" />
              </el-icon>
              <span class="stat-title">{{ stat.title }}</span>
            </div>
          </template>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'" v-if="stat.trend !== undefined">
            <el-icon>
              <component :is="stat.trend > 0 ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
            <span>{{ Math.abs(stat.trend) }}%</span>
          </div>
        </el-card>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="action-bar">
        <div class="search-filters">
          <el-input v-model="searchQuery" placeholder="搜索课程..." class="search-input" clearable @input="handleSearch">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-select v-model="statusFilter" placeholder="课程状态" @change="handleFilterChange">
            <el-option label="全部课程" value="" />
            <el-option label="进行中" value="active" />
            <el-option label="已结束" value="ended" />
            <el-option label="未开始" value="upcoming" />
          </el-select>
          <el-select v-model="sortBy" placeholder="排序方式" @change="handleSort">
            <el-option label="最新添加" value="latest" />
            <el-option label="开课时间" value="startTime" />
            <el-option label="学生人数" value="studentCount" />
          </el-select>
        </div>
        <el-button-group v-if="isAdmin">
          <el-button type="primary" @click="goToAddCourse">
            <el-icon>
              <Plus />
            </el-icon>添加课程
          </el-button>
          <el-button type="info">
            <el-icon>
              <Upload />
            </el-icon>导入课程
          </el-button>
        </el-button-group>
      </div>

      <!-- 课程网格 -->
      <div class="courses-container">
        <el-empty v-if="totalNum < 1" description="暂无课程" :image-size="200">
          <template #extra>
            <el-button type="primary" @click="goToAddCourse" v-if="isAdmin">添加课程</el-button>
          </template>
        </el-empty>
        <div v-else class="courses-grid">
          <CourseCard v-for="course in filteredCourses" :key="course.courseId" v-bind="course"
            @click="navigateToCourse(course.courseId)" />
        </div>
      </div>

      <!-- 分页控制 -->
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalNum"
          :page-sizes="[8, 12, 16, 24]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/store'
import CourseCard from './components/courses.vue'

// 统计数据
const mockCourses = [
  {
    courseId: 1,
    courseName: '软件工程导论',
    courseDesc: '本课程介绍软件工程的基本概念、原理和方法，包括软件过程��需求分析、系统设计、编码实现、测试验证等内容。',
    startTime: '2024-03-01',
    endTime: '2024-07-01',
    status: 'active',
    progress: 45,
    studentCount: 120,
    coursePic: 'https://source.unsplash.com/800x400/?programming,software',
    teacher: {
      name: '张教授',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1'
    },
    tags: ['必修', '考试']
  },
  {
    courseId: 2,
    courseName: '人工智能基础',
    courseDesc: '介绍人工智能的核心概念和基础理论，包括机器学习、深度学习、计算机视觉等领域的基础知识。',
    startTime: '2024-03-15',
    endTime: '2024-07-15',
    status: 'active',
    progress: 35,
    studentCount: 85,
    coursePic: 'https://source.unsplash.com/800x400/?artificial-intelligence',
    teacher: {
      name: '李教授',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2'
    },
    tags: ['选修', '大作业']
  },
  {
    courseId: 3,
    courseName: '数据库系统',
    courseDesc: '学习数据库系统的基本原理和应用，包括关系数据库、SQL语言、数据库设计等内容。',
    startTime: '2024-02-20',
    endTime: '2024-06-20',
    status: 'active',
    progress: 60,
    studentCount: 95,
    coursePic: 'https://source.unsplash.com/800x400/?database,server',
    teacher: {
      name: '王教授',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher3'
    },
    tags: ['必修', '实验']
  },
  {
    courseId: 4,
    courseName: '计算机网络',
    courseDesc: '介绍计算机网络的基本概念、体系结构和协议，包括TCP/IP协议族、网络安全等内容。',
    startTime: '2024-04-01',
    endTime: '2024-08-01',
    status: 'upcoming',
    progress: 0,
    studentCount: 0,
    coursePic: 'https://source.unsplash.com/800x400/?network,internet',
    teacher: {
      name: '刘教授',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher4'
    },
    tags: ['必修', '考试']
  },
  {
    courseId: 5,
    courseName: '前端开发实践',
    courseDesc: '学习现代前端开发技术，包括Vue.js、React、TypeScript等主流框架和工具的使用。',
    startTime: '2024-01-01',
    endTime: '2024-03-01',
    status: 'ended',
    progress: 100,
    studentCount: 76,
    coursePic: 'https://source.unsplash.com/800x400/?web,coding',
    teacher: {
      name: '陈教授',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher5'
    },
    tags: ['选修', '项目']
  }
]

// 状态管理
const userInfoStore = useUserInfoStore()
const router = useRouter()
const isAdmin = computed(() => userInfoStore.userInfo.role > 0)

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('latest')

// 分页
const currentPage = ref(1)
const pageSize = ref(12)
const totalNum = computed(() => filteredCourses.value.length)

// 方法
const handleSearch = () => {
  // 现搜索逻辑
}

const handleFilterChange = () => {
  // 实现筛选逻辑
}

const handleSort = () => {
  // 实现排序逻辑
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchCourses()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchCourses()
}

const goToAddCourse = () => {
  router.push('/courses/add')
}

const navigateToCourse = (id: number | string) => {
  router.push(`/course/detail/${id}`)
}

const fetchCourses = async () => {
  // 在实际项目中这里会调用API
  // const res = await getCourseList()
  // courses.value = res.data

  // 现在直接使用 computed 的���果
  totalNum.value = filteredCourses.value.length
}

onMounted(() => {
  fetchCourses()
})

// 修改为 filteredCourses
const filteredCourses = computed(() => {
  let result = mockCourses

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(course =>
      course.courseName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.courseDesc.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 状态过滤
  if (statusFilter.value) {
    result = result.filter(course => course.status === statusFilter.value)
  }

  // 排序
  if (sortBy.value) {
    result = [...result].sort((a, b) => {
      switch (sortBy.value) {
        case 'startTime':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        case 'studentCount':
          return b.studentCount - a.studentCount
        default: // 'latest'
          return b.courseId - a.courseId
      }
    })
  }

  return result
})

// 添加课程统计数据
const courseStats = computed(() => [
  {
    title: '进行中课程',
    value: mockCourses.filter(c => c.status === 'active').length,
    icon: 'Clock',
    iconClass: 'text-primary',
    trend: 10
  },
  {
    title: '总学生人数',
    value: mockCourses.reduce((sum, c) => sum + c.studentCount, 0),
    icon: 'User',
    iconClass: 'text-success',
    trend: 15
  },
  {
    title: '即将开始',
    value: mockCourses.filter(c => c.status === 'upcoming').length,
    icon: 'Calendar',
    iconClass: 'text-warning',
    trend: 5
  },
  {
    title: '已结束课程',
    value: mockCourses.filter(c => c.status === 'ended').length,
    icon: 'Check',
    iconClass: 'text-info',
    trend: -2
  }
])
</script>

<style scoped>
.courses-page {
  padding: 1.5rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-title {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0.5rem 0;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.stat-trend.up {
  color: var(--el-color-success);
}

.stat-trend.down {
  color: var(--el-color-danger);
}

.text-primary {
  color: var(--el-color-primary);
}

.text-success {
  color: var(--el-color-success);
}

.text-warning {
  color: var(--el-color-warning);
}

.text-danger {
  color: var(--el-color-danger);
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-filters {
  display: flex;
  gap: 1rem;
  flex: 1;
  max-width: 800px;
}

.search-input {
  max-width: 300px;
}

.courses-container {
  min-height: 400px;
  margin-bottom: 2rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .courses-page {
    padding: 1rem;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-bar {
    flex-direction: column;
  }

  .search-filters {
    flex-direction: column;
    max-width: 100%;
  }

  .search-input {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
