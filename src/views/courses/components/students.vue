<template>
  <div class="students-container">
    <el-card class="students-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <el-icon>
              <User />
            </el-icon>
            <span>班级成员 ({{ totalStudents }}人)</span>
          </div>
          <div class="header-actions" v-if="isAdmin">
            <el-button type="primary" @click="showImportDialog = true">
              <el-icon>
                <Upload />
              </el-icon>导入学生
            </el-button>
            <el-button type="success" @click="exportStudentList">
              <el-icon>
                <Download />
              </el-icon>导出名单
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索和筛选 -->
      <div class="tools-bar">
        <el-input v-model="searchQuery" placeholder="搜索学生姓名或学号..." clearable @input="handleSearch">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="学习状态" @change="handleFilter">
          <el-option label="全部状态" value="" />
          <el-option label="活跃" value="active" />
          <el-option label="一般" value="normal" />
          <el-option label="警告" value="warning" />
        </el-select>
      </div>

      <!-- 学生列表 -->
      <div class="students-list" v-loading="loading">
        <el-table :data="displayedStudents" style="width: 100%" :border="true">
          <el-table-column type="index" width="60" align="center" />
          <el-table-column prop="studentId" label="学号" width="120" />
          <el-table-column label="学生信息" min-width="200">
            <template #default="{ row }">
              <div class="student-info">
                <el-avatar :size="32" :src="row.avatar">
                  {{ row.name?.charAt(0) }}
                </el-avatar>
                <div class="info-detail">
                  <span class="student-name">{{ row.name }}</span>
                  <span class="student-email">{{ row.email }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="学习状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="作业完成" width="200">
            <template #default="{ row }">
              <div class="progress-wrapper">
                <el-progress :percentage="row.homeworkCompletion" :color="getProgressColor(row.homeworkCompletion)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="最近活动" width="180">
            <template #default="{ row }">
              <span class="last-active">{{ formatDate(row.lastActive) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center" v-if="isAdmin">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" link @click="viewStudentDetail(row)">
                  <el-icon>
                    <View />
                  </el-icon>
                </el-button>
                <el-button type="warning" link @click="editStudent(row)">
                  <el-icon>
                    <Edit />
                  </el-icon>
                </el-button>
                <el-button type="danger" link @click="removeStudent(row)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页控件 -->
        <div class="pagination-wrapper">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalStudents"
            :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </el-card>

    <!-- 导入学生对话框 -->
    <el-dialog v-model="showImportDialog" title="导入学生" width="500px">
      <el-upload class="upload-demo" drag action="/api/students/import" :headers="{ 'Authorization': token }"
        :on-success="handleImportSuccess" :on-error="handleImportError" accept=".xlsx,.xls">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请上传 Excel 文件，文件大小不超过 2MB
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showImportDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmImport">
            确认导入
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useUserInfoStore } from '@/store'

// 示例数据
const mockStudents = [
  {
    id: 1,
    studentId: '2021001',
    name: '张三',
    email: 'zhangsan@student.edu.cn',
    avatar: '',
    status: 'active',
    homeworkCompletion: 95,
    lastActive: '2024-03-27 15:30:00'
  },
  {
    id: 2,
    studentId: '2021002',
    name: '李四',
    email: 'lisi@student.edu.cn',
    avatar: '',
    status: 'normal',
    homeworkCompletion: 78,
    lastActive: '2024-03-26 10:20:00'
  },
  {
    id: 3,
    studentId: '2021003',
    name: '王五',
    email: 'wangwu@student.edu.cn',
    avatar: '',
    status: 'warning',
    homeworkCompletion: 45,
    lastActive: '2024-03-20 09:15:00'
  }
]

const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true
  }
})

// 状态管理
const userStore = useUserInfoStore()
const isAdmin = computed(() => userStore.userInfo.role > 0)
const loading = ref(false)
const showImportDialog = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const token = userStore.token

// 计算总学生数
const totalStudents = computed(() => mockStudents.length)

// 分页数据
const displayedStudents = computed(() => {
  const filtered = mockStudents.filter(student => {
    const matchSearch = student.name.includes(searchQuery.value) ||
      student.studentId.includes(searchQuery.value)
    const matchStatus = !filterStatus.value || student.status === filterStatus.value
    return matchSearch && matchStatus
  })

  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 获取状态类型
const getStatusType = (status: string) => ({
  active: 'success',
  normal: '',
  warning: 'danger'
})[status] || 'info'

// 获取状态文本
const getStatusText = (status: string) => ({
  active: '活跃',
  normal: '一般',
  warning: '警告'
})[status] || '未知'

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 60) return '#409EFF'
  return '#E6A23C'
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 处理筛选
const handleFilter = () => {
  currentPage.value = 1
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 导入相关
const handleImportSuccess = (response: any) => {
  if (response.code === 200) {
    ElMessage.success('导入成功')
    showImportDialog.value = false
    // 重新加载学生列表
  } else {
    ElMessage.error(response.message || '导入失败')
  }
}

const handleImportError = () => {
  ElMessage.error('文件上传失败')
}

const confirmImport = () => {
  showImportDialog.value = false
  ElMessage.success('导入成功')
}

// 学生操作
const viewStudentDetail = (student: any) => {
  // 实现查看学生详情
}

const editStudent = (student: any) => {
  // 实现编辑学生信息
}

const removeStudent = async (student: any) => {
  try {
    await ElMessageBox.confirm(
      '确定要将该学生移出课程吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // 实现移除学生
    ElMessage.success('已将学生移出课程')
  } catch {
    // 用户取消操作
  }
}

// 导出学生名单
const exportStudentList = () => {
  // 实现导出功能
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.students-container {
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

.tools-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tools-bar .el-input {
  width: 300px;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info-detail {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: 500;
}

.student-email {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
}

.progress-wrapper {
  padding: 0 1rem;
}

.last-active {
  font-size: 0.875rem;
  color: var(--el-text-color-regular);
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

  .tools-bar {
    flex-direction: column;
  }

  .tools-bar .el-input {
    width: 100%;
  }
}
</style>
