<template>
  <div class="papers-container">
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
        <el-empty v-if="!tableData.length" description="暂无测验">
          <template #extra>
            <el-button type="primary" @click="showAddPaper = true" v-if="isAdmin">
              创建第一个测验
            </el-button>
          </template>
        </el-empty>

        <div v-else class="paper-items">
          <div v-for="paper in displayedPapers" :key="paper.id" class="paper-item">
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
                    <Collection />
                  </el-icon>
                  <span>{{ paper.questionsNum }}道题目</span>
                </div>
                <div class="meta-item">
                  <el-icon>
                    <User />
                  </el-icon>
                  <span>{{ paper.submitCount || 0 }}人已提交</span>
                </div>
              </div>
            </div>
            <div class="paper-actions">
              <el-button type="primary" @click="handleEntry(paper)">
                {{ getPaperActionText(paper.status) }}
              </el-button>
              <el-dropdown v-if="isAdmin" trigger="click">
                <el-button>
                  <el-icon>
                    <More />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEdit(paper)">
                      <el-icon>
                        <Edit />
                      </el-icon>编辑试题
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleStats(paper)">
                      <el-icon>
                        <DataLine />
                      </el-icon>统计分析
                    </el-dropdown-item>
                    <el-dropdown-item divided danger @click="handleDelete(paper)">
                      <el-icon>
                        <Delete />
                      </el-icon>删除测验
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>

        <!-- 分页控件 -->
        <div class="pagination-wrapper">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="tableData.length"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useUserInfoStore } from '@/store'
import { deletePaper } from '@/api/paper'
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
const displayedPapers = computed(() => {
  return props.tableData.length > 0 ? props.tableData : mockPapers
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
      // 跳转到结果页面
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
      // 重新加载列表
    }
  } catch (error) {
    console.error('删除失败:', error)
  } finally {
    loading.value = false
  }
}

// 创建成功回调
const onPaperCreated = () => {
  showAddPaper.value = false
  // 重新加载列表
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
  gap: 0.5rem;
  justify-content: center;
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
    justify-content: flex-end;
  }

  .paper-meta {
    gap: 1rem;
  }
}
</style>
