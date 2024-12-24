<template>
  <div class="questions-page">
    <header class="page-header">
      <div class="header-left">
        <h1>题库管理</h1>
        <el-tag type="info">共 {{ totalQuestions }} 道题目</el-tag>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="$router.push(`/questions/add/${courseId}`)">
          <el-icon>
            <Plus />
          </el-icon>添加题目
        </el-button>
      </div>
    </header>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card v-for="stat in questionStats" :key="stat.title" class="stat-card">
        <template #header>
          <div class="stat-header">
            <el-icon :class="stat.iconClass">
              <component :is="stat.icon" />
            </el-icon>
            <span>{{ stat.title }}</span>
          </div>
        </template>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-info">
          <small>较上月{{ stat.trend > 0 ? '增加' : '减少' }} {{ Math.abs(stat.trend) }}%</small>
          <el-icon :class="stat.trend > 0 ? 'trend-up' : 'trend-down'">
            <component :is="stat.trend > 0 ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </div>
      </el-card>
    </div>

    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <div class="toolbar-section">
        <div class="search-box">
          <el-input v-model="searchQuery" placeholder="搜索题目..." clearable>
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="filters">
          <el-select v-model="typeFilter" placeholder="题目类型" clearable>
            <el-option label="全部类型" value="" />
            <el-option label="选择题" value="choice" />
            <el-option label="填空题" value="fill" />
            <el-option label="判断题" value="judge" />
          </el-select>
          <el-select v-model="difficultyFilter" placeholder="难度等级" clearable>
            <el-option label="全部难度" value="" />
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
          <el-select v-model="sortBy" placeholder="排序方式">
            <el-option label="最新添加" value="latest" />
            <el-option label="使用次数" value="usage" />
            <el-option label="难度等级" value="difficulty" />
          </el-select>
        </div>
      </div>
      <div class="toolbar-section">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button label="card">卡片视图</el-radio-button>
          <el-radio-button label="table">表格视图</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="questions-list">
      <el-empty v-if="!filteredQuestions.length" description="暂无题目" />
      <el-card v-for="question in filteredQuestions" :key="question.id" class="question-card">
        <div class="question-header">
          <div class="question-type">
            <el-tag :type="getQuestionTypeTag(question.type)">
              {{ getQuestionTypeLabel(question.type) }}
            </el-tag>
            <el-tag :type="getDifficultyTag(question.difficulty)" class="difficulty-tag">
              {{ question.difficulty }}
            </el-tag>
          </div>
          <div class="question-actions">
            <el-button-group>
              <el-button type="primary" link @click="editQuestion(question)">
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
              <el-button type="danger" link @click="deleteQuestion(question)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>
        <div class="question-content">
          <h3>{{ question.content }}</h3>
          <div class="question-options" v-if="question.type === 'choice'">
            <div v-for="(option, key) in question.options" :key="key" class="option">
              {{ key }}: {{ option }}
            </div>
          </div>
        </div>
        <div class="question-footer">
          <div class="question-info">
            <span>使用次数: {{ question.usageCount }}</span>
            <span>添加时间: {{ formatDate(question.createdAt) }}</span>
          </div>
          <div class="question-answer">
            <el-tag type="success">正确答案: {{ question.answer }}</el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页控制 -->
    <div class="pagination-controls">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalQuestions"
        :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'

// 示例数据
const mockQuestions = [
  {
    id: '1',
    type: 'choice',
    content: '在OSI参考模型中，（）层提供端到端的可靠数据传输服务。',
    options: {
      A: '物理层',
      B: '数据链路层',
      C: '传输层',
      D: '应用层'
    },
    answer: 'C',
    difficulty: '中等',
    usageCount: 15,
    createdAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '4',
    type: 'choice',
    content: '以下哪个不是Java的基本数据类型？',
    options: {
      A: 'int',
      B: 'boolean',
      C: 'String',
      D: 'double'
    },
    answer: 'C',
    difficulty: '简单',
    usageCount: 25,
    createdAt: '2024-03-23T11:20:00Z'
  },
  {
    id: '5',
    type: 'choice',
    content: '关于Spring框架的说法，错误的是：',
    options: {
      A: '提供了依赖注入功能',
      B: '是一个轻量级的开源框架',
      C: '只能用于Web应用开发',
      D: '支持面向切面编程(AOP)'
    },
    answer: 'C',
    difficulty: '困难',
    usageCount: 18,
    createdAt: '2024-03-24T09:45:00Z'
  },
  {
    id: '2',
    type: 'fill',
    content: '计算机网络按照规模可分为（）和（）。',
    answer: 'LAN,WAN',
    difficulty: '简单',
    usageCount: 8,
    createdAt: '2024-03-21T14:30:00Z'
  },
  {
    id: '6',
    type: 'fill',
    content: 'Java中的访问修饰符从最严格到最宽松依次是（）、（）、（）、（）。',
    answer: 'private,default,protected,public',
    difficulty: '中等',
    usageCount: 20,
    createdAt: '2024-03-25T13:15:00Z'
  },
  {
    id: '3',
    type: 'judge',
    content: 'HTTP协议是无状态的协议。',
    answer: 'T',
    difficulty: '简单',
    usageCount: 12,
    createdAt: '2024-03-22T09:15:00Z'
  },
  {
    id: '7',
    type: 'judge',
    content: 'Java中的接口可以包含构造方法。',
    answer: 'F',
    difficulty: '中等',
    usageCount: 16,
    createdAt: '2024-03-26T10:30:00Z'
  }
]

// 状态管理
const route = useRoute()
const courseId = route.params.id
const questions = ref(mockQuestions)
const searchQuery = ref('')
const typeFilter = ref('')
const difficultyFilter = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(10)
const viewMode = ref('card')

// 计算属性
const totalQuestions = computed(() => questions.value.length)

const questionStats = computed(() => [
  {
    title: '选择题',
    value: questions.value.filter(q => q.type === 'choice').length,
    icon: 'List',
    iconClass: 'text-primary',
    trend: 15
  },
  {
    title: '填空题',
    value: questions.value.filter(q => q.type === 'fill').length,
    icon: 'Edit',
    iconClass: 'text-success',
    trend: -8
  },
  {
    title: '判断题',
    value: questions.value.filter(q => q.type === 'judge').length,
    icon: 'Check',
    iconClass: 'text-warning',
    trend: 12
  }
])

// 过滤和排序
const filteredQuestions = computed(() => {
  let result = [...questions.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(q =>
      q.content.toLowerCase().includes(query)
    )
  }

  // 类型过滤
  if (typeFilter.value) {
    result = result.filter(q => q.type === typeFilter.value)
  }

  // 难度过滤
  if (difficultyFilter.value) {
    result = result.filter(q => q.difficulty === difficultyFilter.value)
  }

  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'usage':
        return b.usageCount - a.usageCount
      case 'difficulty':
        return getDifficultyValue(b.difficulty) - getDifficultyValue(a.difficulty)
      default: // 'latest'
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return result
})

// 工具函数
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const getQuestionTypeTag = (type: string) => {
  const types: Record<string, string> = {
    choice: 'primary',
    fill: 'success',
    judge: 'warning'
  }
  return types[type] || 'info'
}

const getQuestionTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    choice: '选择题',
    fill: '填空题',
    judge: '判断题'
  }
  return labels[type] || type
}

const getDifficultyTag = (difficulty: string) => {
  const tags: Record<string, string> = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return tags[difficulty] || 'info'
}

const getDifficultyValue = (difficulty: string) => {
  const values: Record<string, number> = {
    '简单': 1,
    '中等': 2,
    '困难': 3
  }
  return values[difficulty] || 0
}

// 事件处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const editQuestion = (question: any) => {
  // 实现编辑逻辑
}

const deleteQuestion = (question: any) => {
  ElMessageBox.confirm(
    '确定要删除这道题目吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.questions-page {
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

.header-left h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
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

.stat-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.trend-up {
  color: var(--el-color-success);
}

.trend-down {
  color: var(--el-color-danger);
}

.filter-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.toolbar-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 300px;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.question-card {
  transition: box-shadow 0.3s ease;
}

.question-card:hover {
  box-shadow: var(--el-box-shadow-light);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.question-type {
  display: flex;
  gap: 0.5rem;
}

.question-content {
  margin-bottom: 1rem;
}

.question-content h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
}

.question-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.question-info {
  display: flex;
  gap: 1rem;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .questions-page {
    padding: 1rem;
  }

  .filter-toolbar {
    flex-direction: column;
  }

  .search-box,
  .filters {
    width: 100%;
  }

  .filters .el-select {
    width: 100%;
  }
}
</style>
