<template>
  <div class="course-form-container">
    <el-card class="course-form">
      <!-- 表单标题 -->
      <div class="form-header">
        <div class="header-main">
          <h2 class="form-title">创建新课程</h2>
          <p class="form-subtitle">填写课程信息，开启教学之旅</p>
        </div>
        <el-steps :active="activeStep" finish-status="success" simple>
          <el-step title="基本信息" />
          <el-step title="课程设置" />
          <el-step title="发布确认" />
        </el-steps>
      </div>

      <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
        <div class="form-layout">
          <!-- 第一步：基础信息和课程封面 -->
          <template v-if="activeStep === 0">
            <!-- 左侧：基础信息 -->
            <div class="form-left">
              <el-card class="section-card" shadow="hover">
                <template #header>
                  <div class="section-header">
                    <el-icon><Document /></el-icon>
                    <span>基础信息</span>
                  </div>
                </template>

                <!-- 课程名称和描述 -->
                <div class="form-section">
                  <!-- 课程名称 -->
                  <el-form-item label="课程名称" prop="courseName">
                    <el-input
                        v-model="formData.courseName"
                        placeholder="请输入课程名称"
                        maxlength="50"
                        show-word-limit
                    />
                  </el-form-item>

                  <!-- 课程描述 -->
                  <el-form-item label="课程描述" prop="courseDesc">
                    <el-input
                        v-model="formData.courseDesc"
                        type="textarea"
                        :rows="6"
                        placeholder="描述一下这门课吧"
                        maxlength="500"
                        show-word-limit
                    />
                  </el-form-item>
                </div>
              </el-card>
            </div>
            <!-- 右侧：课程封面 -->
            <div class="form-right">
              <el-card class="section-card" shadow="hover">
                <template #header>
                  <div class="section-header">
                    <el-icon><Picture /></el-icon>
                    <span>课程封面</span>
                  </div>
                </template>
                
                <!-- 添加封面上传组件 -->
                <div class="cover-section">
                  <el-upload
                    class="avatar-uploader"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="handleFileChange"
                  >
                    <div class="upload-area">
                      <img v-if="formData.coursePic" :src="formData.coursePic" class="avatar"/>
                      <div v-else class="upload-placeholder">
                        <el-icon class="upload-icon"><Plus /></el-icon>
                        <div class="upload-text">点击上传封面</div>
                        <div class="upload-tip">建议尺寸 800x600px，支持 JPG/PNG/WEBP 格式</div>
                      </div>
                    </div>
                  </el-upload>
                </div>
              </el-card>
            </div>
          </template>

          <!-- 第二步：课程设置 -->
          <template v-if="activeStep === 1">
            <div class="form-left">
              <el-card class="section-card" shadow="hover">
                <template #header>
                  <div class="section-header">
                    <el-icon><Setting /></el-icon>
                    <span>课程设置</span>
                  </div>
                </template>

                <div class="form-section">
                  <!-- 课程标签和难度 -->
                  <el-row :gutter="20">
                    <el-col :span="16">
                      <!-- 添加课程标签 -->
                      <el-form-item label="课程标签">
                        <el-select
                            v-model="formData.tags"
                            multiple
                            collapse-tags
                            collapse-tags-tooltip
                            placeholder="选择课程标签（可选）"
                            style="width: 100%"
                        >
                          <el-option label="必修课程" value="必修" />
                          <el-option label="选修课程" value="选修" />
                          <el-option label="实验课程" value="实验" />
                          <el-option label="考试课程" value="考试" />
                          <el-option label="大作业" value="大作业" />
                        </el-select>
                        <div class="form-tip">标签可以帮助学生更好地了解课程类型</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <!-- 课程难度 -->
                      <el-form-item label="课程难度">
                        <el-rate
                            v-model="formData.difficulty"
                            :max="3"
                            :texts="['入门', '进阶', '高级']"
                            show-text
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <!-- 课程时间 -->
                  <el-divider content-position="left">课程时间安排</el-divider>
                  <el-form-item label="课程时间" prop="timeRange" required>
                    <el-date-picker
                        v-model="timeRange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :shortcuts="shortcuts"
                        @change="handleTimeChange"
                        style="width: 100%"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                  </el-form-item>
                </div>
              </el-card>
            </div>
            <div class="form-right">
              <el-card class="section-card" shadow="hover">
                <template #header>
                  <div class="section-header">
                    <el-icon><Setting /></el-icon>
                    <span>高级设置</span>
                  </div>
                </template>
                
                <div class="form-section">
                  <!-- 课程类型 -->
                  <el-form-item label="课程类型">
                    <el-select v-model="formData.courseType" style="width: 100%">
                      <el-option label="线上课程" value="online">
                        <el-icon><VideoCamera /></el-icon>
                        <span>线上课程</span>
                      </el-option>
                      <el-option label="线下课程" value="offline">
                        <el-icon><School /></el-icon>
                        <span>线下课程</span>
                      </el-option>
                      <el-option label="混合课程" value="hybrid">
                        <el-icon><Connection /></el-icon>
                        <span>混合���程</span>
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <!-- 选课限制 -->
                  <el-form-item label="选课限制">
                    <el-row :gutter="12">
                      <el-col :span="12">
                        <el-input-number 
                          v-model="formData.maxStudents" 
                          :min="0" 
                          controls-position="right"
                          placeholder="最大人数"
                          style="width: 100%"
                        >
                          <template #prefix>
                            <el-icon><User /></el-icon>
                          </template>
                        </el-input-number>
                      </el-col>
                      <el-col :span="12">
                        <el-select v-model="formData.studentLevel" placeholder="年级要求">
                          <el-option label="不限" value="all" />
                          <el-option label="大一" value="freshman" />
                          <el-option label="大二" value="sophomore" />
                          <el-option label="大三" value="junior" />
                          <el-option label="大四" value="senior" />
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <!-- 课程评分设置 -->
                  <el-form-item label="课程评分">
                    <el-card shadow="never" class="score-card">
                      <template #header>
                        <div class="score-header">
                          <span>评分组成</span>
                          <el-switch v-model="formData.enableScoring" />
                        </div>
                      </template>
                      <div v-if="formData.enableScoring" class="score-items">
                        <div class="score-item" v-for="(item, index) in formData.scoreItems" :key="index">
                          <el-input v-model="item.name" placeholder="评分项" style="width: 120px" />
                          <el-input-number 
                            v-model="item.percentage" 
                            :min="0" 
                            :max="100"
                            :controls="false"
                            style="width: 80px"
                          />
                          <span class="percentage-symbol">%</span>
                          <el-button 
                            type="danger" 
                            link 
                            @click="removeScoreItem(index)"
                            :disabled="formData.scoreItems.length <= 1"
                          >
                            <el-icon><Delete /></el-icon>
                          </el-button>
                        </div>
                        <el-button 
                          type="primary" 
                          link 
                          @click="addScoreItem"
                          :disabled="getTotalPercentage() >= 100"
                        >
                          <el-icon><Plus /></el-icon>添加评分项
                        </el-button>
                      </div>
                    </el-card>
                  </el-form-item>
                </div>
              </el-card>
            </div>
          </template>

          <!-- 第三步：课程目标、资源和统计 -->
          <template v-if="activeStep === 2">
            <div class="form-left">
              <!-- 课程目标与进度卡片 -->
              <el-card class="section-card" shadow="hover">
                <template #header>
                  <div class="section-header">
                    <el-icon><Aim /></el-icon>
                    <span>课程目标与进度</span>
                  </div>
                </template>

                <div class="form-section">
                  <!-- 添加课程目标 -->
                  <el-form-item label="课程目标">
                    <el-input
                      v-model="formData.objectives"
                      type="textarea"
                      :rows="3"
                      placeholder="设置本课程的学习目标（可选）"
                    />
                    <div class="form-tip">明确的学习目标有助于学生更好地规划学习</div>
                  </el-form-item>

                  <!-- 课程进度设置 -->
                  <el-form-item label="课程进度">
                    <div class="progress-wrapper">
                      <div class="progress-header">
                        <span>课程完成度</span>
                        <span class="progress-value">{{ formData.progress }}%</span>
                      </div>
                      <el-slider
                        v-model="formData.progress"
                        :format-tooltip="(val) => `${val}%`"
                        :step="10"
                        show-stops
                      />
                      <div class="progress-tips">
                        拖动进度条设置当前课程完成度
                      </div>
                    </div>
                  </el-form-item>
                </div>
              </el-card>
            </div>
            <div class="form-right">
              <!-- 课程资源卡片 -->
              <el-card class="section-card" shadow="hover">
                <template #header>
                  <div class="section-header">
                    <el-icon><Folder /></el-icon>
                    <span>课程资源</span>
                    <el-button 
                      class="header-action"
                      type="primary" 
                      link
                      @click="showResourceDialog"
                    >
                      <el-icon><Plus /></el-icon>添加资源
                    </el-button>
                  </div>
                </template>
                <!-- ... 原有的资源列表部分 ... -->
              </el-card>
              <!-- 课程统计卡片 -->
              <el-card class="section-card" shadow="hover">
                <template #header>
                  <div class="section-header">
                    <el-icon><DataLine /></el-icon>
                    <span>课程统计</span>
                  </div>
                </template>
                <!-- ... 原有的统计信息部分 ... -->
              </el-card>
              <!-- 第三步右侧的课程视频部分 -->
              <el-card class="section-card" shadow="hover">
                <template #header>
                  <div class="section-header">
                    <el-icon><VideoCamera /></el-icon>
                    <span>课程视频</span>
                  </div>
                </template>
                
                <div class="video-upload-section">
                  <el-upload
                    class="video-uploader"
                    action="#"
                    :auto-upload="false"
                    :on-change="handleVideoChange"
                    :show-file-list="true"
                    multiple
                    :limit="5"
                  >
                    <template #trigger>
                      <el-button type="primary">
                        <el-icon><Plus /></el-icon>添加视频
                      </el-button>
                    </template>
                    <template #tip>
                      <div class="upload-tip">
                        支持MP4格式，单个文件不超过500MB
                      </div>
                    </template>
                  </el-upload>

                  <!-- 视频列表 -->
                  <div class="video-list">
                    <div v-for="(video, index) in formData.videos" :key="index" class="video-item">
                      <el-icon><VideoPlay /></el-icon>
                      <span class="video-name">{{ video.name }}</span>
                      <div class="video-actions">
                        <el-button type="danger" link @click="removeVideo(index)">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </template>
        </div>

        <!-- 底部操作栏 -->
        <div class="form-footer">
          <div class="footer-left">
            <el-button @click="prevStep" v-if="activeStep > 0">
              <el-icon><ArrowLeft /></el-icon>上一步
            </el-button>
          </div>
          <div class="footer-right">
            <el-button @click="$emit('cancel')">取消</el-button>
            <el-button 
              type="primary" 
              @click="handleStepAction"
              :loading="loading"
            >
              {{ getActionButtonText() }}
            </el-button>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>

  <!-- 资源添加对话框 -->
  <el-dialog
    v-model="resourceDialogVisible"
    title="添加课程资源"
    width="500px"
  >
    <el-form :model="newResource" label-width="80px">
      <el-form-item label="资源名称">
        <el-input v-model="newResource.name" />
      </el-form-item>
      <el-form-item label="资源类型">
        <el-select v-model="newResource.type" style="width: 100%">
          <el-option label="文档" value="document" />
          <el-option label="视频" value="video" />
          <el-option label="链接" value="link" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="resourceDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="addResource">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Document, VideoPlay, Link, Timer, User, Setting, Aim, Picture, DataLine, ArrowLeft, VideoCamera, School, Connection, Delete, Calendar, Check } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useUserInfoStore } from '@/store'
import { uploadCourseCover } from '@/api/course'

const userStore = useUserInfoStore()

// 上传请求头，包含认证信息
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${userStore.userInfo.sessionId}`
}))

// 获取图片完整 URL
const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return path  // 直接返回路径，因为后端已经返回完整 URL
}

const formRef = ref<FormInstance>()
const emit = defineEmits(['submit', 'cancel'])
const loading = ref(false)
const timeRange = ref<[string, string] | null>(null)

const formData = reactive({
  courseName: '',
  courseDesc: '',
  coursePic: '',
  startTime: '',
  endTime: '',
  tags: [] as string[],
  difficulty: 1,
  status: 'upcoming',
  teacherId: undefined as number | undefined,
  objectives: '',
  progress: 0,
  milestones: [
    { name: '课程准备', progress: 100, completed: true },
    { name: '课程设计', progress: 60, completed: false },
    { name: '资源上传', progress: 30, completed: false },
    { name: '发布课程', progress: 0, completed: false }
  ],
  resources: [] as { name: string; type: string }[],
  expectedStudents: 30,
  totalHours: 16,
  courseType: 'online',
  maxStudents: 0,
  studentLevel: 'all',
  enableScoring: false,
  scoreItems: [] as { name: string; percentage: number }[]
})

const shortcuts = [
  {
    text: '一周课程',
    value: () => {
      const start = new Date()
      const end = new Date()
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '一个月课程',
    value: () => {
      const start = new Date()
      const end = new Date()
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
]

const handleTimeChange = (val: [string, string] | null) => {
  if (val) {
    formData.startTime = val[0]
    formData.endTime = val[1]
  } else {
    formData.startTime = ''
    formData.endTime = ''
  }
}

// 修改文件选择处理函数
const handleFileChange = async (uploadFile: any) => {
  if (!uploadFile.raw) return

  // 先进行文件验证
  const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(uploadFile.raw.type)
  if (!isValidType) {
    ElMessage.error('图片必须是 JPG/PNG/WEBP 格式!')
    return
  }

  const isLt2M = uploadFile.raw.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return
  }

  // 将文件转换为 base64
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    formData.coursePic = reader.result as string
  }
}

// 状态选项
const statusOptions = [
  { label: '未开始', value: 'upcoming', tagType: 'info' },
  { label: '进行中', value: 'ongoing', tagType: 'success' },
  { label: '已结束', value: 'ended', tagType: 'warning' }
]

// 模拟教师列表
const teacherList = [
  { id: 1, name: '张老师', avatar: '/avatar1.jpg' },
  { id: 2, name: '李老师', avatar: '/avatar2.jpg' },
  { id: 3, name: '王老师', avatar: '/avatar3.jpg' }
]

// 修改验证规则，确保与表单字段对应
const rules = {
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  courseDesc: [
    { required: true, message: '请输入课程描述', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ]
}

// 修改步骤处理函数
const handleStepAction = async () => {
  if (!formRef.value) return

  try {
    if (activeStep.value === 0) {
      // 第一步：只验证基础信息
      const valid = await formRef.value.validate()
      if (valid) {
        nextStep()
      }
    } else if (activeStep.value === 1) {
      // 第二步：验证时间
      if (!timeRange.value) {
        ElMessage.warning('请选择课程时间')
        return
      }
      nextStep()
    } else {
      // 最后一步：提交前的最终验证
      const valid = await formRef.value.validate()
      if (valid) {
        if (!formData.coursePic) {
          ElMessage.warning('请上传课程封面')
          return
        }
        await handleSubmit()
      }
    }
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
  }
}

// 修改提交函数
const handleSubmit = async () => {
  loading.value = true
  try {
    // 只提交��要字段
    const submitData = {
      courseName: formData.courseName.trim(),
      courseDesc: formData.courseDesc.trim(),
      coursePic: formData.coursePic,
      startTime: formData.startTime,
      endTime: formData.endTime
    }
    
    emit('submit', submitData)
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请重试')
  } finally {
    loading.value = false
  }
}

// 资源对话框
const resourceDialogVisible = ref(false)
const newResource = reactive({
  name: '',
  type: 'document'
})

const showResourceDialog = () => {
  resourceDialogVisible.value = true
  newResource.name = ''
  newResource.type = 'document'
}

const addResource = () => {
  if (newResource.name) {
    formData.resources.push({
      name: newResource.name,
      type: newResource.type
    })
    resourceDialogVisible.value = false
  }
}

const removeResource = (index: number) => {
  formData.resources.splice(index, 1)
}

const getResourceType = (type: string) => {
  const typeMap: Record<string, string> = {
    document: '',
    video: 'success',
    link: 'info'
  }
  return typeMap[type] || ''
}

// 步骤控制
const activeStep = ref(0)

const nextStep = () => {
  if (activeStep.value < 2) {
    activeStep.value++
  }
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const getActionButtonText = () => {
  if (loading.value) return '提交中...'
  switch (activeStep.value) {
    case 0: return '下一步'
    case 1: return '下一步'
    case 2: return '创建课程'
    default: return '下一步'
  }
}

const addScoreItem = () => {
  formData.scoreItems.push({
    name: '',
    percentage: 0
  })
}

const removeScoreItem = (index: number) => {
  formData.scoreItems.splice(index, 1)
}

const getTotalPercentage = () => {
  return formData.scoreItems.reduce((total, item) => total + item.percentage, 0)
}

const getProgressStatus = (progress: number) => {
  if (progress >= 100) return 'success'
  if (progress >= 50) return 'warning'
  return ''
}

const addMilestone = () => {
  formData.milestones.push({
    name: '',
    progress: 0,
    completed: false,
    description: '',
    deadline: ''
  })
}

const removeMilestone = (index: number) => {
  formData.milestones.splice(index, 1)
}

const toggleMilestone = (index: number) => {
  const milestone = formData.milestones[index]
  milestone.completed = !milestone.completed
  milestone.progress = milestone.completed ? 100 : 0
}
</script>

<style scoped>
.course-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.course-form {
  background: #fff;
}

.form-header {
  margin-bottom: 30px;
  border-bottom: 1px solid var(--el-border-color-light);
  padding-bottom: 20px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.form-subtitle {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 8px 0 0;
}

.form-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.form-left {
  padding-right: 20px;
}

.cover-section {
  width: 100%;
}

.upload-area {
  width: 100%;
  height: 300px;
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration);
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-area:hover {
  border-color: var(--el-color-primary);
}

.upload-placeholder {
  text-align: center;
  color: var(--el-text-color-secondary);
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-tip {
  display: block;
  font-size: 12px;
  margin-top: 8px;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-light);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .form-layout {
    grid-template-columns: 1fr;
  }

  .form-left {
    padding-right: 0;
  }

  .upload-area {
    height: 200px;
  }
}

/* 添加上传相关样式 */
.avatar-uploader {
  width: 100%;
}

.avatar-uploader :deep(.el-upload) {
  width: 100%;
}

.upload-area {
  background-color: var(--el-fill-color-blank);
}

.upload-area:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.form-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.teacher-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.teacher-name {
  font-size: 14px;
}

.status-select {
  width: 100%;
}

.progress-wrapper {
  margin-bottom: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-value {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-color-primary);
}

.milestones-container {
  margin-top: 20px;
}

.milestones-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.milestones {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.milestone {
  background: var(--el-fill-color-light);
  padding: 12px;
  border-radius: 8px;
}

.milestone-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.milestone-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.milestone-tag:hover {
  transform: translateY(-2px);
}

.resources-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.resource-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.resource-icon {
  margin-right: 4px;
}

.add-resource-btn {
  border-style: dashed;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.stats-card {
  text-align: center;
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

/* 深色主题适配 */
:deep(.el-slider__runway) {
  background-color: var(--el-fill-color-light);
}

:deep(.el-progress-bar__outer) {
  background-color: var(--el-fill-color-light);
}

/* 新增和优化的样式 */
.header-main {
  margin-bottom: 24px;
}

.section-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.section-card:hover {
  transform: translateY(-2px);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.header-action {
  margin-left: auto;
}

.form-section {
  padding: 16px;
}

.footer-left {
  flex: 1;
}

.footer-right {
  display: flex;
  gap: 12px;
}

/* 深色主题适配优化 */
:deep(.el-card) {
  --el-card-bg-color: var(--el-bg-color-overlay);
}

:deep(.el-divider__text) {
  background-color: var(--el-bg-color-overlay);
}

/* 动画效果 */
.section-card {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.score-card {
  border: 1px solid var(--el-border-color-lighter);
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.percentage-symbol {
  color: var(--el-text-color-secondary);
}

.milestones-container {
  margin-top: 24px;
}

.milestones-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.milestone-card {
  margin-bottom: 8px;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.milestone-content {
  margin-top: 12px;
}

.milestone-actions {
  display: flex;
  gap: 8px;
}
</style>
