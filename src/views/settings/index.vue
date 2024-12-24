<template>
  <div class="settings-page">
    <header class="page-header">
      <div class="header-left">
        <h1>个人设置</h1>
        <el-tag>{{ userInfo.role === 'teacher' ? '教师' : '学生' }}</el-tag>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="saveSettings">
          <el-icon>
            <Check />
          </el-icon>保存更改
        </el-button>
        <el-button @click="resetSettings">
          <el-icon>
            <RefreshRight />
          </el-icon>重置
        </el-button>
      </div>
    </header>

    <div class="settings-container">
      <!-- 个人信息概览卡片 -->
      <div class="profile-overview">
        <el-card class="profile-card">
          <div class="profile-header">
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <img :src="avatarBase64 || '/person.png'" class="profile-avatar" alt="用户头像" />
                <el-button class="upload-btn" @click="triggerFileInput">
                  <el-icon>
                    <Camera />
                  </el-icon>
                </el-button>
              </div>
              <input type="file" ref="fileInput" accept="image/*" @change="handleImageUpload" class="visually-hidden" />
            </div>
            <div class="profile-info">
              <h2>{{ userInfo.nickname || '未设置昵称' }}</h2>
              <p class="user-id">学工号：{{ userInfo.userId }}</p>
              <div class="profile-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ userInfo.courseCount || 0 }}</span>
                  <span class="stat-label">课程</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ userInfo.examCount || 0 }}</span>
                  <span class="stat-label">考试</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ userInfo.homeworkCount || 0 }}</span>
                  <span class="stat-label">作业</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 设置选项卡 -->
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="form-section">
            <h3 class="section-title">个人资料</h3>
            <el-form ref="basicForm" :model="basicInfo" :rules="basicRules" label-width="100px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="basicInfo.realName" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="basicInfo.nickname" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="学号" prop="studentId">
                <el-input v-model="basicInfo.studentId" disabled />
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="basicInfo.gender">
                  <el-radio label="male">男</el-radio>
                  <el-radio label="female">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="院系" prop="department">
                <el-input v-model="basicInfo.department" />
              </el-form-item>
              <el-form-item label="专业" prop="major">
                <el-input v-model="basicInfo.major" />
              </el-form-item>
              <el-form-item label="年级" prop="grade">
                <el-input v-model="basicInfo.grade" />
              </el-form-item>
              <el-form-item label="班级" prop="className">
                <el-input v-model="basicInfo.className" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="basicInfo.email" />
              </el-form-item>
              <el-form-item label="手机" prop="phone">
                <el-input v-model="basicInfo.phone" />
              </el-form-item>
              <el-form-item label="生日" prop="birthday">
                <el-date-picker v-model="basicInfo.birthday" type="date" placeholder="选择生日" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" />
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="basicInfo.address" />
              </el-form-item>
              <el-form-item label="QQ" prop="qq">
                <el-input v-model="basicInfo.qq" />
              </el-form-item>
              <el-form-item label="微信" prop="wechat">
                <el-input v-model="basicInfo.wechat" />
              </el-form-item>
              <el-form-item label="个人简介" prop="bio">
                <el-input v-model="basicInfo.bio" type="textarea" :rows="4" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <div class="security-section">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-card class="security-card">
                  <template #header>
                    <div class="card-header">
                      <h3>账户安全</h3>
                      <el-tag :type="securityScore >= 80 ? 'success' : 'warning'">
                        安全评分: {{ securityScore }}
                      </el-tag>
                    </div>
                  </template>
                  <div class="security-items">
                    <div class="security-item" v-for="item in securityItems" :key="item.title">
                      <div class="item-info">
                        <el-icon :class="item.status ? 'text-success' : 'text-warning'">
                          <component :is="item.status ? 'CircleCheck' : 'Warning'" />
                        </el-icon>
                        <span>{{ item.title }}</span>
                      </div>
                      <el-button :type="item.status ? 'success' : 'primary'" link>
                        {{ item.status ? '已完成' : '去设置' }}
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <!-- ... 其他安全设置 ... -->
            </el-row>
          </div>

          <div class="security-section">
            <h3>两步验证</h3>
            <div class="two-factor">
              <el-switch v-model="securitySettings.twoFactor" />
              <span>启用两步验证可以提供额外的账户安全保护</span>
            </div>
          </div>
        </el-tab-pane>

        <!-- 通知设置 -->
        <el-tab-pane label="通知设置" name="notifications">
          <div class="notification-settings">
            <el-form :model="notificationSettings" label-width="200px">
              <el-form-item label="课程公告">
                <el-switch v-model="notificationSettings.courseAnnouncements" />
                <span class="setting-desc">接收课程的重要通知</span>
              </el-form-item>
              <el-form-item label="作业提醒">
                <el-switch v-model="notificationSettings.homeworkReminders" />
                <span class="setting-desc">在作业截止前收到提醒</span>
              </el-form-item>
              <el-form-item label="考试提醒">
                <el-switch v-model="notificationSettings.examReminders" />
                <span class="setting-desc">在考试前收到提醒</span>
              </el-form-item>
              <el-form-item label="成绩通知">
                <el-switch v-model="notificationSettings.gradeNotifications" />
                <span class="setting-desc">成绩发布时收到通知</span>
              </el-form-item>
              <el-form-item label="系统通知">
                <el-switch v-model="notificationSettings.systemNotifications" />
                <span class="setting-desc">接收系统维护等重要通知</span>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 隐私设置 -->
        <el-tab-pane label="隐私设置" name="privacy">
          <div class="privacy-settings">
            <el-form :model="privacySettings" label-width="200px">
              <el-form-item label="个人信息可见性">
                <el-select v-model="privacySettings.profileVisibility">
                  <el-option label="所有人可见" value="public" />
                  <el-option label="本课程师生可见" value="course" />
                  <el-option label="仅教师可见" value="teacher" />
                </el-select>
              </el-form-item>
              <el-form-item label="在线状态显示">
                <el-switch v-model="privacySettings.showOnlineStatus" />
                <span class="setting-desc">允许其他用户查看您的在线状态</span>
              </el-form-item>
              <el-form-item label="学习进度可见性">
                <el-switch v-model="privacySettings.showProgress" />
                <span class="setting-desc">允许其他学生查看您的学习进度</span>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/store'
import { updateUserExtraInfo, getUserExtraInfo } from '@/api/user'
import type { FormInstance, FormRules } from 'element-plus'

const userStore = useUserInfoStore()
const userInfo = userStore.userInfo
const avatarBase64 = ref<string | null>(null)
const fileInput = ref<HTMLInputElement>()
const basicForm = ref<FormInstance>()

// 当前激活的标签页
const activeTab = ref('basic')

// 基本信息表单
const basicInfo = reactive({
  nickname: userInfo.nickname || '',
  gender: userInfo.gender || 'male',
  email: userInfo.email || '',
  phone: userInfo.phone || '',
  bio: userInfo.bio || '',
  realName: userInfo.realName || '',
  studentId: userInfo.studentId || '',
  department: userInfo.department || '',
  major: userInfo.major || '',
  grade: userInfo.grade || '',
  className: userInfo.className || '',
  address: userInfo.address || '',
  birthday: userInfo.birthday || '',
  qq: userInfo.qq || '',
  wechat: userInfo.wechat || ''
})

// 基本信息验证规则
const basicRules = reactive<FormRules>({
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{8,12}$/, message: '请输入正确的学号格式', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  qq: [
    { pattern: /^\d{5,11}$/, message: '请输入正确的QQ号码', trigger: 'blur' }
  ],
  wechat: [
    { pattern: /^[a-zA-Z][a-zA-Z\d_-]{5,19}$/, message: '请输入正确的微信号', trigger: 'blur' }
  ]
})

// 密码表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码验证规则
const passwordRules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 安全设置
const securitySettings = reactive({
  twoFactor: false
})

// 通知设置
const notificationSettings = reactive({
  courseAnnouncements: true,
  homeworkReminders: true,
  examReminders: true,
  gradeNotifications: true,
  systemNotifications: true
})

// 隐私设置
const privacySettings = reactive({
  profileVisibility: 'course',
  showOnlineStatus: true,
  showProgress: true
})

// 安全评分计算
const securityItems = ref([
  { title: '密码强度', status: true },
  { title: '绑定手机', status: true },
  { title: '绑定邮箱', status: false },
  { title: '两步验证', status: false }
])

const securityScore = computed(() => {
  const completedItems = securityItems.value.filter(item => item.status).length
  return Math.floor((completedItems / securityItems.value.length) * 100)
})

// 用户统计信息
const userStats = computed(() => [
  {
    label: '课程',
    value: userInfo.courseCount || 0,
    icon: 'Reading'
  },
  {
    label: '考试',
    value: userInfo.examCount || 0,
    icon: 'DocumentChecked'
  },
  {
    label: '作业',
    value: userInfo.homeworkCount || 0,
    icon: 'Collection'
  }
])

// 获取用户额外信息
const fetchUserExtraInfo = async () => {
  const { data: res } = await getUserExtraInfo(userStore.userInfo.id)
  avatarBase64.value = res.userExtraInfo.pic
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理图片上���
const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (e.target) {
        const pic = e.target.result as string
        try {
          await updateUserExtraInfo(userStore.userInfo.id, 'pic', {
            value: pic
          })
          avatarBase64.value = pic
          ElMessage.success('头像上传成功')
        } catch (error) {
          ElMessage.error('头像上传失败，请重试')
        }
      }
    }
    reader.readAsDataURL(file)
  }
}

// 初始化时获取用户信息
fetchUserExtraInfo()

// 保存设置
const saveSettings = async () => {
  if (!basicForm.value) return

  try {
    await basicForm.value.validate()

    const response = await updateUserExtraInfo(
      userInfo.userId,
      'profile',
      basicInfo
    )

    if (response.code === 200) {
      // 更新 store 中的用户信息
      userStore.setUserInfo({
        ...userInfo,
        ...basicInfo
      })
      ElMessage.success('个人信息更新成功')
    } else {
      ElMessage.error(response.message || '更新失败')
    }
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存失败，请检查表单')
  }
}

// 重置设置
const resetSettings = () => {
  // 重置所有表单
  Object.assign(basicInfo, {
    nickname: userInfo.nickname,
    gender: userInfo.gender,
    email: userInfo.email,
    phone: userInfo.phone,
    bio: userInfo.bio,
    realName: userInfo.realName,
    studentId: userInfo.studentId,
    department: userInfo.department,
    major: userInfo.major,
    grade: userInfo.grade,
    className: userInfo.className,
    address: userInfo.address,
    birthday: userInfo.birthday,
    qq: userInfo.qq,
    wechat: userInfo.wechat
  })

  Object.assign(passwordForm, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  ElMessage.success('设置已重置')
}
</script>

<style scoped>
.settings-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
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

.profile-overview {
  margin-bottom: 2rem;
}

.profile-card {
  background: linear-gradient(135deg, var(--el-color-primary-light-7) 0%, white 100%);
}

.profile-header {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.avatar-section {
  position: relative;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.profile-info {
  flex: 1;
}

.profile-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--el-color-primary);
}

.stat-label {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.security-card {
  height: 100%;
}

.security-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.settings-container {
  background: white;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.profile-info h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.user-role {
  color: var(--el-text-color-secondary);
  margin: 0 0 0.5rem;
}

.user-id {
  color: var(--el-text-color-regular);
  margin: 0;
}

.settings-tabs {
  padding: 0 2rem;
}

.security-section {
  margin-bottom: 2rem;
}

.security-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: var(--el-text-color-primary);
}

.two-factor {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setting-desc {
  margin-left: 1rem;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.settings-actions {
  padding: 2rem;
  border-top: 1px solid var(--el-border-color-light);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 768px) {
  .settings-page {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .settings-tabs {
    padding: 0 1rem;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>