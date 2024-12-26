<!-- 添加考试 -->
<template>
  <div class="add-paper">
    <div class="form-header">
      <h3>创建测验</h3>
      <p class="subtitle">创建一个新的课程测验</p>
    </div>

    <el-form 
      ref="formRef"
      :model="form" 
      :rules="rules"
      label-position="top"
      class="paper-form"
    >
      <!-- 试卷名称 -->
      <el-form-item 
        label="试卷名称" 
        prop="paperName"
      >
        <el-input 
          v-model="form.paperName"
          placeholder="请输入试卷名称"
          maxlength="50"
          show-word-limit
        >
          <template #prefix>
            <el-icon><Document /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 试卷介绍 -->
      <el-form-item 
        label="试卷介绍" 
        prop="paperDescription"
      >
        <el-input 
          v-model="form.paperDescription"
          type="textarea"
          :rows="4"
          placeholder="请输入试卷介绍，帮助学生更好地了解本次测验"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 考试时间设置 -->
      <div class="time-settings">
        <el-form-item 
          label="开始时间" 
          prop="startTime"
          class="time-item"
        >
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disablePastDates"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item 
          label="结束时间" 
          prop="endTime"
          class="time-item"
        >
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disablePastDates"
            style="width: 100%"
          />
        </el-form-item>
      </div>

      <!-- 考试设置 -->
      <div class="exam-settings">
        <h4 class="settings-title">
          <el-icon><Setting /></el-icon>
          考试设置
        </h4>
        <div class="settings-content">
          <el-form-item label="考试时长（分钟）">
            <el-input-number 
              v-model="form.duration" 
              :min="1"
              :max="360"
              controls-position="right"
            />
          </el-form-item>

          <el-form-item label="总分">
            <el-input-number 
              v-model="form.totalScore" 
              :min="0"
              :max="100"
              controls-position="right"
            />
          </el-form-item>

          <el-form-item label="考试模式">
            <el-radio-group v-model="form.examMode">
              <el-radio label="standard">标准模式</el-radio>
              <el-radio label="open">开放模式</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>

      <!-- 添加更多前端展示字段 -->
      <div class="advanced-settings">
        <el-collapse>
          <el-collapse-item title="高级设置" name="1">
            <div class="settings-grid">
              <!-- 考试模式设置 -->
              <el-form-item label="考试模式">
                <el-select v-model="displayForm.examMode" placeholder="选择考试模式">
                  <el-option label="实时考试" value="realtime">
                    <div class="option-label">
                      <el-icon><Timer /></el-icon>
                      <div class="option-content">
                        <span>实时考试</span>
                        <small>学生需在指定时间内完成</small>
                      </div>
                    </div>
                  </el-option>
                  <el-option label="限时考试" value="timelimit">
                    <div class="option-label">
                      <el-icon><AlarmClock /></el-icon>
                      <div class="option-content">
                        <span>限时考试</span>
                        <small>开始后计时，需在限定时间内完成</small>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>

              <!-- 考试时长设置 -->
              <el-form-item label="考试时长">
                <el-input-number 
                  v-model="displayForm.duration"
                  :min="30"
                  :max="180"
                  :step="30"
                >
                  <template #suffix>分钟</template>
                </el-input-number>
              </el-form-item>

              <!-- 试卷总分 -->
              <el-form-item label="试卷总分">
                <el-input-number
                  v-model="displayForm.totalScore"
                  :min="0"
                  :max="100"
                  :step="5"
                >
                  <template #suffix>分</template>
                </el-input-number>
              </el-form-item>

              <!-- 及格分数 -->
              <el-form-item label="及格分数">
                <el-input-number
                  v-model="displayForm.passScore"
                  :min="0"
                  :max="displayForm.totalScore"
                  :step="5"
                >
                  <template #suffix>分</template>
                </el-input-number>
              </el-form-item>

              <!-- 考试设置 -->
              <el-form-item label="考试选项">
                <el-checkbox-group v-model="displayForm.examOptions">
                  <el-checkbox label="randomOrder">随机顺序</el-checkbox>
                  <el-checkbox label="showResult">立即显示成绩</el-checkbox>
                  <el-checkbox label="allowRetake">允许重考</el-checkbox>
                  <el-checkbox label="showAnswer">考后显示答案</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <!-- 考试说明 -->
              <el-form-item label="考试说明">
                <el-input
                  type="textarea"
                  v-model="displayForm.examNotes"
                  :rows="3"
                  placeholder="输入考试注意事项、要求等"
                />
              </el-form-item>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 表单操作 -->
      <div class="form-actions">
        <el-button @click="cancel">取消</el-button>
        <el-button 
          type="primary" 
          @click="onSubmit"
          :loading="submitting"
        >
          创建试卷
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Setting, Timer, AlarmClock } from '@element-plus/icons-vue'
import { createPaper } from '@/api/paper'

const props = defineProps<{
  courseId: string
}>()

const emit = defineEmits(['success', 'cancel', 'refresh'])

// 表单数据
const formRef = ref()
const submitting = ref(false)

const form = reactive({
  paperName: '',
  paperDescription: '',
  startTime: '',
  endTime: '',
  duration: 120,
  totalScore: 100,
  examMode: 'standard',
  courseId: parseInt(props.courseId) || 0
})

// 添加前端展示用的表单数据
const displayForm = reactive({
  examMode: 'realtime',
  duration: 90,
  totalScore: 100,
  passScore: 60,
  examOptions: ['showResult'],
  examNotes: '',
})

// 表单验证规则
const rules = {
  paperName: [
    { required: true, message: '请输入试卷名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  paperDescription: [
    { required: true, message: '请输入试卷介绍', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ]
}

// 禁用过去的日期
const disablePastDates = (date: Date) => {
  return date.getTime() < Date.now() - 8.64e7 // 禁用今天之前的日期
}

// 提交表单
const onSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 验证时间
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      ElMessage.error('结束时间必须晚于开始时间')
      return
    }

    // 验证 courseId
    if (!form.courseId) {
      ElMessage.error('课程ID无效')
      return
    }

    submitting.value = true
    const submitData = {
      paperName: form.paperName.trim(),
      paperDescription: form.paperDescription.trim(),
      startTime: form.startTime,
      endTime: form.endTime,
      courseId: form.courseId
    }
    
    const res = await createPaper(submitData)
    if (res.code === 200) {
      ElMessage.success('创建成功')
      emit('success')
      emit('refresh')
    } else {
      ElMessage.error(res.message || '创建失败')
    }
  } catch (error) {
    console.error('创建失败:', error)
    ElMessage.error('创建失败，请检查表单填写是否正确')
  } finally {
    submitting.value = false
  }
}

// 取消创建
const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.add-paper {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h3 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
}

.subtitle {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin: 0;
}

.paper-form {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.time-settings {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.exam-settings {
  margin-top: 24px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}

.settings-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.settings-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.advanced-settings {
  margin-top: 24px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 16px;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.option-content small {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

:deep(.el-checkbox-group) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .time-settings {
    grid-template-columns: 1fr;
  }

  .settings-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>

