<template>
  <div class="announcement-container">
    <el-card class="announcement-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <el-icon>
              <Bell />
            </el-icon>
            <span>{{ isAdmin ? '发布公告' : '课程公告' }}</span>
          </div>
          <el-button v-if="isAdmin" type="primary" @click="showCreateForm = true">
            <el-icon>
              <Plus />
            </el-icon>新建公告
          </el-button>
        </div>
      </template>

      <!-- 创建公告表单 -->
      <el-collapse-transition>
        <div v-if="showCreateForm && isAdmin" class="create-form">
          <el-form :model="form" ref="formRef" :rules="rules">
            <el-form-item prop="title">
              <el-input v-model="form.title" placeholder="公告标题" clearable>
                <template #prefix>
                  <el-icon>
                    <Edit />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="content">
              <el-input v-model="form.content" type="textarea" :rows="4" placeholder="公告内容" resize="none" />
            </el-form-item>
            <el-form-item>
              <div class="form-actions">
                <el-button @click="cancelCreate">取消</el-button>
                <el-button type="primary" @click="submitAnnouncement" :loading="submitting">
                  发布公告
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>

      <!-- 公告列表 -->
      <div class="announcements-list">
        <el-empty v-if="!msg.length" description="暂无公告" />
        <template v-else>
          <div v-for="(announcement, index) in msg" :key="index" class="announcement-item">
            <div class="announcement-header">
              <h3 class="announcement-title">
                <el-icon>
                  <InfoFilled />
                </el-icon>
                {{ announcement.title }}
              </h3>
              <div class="announcement-meta">
                <span class="announcement-time">
                  <el-icon>
                    <Clock />
                  </el-icon>
                  {{ announcement.time }}
                </span>
                <el-dropdown v-if="isAdmin" trigger="click">
                  <el-button type="text">
                    <el-icon>
                      <More />
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="editAnnouncement(announcement)">
                        <el-icon>
                          <Edit />
                        </el-icon>编辑
                      </el-dropdown-item>
                      <el-dropdown-item @click="deleteAnnouncement(announcement)" divided danger>
                        <el-icon>
                          <Delete />
                        </el-icon>删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <p class="announcement-content">{{ announcement.content }}</p>
          </div>
        </template>
      </div>

      <!-- 分页控件 -->
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
          :total="pagination.total" :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 编辑公告对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑公告" width="500px" :close-on-click-modal="false">
      <el-form :model="editForm" ref="editFormRef" :rules="rules">
        <el-form-item prop="title">
          <el-input v-model="editForm.title" placeholder="公告标题" />
        </el-form-item>
        <el-form-item prop="content">
          <el-input v-model="editForm.content" type="textarea" :rows="4" placeholder="公告内容" resize="none" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit" :loading="submitting">
          保存修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { createAnnouncement, fetchCourseAnnouncement } from '@/api/announcement'
import { useUserInfoStore } from '@/store'

const props = defineProps({
  courseId: {
    type: [Number, String],
    required: true
  }
})

// 状态管理
const userStore = useUserInfoStore()
const isAdmin = ref(userStore.userInfo.role > 0)
const showCreateForm = ref(false)
const submitting = ref(false)
const editDialogVisible = ref(false)

// 表单相关
const formRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()
const form = ref({
  title: '',
  content: ''
})
const editForm = ref({
  id: '',
  title: '',
  content: ''
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度应在 2 到 50 个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
    { min: 5, max: 500, message: '内容长度应在 5 到 500 个字符之间', trigger: 'blur' }
  ]
}

// 分页相关
const pagination = ref({
  current: 1,
  total: 0,
  size: 10
})
const msg = ref([])

// 在 script setup 中添加示例数据
const mockAnnouncements = [
  {
    id: 1,
    title: '关于期中考试安排的通知',
    content: '各位同学：\n期中考试将于4月15日14:00-15:30在第一教学楼进行，请携带学生证和考试必需品，提前15分钟到达考场。考试内容包括前六章的全部内容。',
    time: '2024-03-25 10:00:00',
    author: '张教授'
  },
  {
    id: 2,
    title: '第三次作业提交通知',
    content: '请各位同学于本周五（3月29日）前提交UML建模作业，作业要求：\n1. 完成用例图和类图的绘制\n2. 提供详细的设计说明文档\n3. 以PDF格式提交到课程平台',
    time: '2024-03-26 15:30:00',
    author: '张教授'
  },
  {
    id: 3,
    title: '课程实践项目分组通知',
    content: '各位同学：\n课程项目分组工作现已开始，请于本周内完成以下工作：\n1. 自由组队，每组4-5人\n2. 确定项目主题\n3. 提交组队信息表\n\n请组长在本周日前将分组信息发送至教师邮箱。',
    time: '2024-03-27 09:00:00',
    author: '张教授'
  }
]

// 获取公告列表
const getAnnouncements = async () => {
  try {
    // 在实际项目中调用 API
    // const res = await fetchCourseAnnouncement(...)

    // 使用模拟数据
    msg.value = mockAnnouncements
    pagination.value.total = mockAnnouncements.length
  } catch (error) {
    ElMessage.error('获取公告列表失败')
  }
}

// 提交公告
const submitAnnouncement = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const res = await createAnnouncement(props.courseId, form.value)
        if (res.code === 200) {
          ElMessage.success('公告发布成功')
          form.value = { title: '', content: '' }
          showCreateForm.value = false
          getAnnouncements()
        }
      } catch (error) {
        ElMessage.error('公告发布失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 编辑公告
const editAnnouncement = (announcement: any) => {
  editForm.value = { ...announcement }
  editDialogVisible.value = true
}

// 提交编辑
const submitEdit = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        // 实现编辑公告的 API 调用
        ElMessage.success('公告修改成功')
        editDialogVisible.value = false
        getAnnouncements()
      } catch (error) {
        ElMessage.error('公告修改失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 删除公告
const deleteAnnouncement = async (announcement: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条公告吗？', '提示', {
      type: 'warning'
    })
    // 实现删除公告的 API 调用
    ElMessage.success('公告删除成功')
    getAnnouncements()
  } catch {
    // 用户取消删除
  }
}

// 取消创建
const cancelCreate = () => {
  form.value = { title: '', content: '' }
  showCreateForm.value = false
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.value.size = val
  pagination.value.current = 1
  getAnnouncements()
}

const handleCurrentChange = (val: number) => {
  pagination.value.current = val
  getAnnouncements()
}

onMounted(() => {
  getAnnouncements()
})
</script>

<style scoped>
.announcement-container {
  max-width: 1000px;
  margin: 0 auto;
}

.announcement-card {
  margin-bottom: 2rem;
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

.create-form {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.announcement-item {
  padding: 1rem;
  background: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
  transition: all 0.3s ease;
}

.announcement-item:hover {
  background: var(--el-fill-color);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.announcement-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.announcement-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.announcement-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
}

.announcement-content {
  margin: 0;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  white-space: pre-wrap;
}

.pagination-wrapper {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .announcement-meta {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
}
</style>
