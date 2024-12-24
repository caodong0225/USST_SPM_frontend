<template>
  <section class="announcements-list">
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">公告列表</h1>
        <el-tag type="info" class="total-count">共 {{ totalNum }} 条公告</el-tag>
      </div>
      <div class="header-actions" v-if="isTeacher">
        <el-button type="primary" @click="showCreateForm = true">
          <el-icon>
            <Plus />
          </el-icon>发布公告
        </el-button>
      </div>
    </header>

    <!-- 搜索和筛选区域 -->
    <div class="filters-bar">
      <div class="search-box">
        <el-input v-model="searchQuery" placeholder="搜索公告标题或内容..." clearable @input="handleSearch">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
      <div class="filter-options">
        <el-select v-model="typeFilter" placeholder="公告类型" clearable @change="handleFilter">
          <el-option label="全部类型" value="" />
          <el-option label="通知" value="notice" />
          <el-option label="作业" value="homework" />
          <el-option label="考试" value="exam" />
        </el-select>
        <el-select v-model="courseFilter" placeholder="课程" clearable @change="handleFilter">
          <el-option label="全部课程" value="" />
          <el-option v-for="course in courses" :key="course.id" :label="course.name" :value="course.id" />
        </el-select>
        <el-select v-model="sortBy" placeholder="排序方式" @change="handleSort">
          <el-option label="最新发布" value="latest" />
          <el-option label="重要程度" value="importance" />
          <el-option label="阅读数量" value="readCount" />
        </el-select>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card v-for="stat in announcementStats" :key="stat.title" class="stat-card">
        <template #header>
          <div class="stat-header">
            <el-icon :class="stat.iconClass">
              <component :is="stat.icon" />
            </el-icon>
            <span>{{ stat.title }}</span>
          </div>
        </template>
        <div class="stat-value">{{ stat.value }}</div>
      </el-card>
    </div>

    <!-- 公告列表 -->
    <div class="announcements-container">
      <el-empty v-if="!filteredAnnouncements.length" description="暂无公告" />
      <template v-else>
        <AnnouncementCard v-for="announcement in filteredAnnouncements" :key="announcement.announcement.id"
          :info="announcement" @delete="handleAnnouncementDelete" />
      </template>
    </div>

    <!-- 分页控制 -->
    <footer class="pagination-controls">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="itemsPerPage" :total="totalNum"
        :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handlePageChange" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import AnnouncementCard from './components/announcements.vue'
import { useUserInfoStore } from '@/store'

// 添加示例数据
const mockAnnouncements = [
  {
    announcement: {
      id: '1',
      title: '关于期中考试安排的重要通知',
      content: '各位同学：\n\n期中考试将于4月15日14:00-15:30在第一教学楼进行。请携带学生证和考试必需品，提前15分钟到达考场。考试内容包括：\n\n1. 软件工程基础理论\n2. 需求分析方法\n3. 系统设计原则\n4. UML建模技术\n\n请同学们认真复习，遵守考试纪律。',
      createdAt: '2024-03-25 10:00:00',
      type: 'exam',
      importance: 2,
      attachments: [
        {
          id: '1',
          name: '考试大纲.pdf',
          size: 1024 * 1024 * 2.5,
          url: '/files/exam-outline.pdf'
        }
      ]
    },
    course: {
      id: '1',
      courseName: '软件工程导论'
    },
    user: {
      id: '1',
      nickname: '张教授',
      title: '教授'
    },
    hasRead: true,
    readCount: 120
  },
  {
    announcement: {
      id: '2',
      title: '第三次作业提交通知',
      content: '请各位同学于本周五（3月29日）前完成以下作业：\n\n1. 完成用例图的绘制\n2. 编写详细的需求规格说明书\n3. 提供系统原型设计\n\n作业提交格式：PDF文档\n命名规则：学号_姓名_作业3\n\n请按时提交，逾期将扣分处理。',
      createdAt: '2024-03-26 15:30:00',
      type: 'homework',
      importance: 1
    },
    course: {
      id: '1',
      courseName: '软件工程导论'
    },
    user: {
      id: '1',
      nickname: '张教授',
      title: '教授'
    },
    hasRead: false,
    readCount: 89
  },
  {
    announcement: {
      id: '3',
      title: '课程实践项目分组通知',
      content: '各位同学：\n\n课程项目分组工作现已开始，请注意以下事项：\n\n1. 每组4-5人\n2. 组长需要填写项目申请表\n3. 项目主题可以自选或从题目列表中选择\n4. 截止时间：4月5日\n\n请尽快完成分组，开始项目准备工作。',
      createdAt: '2024-03-27 09:00:00',
      type: 'notice',
      importance: 1,
      attachments: [
        {
          id: '2',
          name: '项目申请表.docx',
          size: 1024 * 512,
          url: '/files/project-application.docx'
        },
        {
          id: '3',
          name: '项目题目列表.pdf',
          size: 1024 * 1024 * 1.5,
          url: '/files/project-topics.pdf'
        }
      ]
    },
    course: {
      id: '1',
      courseName: '软件工程导论'
    },
    user: {
      id: '1',
      nickname: '张教授',
      title: '教授'
    },
    hasRead: true,
    readCount: 95
  }
]

// Store
const userStore = useUserInfoStore()
const isTeacher = computed(() => userStore.isTeacher)

// 状态管理
const showCreateForm = ref(false)
const announcements = ref(mockAnnouncements)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalNum = ref(mockAnnouncements.length)
const searchQuery = ref('')
const typeFilter = ref('')
const courseFilter = ref('')
const sortBy = ref('latest')

// 课程列表
const courses = ref([
  { id: '1', name: '软件工程导论' },
  { id: '2', name: '数据库系统' },
  { id: '3', name: '计算机网络' }
])

// 统计数据
const announcementStats = computed(() => [
  {
    title: '未读公告',
    value: announcements.value.filter(a => !a.hasRead).length,
    icon: 'Bell',
    iconClass: 'text-warning'
  },
  {
    title: '重要公告',
    value: announcements.value.filter(a => a.announcement.importance > 0).length,
    icon: 'Star',
    iconClass: 'text-danger'
  },
  {
    title: '本周发布',
    value: announcements.value.filter(a =>
      dayjs(a.announcement.createdAt).isAfter(dayjs().subtract(7, 'day'))
    ).length,
    icon: 'Calendar',
    iconClass: 'text-primary'
  }
])

// 过滤和排序
const filteredAnnouncements = computed(() => {
  let result = [...announcements.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.announcement.title.toLowerCase().includes(query) ||
      a.announcement.content.toLowerCase().includes(query)
    )
  }

  // 类型过滤
  if (typeFilter.value) {
    result = result.filter(a => a.announcement.type === typeFilter.value)
  }

  // 课程过滤
  if (courseFilter.value) {
    result = result.filter(a => a.course.id === courseFilter.value)
  }

  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'importance':
        return b.announcement.importance - a.announcement.importance
      case 'readCount':
        return (b.readCount || 0) - (a.readCount || 0)
      default: // 'latest'
        return dayjs(b.announcement.createdAt).unix() - dayjs(a.announcement.createdAt).unix()
    }
  })

  return result
})

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 处理筛选
const handleFilter = () => {
  currentPage.value = 1
}

// 处理排序
const handleSort = () => {
  currentPage.value = 1
}

// 处理分页
const handleSizeChange = (size: number) => {
  itemsPerPage.value = size
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 处理公告删除
const handleAnnouncementDelete = (id: string) => {
  announcements.value = announcements.value.filter(a => a.announcement.id !== id)
  totalNum.value = announcements.value.length
  ElMessage.success('公告已删除')
}
</script>

<style scoped>
.announcements-list {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.total-count {
  font-weight: normal;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
}

.filter-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.announcements-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.pagination-controls {
  display: flex;
  justify-content: center;
}

.text-warning {
  color: var(--el-color-warning);
}

.text-danger {
  color: var(--el-color-danger);
}

.text-primary {
  color: var(--el-color-primary);
}

@media (max-width: 768px) {
  .announcements-list {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filters-bar {
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .filter-options {
    width: 100%;
  }

  .filter-options .el-select {
    width: 100%;
  }
}
</style>
