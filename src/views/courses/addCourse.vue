<template>
  <PageLayout title="添加课程">
    <div class="add-course-container">
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <el-icon>
              <Plus />
            </el-icon>
            <span>课程信息</span>
          </div>
        </template>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="course-form" @submit.prevent>
          <!-- 基本信息 -->
          <div class="form-section">
            <h3 class="section-title">基本信息</h3>
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="form.courseName" placeholder="请输入课程名称" />
            </el-form-item>

            <el-form-item label="课程编号" prop="courseCode">
              <el-input v-model="form.courseCode" placeholder="请输入课程编号">
                <template #prefix>CS</template>
              </el-input>
            </el-form-item>

            <el-form-item label="课程类型" prop="courseType">
              <el-select v-model="form.courseType" placeholder="请选择课程类型" class="full-width">
                <el-option v-for="type in courseTypes" :key="type.value" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="课程学分" prop="credits">
              <el-input-number v-model="form.credits" :min="0.5" :max="10" :step="0.5" class="full-width" />
            </el-form-item>
          </div>

          <!-- 时间安排 -->
          <div class="form-section">
            <h3 class="section-title">时间安排</h3>
            <el-form-item label="开课时间" required>
              <el-col :span="11">
                <el-form-item prop="startTime">
                  <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" class="full-width" />
                </el-form-item>
              </el-col>
              <el-col :span="2" class="text-center">至</el-col>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" class="full-width" />
                </el-form-item>
              </el-col>
            </el-form-item>

            <el-form-item label="每周课时" prop="weeklyHours">
              <el-input-number v-model="form.weeklyHours" :min="1" :max="20" :step="1" class="full-width" />
            </el-form-item>
          </div>

          <!-- 课程描述 -->
          <div class="form-section">
            <h3 class="section-title">课程描述</h3>
            <el-form-item label="课程简介" prop="courseDesc">
              <el-input v-model="form.courseDesc" type="textarea" :rows="4" placeholder="请输入课程简介" />
            </el-form-item>

            <el-form-item label="课程封面">
              <el-upload class="cover-uploader" action="/api/upload" :show-file-list="false"
                :before-upload="beforeUpload" :on-success="handleUploadSuccess">
                <img v-if="form.coursePic" :src="form.coursePic" class="cover-image" />
                <el-icon v-else class="cover-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
              <div class="upload-tip">建议尺寸: 800x400px, 文件大小不超过2MB</div>
            </el-form-item>
          </div>

          <!-- 其他设置 -->
          <div class="form-section">
            <h3 class="section-title">其他设置</h3>
            <el-form-item label="课程标签">
              <el-select v-model="form.tags" multiple filterable allow-create default-first-option
                placeholder="请选择或输入标签" class="full-width">
                <el-option v-for="tag in defaultTags" :key="tag" :label="tag" :value="tag" />
              </el-select>
            </el-form-item>

            <el-form-item label="人数限制" prop="maxStudents">
              <el-input-number v-model="form.maxStudents" :min="1" :max="500" class="full-width" />
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="form.needApproval">开启选课审核</el-checkbox>
            </el-form-item>
          </div>

          <!-- 表单操作 -->
          <div class="form-actions">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submitForm" :loading="submitting">
              创建课程
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, FormInstance } from 'element-plus'
import { createCourse } from '@/api/course'

const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 课程类型选项
const courseTypes = [
  { label: '必修课', value: 'required' },
  { label: '选修课', value: 'elective' },
  { label: '实验课', value: 'lab' },
  { label: '讨论课', value: 'seminar' }
]

// 默认标签
const defaultTags = ['计算机科学', '软件工程', '人工智能', '数据科学', '网络安全']

// 表单数据
const form = ref({
  courseName: '',
  courseCode: '',
  courseType: '',
  credits: 3,
  startTime: '',
  endTime: '',
  weeklyHours: 4,
  courseDesc: '',
  coursePic: '',
  tags: [],
  maxStudents: 100,
  needApproval: false
})

// 表单验证规则
const rules = {
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  courseCode: [
    { required: true, message: '请输入课程编号', trigger: 'blur' },
    { pattern: /^\d{3,6}$/, message: '请输入3-6位数字', trigger: 'blur' }
  ],
  courseType: [
    { required: true, message: '请选择课程类型', trigger: 'change' }
  ],
  credits: [
    { required: true, message: '请输入学分', trigger: 'change' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ],
  courseDesc: [
    { required: true, message: '请输入课程简介', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ]
}

// 上传相关
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleUploadSuccess = (res: any) => {
  form.value.coursePic = res.data.url
  ElMessage.success('封面上传成功')
}

// 表单提交
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const res = await createCourse(form.value)
        if (res.code === 200) {
          ElMessage.success('课程创建成功')
          router.push('/courses')
        }
      } catch (error) {
        ElMessage.error('课程创建失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 取消创建
const cancel = () => {
  router.back()
}
</script>

<style scoped>
.add-course-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.form-card {
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 500;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--el-border-color-light);
}

.section-title {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.full-width {
  width: 100%;
}

.text-center {
  text-align: center;
  line-height: 32px;
}

.cover-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration);
}

.cover-uploader:hover {
  border-color: var(--el-color-primary);
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 400px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}

.cover-image {
  width: 400px;
  height: 200px;
  object-fit: cover;
}

.upload-tip {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .add-course-container {
    padding: 1rem;
  }

  .cover-uploader-icon,
  .cover-image {
    width: 100%;
    height: 150px;
  }

  .cover-uploader-icon {
    line-height: 150px;
  }
}
</style>