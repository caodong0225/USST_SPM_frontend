<template>
  <div class="papers-container">
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <template #header>
              <div class="stat-header">
                <el-icon><Document /></el-icon>
                <span>总测验数</span>
              </div>
            </template>
            <div class="stat-content">
              <span class="stat-number">{{ papers.length }}</span>
              <span class="stat-label">个测验</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card active">
            <template #header>
              <div class="stat-header">
                <el-icon><Timer /></el-icon>
                <span>进行中</span>
              </div>
            </template>
            <div class="stat-content">
              <span class="stat-number">{{ getStatusCount('active') }}</span>
              <span class="stat-label">个测验</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card upcoming">
            <template #header>
              <div class="stat-header">
                <el-icon><Calendar /></el-icon>
                <span>即将开始</span>
              </div>
            </template>
            <div class="stat-content">
              <span class="stat-number">{{ getStatusCount('upcoming') }}</span>
              <span class="stat-label">个测验</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card ended">
            <template #header>
              <div class="stat-header">
                <el-icon><Check /></el-icon>
                <span>已结束</span>
              </div>
            </template>
            <div class="stat-content">
              <span class="stat-number">{{ getStatusCount('ended') }}</span>
              <span class="stat-label">个测验</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-card class="papers-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <el-icon>
              <Document />
            </el-icon>
            <span>课程测验</span>
          </div>
          <div class="header-actions" v-if="isAdmin">
            <el-button type="primary" @click="showAddPaper = true">
              <el-icon>
                <Plus />
              </el-icon>新建测验
            </el-button>
            <el-button type="info">
              <el-icon>
                <Upload />
              </el-icon>导入试题
            </el-button>
          </div>
        </div>
      </template>

      <!-- 测验列表 -->
      <div class="papers-list" v-loading="loading">
        <el-empty v-if="!papers.length" description="暂无测验">
          <template #extra>
            <el-button type="primary" @click="showAddPaper = true" v-if="isAdmin">
              创建第一个测验
            </el-button>
        </template>
        </el-empty>

        <div v-else class="paper-items">
          <div v-for="paper in papers" :key="paper.id" class="paper-item">
            <div class="paper-status" :class="paper.status">
              {{ getStatusText(paper.status) }}
            </div>
            <div class="paper-content">
              <h3 class="paper-title">{{ paper.paperName }}</h3>
              <p class="paper-desc">{{ paper.paperDescription || '暂无描述' }}</p>
              <div class="paper-meta">
                <div class="meta-item">
                  <el-icon>
                    <Clock />
                  </el-icon>
                  <span>开始: {{ formatDateTime(paper.paperStartTime) }}</span>
                </div>
                <div class="meta-item">
                  <el-icon>
                    <Timer />
                  </el-icon>
                  <span>结束: {{ formatDateTime(paper.paperEndTime) }}</span>
                </div>
                <div class="meta-item">
                  <el-icon>
                    <Stopwatch />
                  </el-icon>
                  <span>时长: {{ paper.duration }}分钟</span>
                </div>
                <div class="meta-item">
                  <el-icon>
                    <Collection />
                  </el-icon>
                  <span>{{ paper.questionsNum }}道题目</span>
                </div>
                <div class="meta-item">
                  <el-icon>
                    <Trophy />
                  </el-icon>
                  <span>总分: {{ paper.totalScore }}分</span>
                </div>
              </div>

              <div class="exam-settings">
                <div class="settings-item" v-if="paper.examMode === 'realtime'">
                  <el-tag size="small" type="success">实时考试</el-tag>
                </div>
                <div class="settings-item" v-else>
                  <el-tag size="small" type="warning">限时考试</el-tag>
                </div>
                <div class="settings-item" v-if="paper.examOptions.includes('randomOrder')">
                  <el-tag size="small" type="info">随机顺序</el-tag>
                </div>
                <div class="settings-item" v-if="paper.examOptions.includes('showResult')">
                  <el-tag size="small" type="info">即时成绩</el-tag>
                </div>
              </div>

              <div class="paper-stats" v-if="paper.status === 'ended'">
                <div class="stats-item">
                  <span class="label">提交人数</span>
                  <span class="value">{{ paper.submitCount }}</span>
                </div>
                <div class="stats-item">
                  <span class="label">平均分</span>
                  <span class="value">{{ paper.averageScore.toFixed(1) }}</span>
                </div>
                <div class="stats-item">
                  <span class="label">及格线</span>
                  <span class="value">{{ paper.passScore }}</span>
                </div>
              </div>
            </div>
            <div class="paper-actions">
              <el-button type="primary" @click="handleEntry(paper)">
                {{ getPaperActionText(paper.status) }}
              </el-button>
              <el-button type="info" @click="handleEdit(paper)" v-if="isAdmin">
                <el-icon><Edit /></el-icon>编辑试题
              </el-button>
              <el-button type="warning" @click="handleStats(paper)" v-if="isAdmin">
                <el-icon><DataLine /></el-icon>统计分析
              </el-button>
              <el-button type="danger" @click="handleDelete(paper)" v-if="isAdmin">
                <el-icon><Delete /></el-icon>删除测验
              </el-button>
            </div>
          </div>
        </div>

        <!-- 分页控件 -->
        <div class="pagination-wrapper">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="papers.length"
            :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>
  </el-card>

    <!-- 添加测验抽屉 -->
    <el-drawer v-model="showAddPaper" title="新建测验" size="500px" :close-on-click-modal="false">
      <CreatePaper :course-id="courseId" @success="onPaperCreated" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useUserInfoStore } from '@/store'
import { deletePaper, getPapers } from '@/api/paper'
import CreatePaper from './addPaper.vue'

// 将 mockPapers 移动到 props 定义之前
const mockPapers = [
  {
    id: 1,
    paperName: '软件工程期中考试',
    paperDescription: '涵盖软件需求分析、系统设计等内容',
    paperStartTime: '2024-04-15 14:00:00',
    paperEndTime: '2024-04-15 15:30:00',
    status: 'upcoming',
    questionsNum: 30,
    submitCount: 0
  },
  {
    id: 2,
    paperName: '第一次单元测验',
    paperDescription: '软件过程模型相关内容测试',
    paperStartTime: '2024-03-20 10:00:00',
    paperEndTime: '2024-03-20 10:45:00',
    status: 'ended',
    questionsNum: 15,
    submitCount: 118
  },
  {
    id: 3,
    paperName: '需求分析作业',
    paperDescription: '完成用例图和需求规格说明书',
    paperStartTime: '2024-03-25 00:00:00',
    paperEndTime: '2024-03-31 23:59:59',
    status: 'active',
    questionsNum: 5,
    submitCount: 89
  }
]

// Props 定义
const props = withDefaults(defineProps<{
  courseId: number | string
  tableData?: any[]
}>(), {
  tableData: () => [] // 不要在这里引用 mockPapers
})

const router = useRouter()
const userStore = useUserInfoStore()
const isAdmin = computed(() => userStore.userInfo.role > 0)

// 状态管理
const loading = ref(false)
const showAddPaper = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// 使用计算属性来合并默认数据和传入的数据
const papers = ref([])

// 获取试卷列表
const fetchPapers = async () => {
  loading.value = true
  try {
    console.log('组件内获取试卷列表，courseId:', props.courseId)
    const res = await getPapers(props.courseId)
    console.log('获取试卷列表响应:', res)
    if (res.code === 200) {
      papers.value = res.data.map((item: any) => ({
        id: item.papers.id,
        paperName: item.papers.paperName,
        paperDescription: item.papers.paperDesc,
        paperStartTime: item.papers.paperStartTime,
        paperEndTime: item.papers.paperEndTime,
        status: item.papers.status,
        visible: item.papers.visible,
        courseId: item.papers.courseId,
        questionsNum: item.questionsNum,
        examMode: 'realtime',
        duration: 90,
        totalScore: 100,
        passScore: 60,
        examOptions: ['showResult'],
        examNotes: '请认真作答，注意时间',
        submitCount: 0,
        averageScore: 0
      }))
    }
  } catch (error) {
    console.error('获取试卷列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('组件挂载，准备获取试卷列表')
  fetchPapers()
})

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    upcoming: '未开始',
    active: '进行中',
    ended: '已结束'
  }
  return statusMap[status] || status
}

// 获取操作按钮文本
const getPaperActionText = (status: string) => {
  const actionMap: Record<string, string> = {
    upcoming: '预览试卷',
    active: '开始答题',
    ended: '查看结果'
  }
  return actionMap[status] || '查看详情'
}

// 格式化日期时间
const formatDateTime = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 试卷操作
const handleEntry = (paper: any) => {
  switch (paper.status) {
    case 'upcoming':
      ElMessage.info('考试尚未开始')
      break
    case 'active':
      // 跳转到答题页面
      break
    case 'ended':
      // 跳到结果页面
      break
  }
}

const handleEdit = (paper: any) => {
  router.push(`/questions/list/${props.courseId}?paperId=${paper.id}`)
}

const handleStats = (paper: any) => {
  router.push(`/papers/${paper.id}/stats`)
}

const handleDelete = async (paper: any) => {
  try {
    await ElMessageBox.confirm(
      '删除测验将同时删除所有相关的答卷记录，是否继续？',
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true
    const res = await deletePaper(paper.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      // 立即刷新列表
      await fetchPapers()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
          ElMessage.error('删除失败')
        }
  } finally {
    loading.value = false
  }
}

// 创建成功回调
const onPaperCreated = () => {
  showAddPaper.value = false
  // 重新加载列表
}

// 获取状态数量统计
const getStatusCount = (status: string) => {
  return papers.value.filter(paper => paper.status === status).length
}
</script>

<style scoped>
.papers-container {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.papers-list {
  min-height: 400px;
}

.paper-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.paper-item {
  position: relative;
  display: flex;
  padding: 1.5rem;
  background: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
  transition: all 0.3s ease;
}

.paper-item:hover {
  background: var(--el-fill-color);
  transform: translateY(-2px);
}

.paper-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.paper-status.upcoming {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.paper-status.active {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.paper-status.ended {
  background: var(--el-color-info-light-9);
  color: var(--el-color-info);
}

.paper-content {
  flex: 1;
  margin-right: 2rem;
}

.paper-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 500;
}

.paper-desc {
  margin: 0 0 1rem;
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
}

.paper-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--el-text-color-regular);
  font-size: 0.875rem;
}

.paper-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.paper-actions .el-button {
  width: 100%;
  justify-content: center;
  margin-left: 0;
}

.paper-actions .el-button .el-icon {
  margin-right: 4px;
}

.pagination-wrapper {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .paper-item {
    flex-direction: column;
    gap: 1rem;
  }

  .paper-content {
    margin-right: 0;
  }

  .paper-actions {
    flex-direction: row;
    flex-wrap: wrap;
    min-width: auto;
  }

  .paper-actions .el-button {
    flex: 1;
    min-width: 120px;
  }

  .paper-meta {
    gap: 1rem;
  }
}

.exam-settings {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.paper-stats {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-item .label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.stats-item .value {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

/* 统计卡片样式优化 */
.stats-cards {
  margin-bottom: 24px;
}

.stat-card {
  transition: all 0.3s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--el-box-shadow-light);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-regular);
}

.stat-content {
  text-align: center;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 600;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
}

/* 试卷卡片样式优化 */
.paper-item {
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: var(--el-box-shadow-lighter);
  background: var(--el-bg-color);
}

.paper-item:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: var(--el-box-shadow-light);
}

/* 状态标签样式优化 */
.paper-status {
  font-weight: 500;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
}

/* 试卷内容布局优化 */
.paper-content {
  padding: 0 20px;
}

.paper-title {
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  font-size: 18px;
}

.paper-desc {
  line-height: 1.6;
}

/* 元信息样式优化 */
.paper-meta {
  background: var(--el-fill-color-light);
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
}

.meta-item {
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.meta-item:hover {
  background: var(--el-fill-color);
}

/* 考试设置标签优化 */
.exam-settings {
  margin: 16px 0;
  padding: 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.settings-item {
  margin-right: 8px;
}

/* 统计信息样式优化 */
.paper-stats {
  background: var(--el-fill-color-lighter);
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
}

.stats-item {
  padding: 8px 16px;
  background: var(--el-bg-color);
  border-radius: 6px;
  min-width: 100px;
}

.stats-item .value {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-color-primary);
}

/* 操作按钮样式优化 */
.paper-actions {
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  align-self: stretch;
}

/* 分页控件样式优化 */
.pagination-wrapper {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .stats-cards .el-col {
    margin-bottom: 16px;
  }

  .paper-item {
    padding: 16px;
  }

  .paper-content {
    padding: 0;
  }

  .paper-meta {
    flex-wrap: wrap;
    gap: 8px;
  }

  .meta-item {
    flex: 1;
    min-width: 140px;
    justify-content: center;
  }

  .paper-stats {
    flex-wrap: wrap;
    gap: 12px;
  }

  .stats-item {
    flex: 1;
    min-width: 120px;
    text-align: center;
  }
}

/* 深色模式适配 */
:root[data-theme='dark'] {
  .stat-number {
    background: linear-gradient(45deg, var(--el-color-primary-light-3), var(--el-color-primary-light-5));
    -webkit-background-clip: text;
  }

  .paper-item {
    background: var(--el-bg-color-overlay);
  }
}
</style>
