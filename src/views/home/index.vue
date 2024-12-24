<template>
  <PageLayout title="课程概览" :show-breadcrumb="false">
    <div class="home-container">
      <!-- 欢迎横幅 -->
      <div class="welcome-banner">
        <div class="welcome-content">
          <h1>{{ greeting }}, {{ userInfo.nickname || '同学' }}</h1>
          <div class="info-grid">
            <div class="info-item">
              <el-icon>
                <Calendar />
              </el-icon>
              <span>{{ currentDate }}</span>
            </div>
            <div class="info-item">
              <el-icon>
                <Clock />
              </el-icon>
              <span>第{{ weekNumber }}教学周</span>
            </div>
            <div class="info-item">
              <el-icon>
                <Bell />
              </el-icon>
              <span>{{ nextClass ? `下节课：${nextClass}` : '今日课程已结束' }}</span>
            </div>
            <div class="info-item">
              <el-icon>
                <Notification />
              </el-icon>
              <span>{{ unreadCount }} 条未读消息</span>
            </div>
          </div>
        </div>
        <div class="quick-actions">
          <el-button-group>
            <el-button type="primary" @click="handleQuickAction('homework')">
              <el-icon>
                <Document />
              </el-icon>交作业
            </el-button>
            <el-button type="success" @click="handleQuickAction('question')">
              <el-icon>
                <QuestionFilled />
              </el-icon>提问题
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 统计卡片区域 -->
      <div class="stats-section">
        <div v-for="stat in stats" :key="stat.title" class="stat-card" :style="{ '--stat-color': stat.color }">
          <div class="stat-icon">
            <el-icon>
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
          </div>
          <el-progress :percentage="stat.progress" :color="stat.color" :show-text="false" class="stat-progress" />
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 左侧：通知列表 -->
        <div class="notifications-section">
          <div class="section-header">
            <h2 class="section-title">最新动态</h2>
            <el-button type="primary" text>
              查看全部
              <el-icon class="el-icon--right">
                <ArrowRight />
              </el-icon>
            </el-button>
          </div>

          <div class="notifications-container" v-loading="loading">
            <NotificationCard v-for="notification in notifications_list" :key="notification.id" v-bind="notification"
              class="notification-item" />
            <el-empty v-if="!notifications_list?.length" description="暂无动态" />
          </div>
        </div>

        <!-- 右侧：其他信息 -->
        <div class="side-content">
          <!-- 待办事项 -->
          <div class="todo-section">
            <div class="section-header">
              <h3 class="section-title">待办事项</h3>
              <el-button type="primary" text size="small" @click="addTodo">
                <el-icon>
                  <Plus />
                </el-icon>添加
              </el-button>
            </div>
            <div class="todo-list">
              <el-checkbox-group v-model="completedTodos">
                <div v-for="todo in todos" :key="todo.id" class="todo-item">
                  <el-checkbox :label="todo.id">{{ todo.content }}</el-checkbox>
                  <span class="todo-date">{{ todo.dueDate }}</span>
                </div>
              </el-checkbox-group>
            </div>
          </div>

          <!-- 课程日历 -->
          <div class="calendar-section">
            <div class="section-header">
              <h3 class="section-title">课程安排</h3>
              <el-date-picker v-model="selectedDate" type="date" size="small" @change="handleDateChange" />
            </div>
            <div class="schedule-list">
              <div v-for="schedule in todaySchedule" :key="schedule.id" class="schedule-item">
                <div class="time-block" :style="{ '--schedule-color': schedule.color }">
                  {{ schedule.time }}
                </div>
                <div class="schedule-content">
                  <div class="schedule-title">{{ schedule.title }}</div>
                  <div class="schedule-location">
                    <el-icon>
                      <Location />
                    </el-icon>
                    {{ schedule.location }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserInfoStore } from '@/store'
import NotificationCard from "./components/notifications.vue"
import PageLayout from '@/components/layout/PageLayout.vue'
import { fetchNotifications } from "@/api/notifications"

// 用户信息
const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.userInfo)

// 欢迎语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 19) return '傍晚好'
  return '晚上好'
})

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// 统计数据
const stats = ref([
  {
    title: '作业完成率',
    value: '85%',
    icon: 'Document',
    color: '#3b82f6',
    progress: 85
  },
  {
    title: '出勤率',
    value: '96%',
    icon: 'Calendar',
    color: '#10b981',
    progress: 96
  },
  {
    title: '互动参与度',
    value: '78%',
    icon: 'ChatDotRound',
    color: '#f59e0b',
    progress: 78
  },
  {
    title: '课程进度',
    value: '65%',
    icon: 'School',
    color: '#8b5cf6',
    progress: 65
  }
])

// 待办事项
const todos = ref([
  { id: 1, content: '提交软件工程作业', dueDate: '今天 23:59' },
  { id: 2, content: '准备项目展示', dueDate: '明天 14:00' },
  { id: 3, content: '小组讨论会议', dueDate: '周五 10:00' }
])
const completedTodos = ref([])

// 课程日历
const selectedDate = ref(new Date())
const todaySchedule = ref([
  {
    id: 1,
    time: '08:00 - 09:35',
    title: '软件工程',
    location: '教学楼A-301',
    color: '#3b82f6'
  },
  {
    id: 2,
    time: '10:00 - 11:35',
    title: '项目管理',
    location: '教学楼B-205',
    color: '#10b981'
  }
])

// 方法
const handleQuickAction = (type: string) => {
  // 处理快捷操作
}

const addTodo = () => {
  // 添加待办事项
}

const handleDateChange = (date: Date) => {
  // 处理日期变化
}

// 获取通知数据
const notifications_list = ref([
  {
    id: 1,
    title: '王教授',
    content: '同学们注意，下周二的软件工程课程将进行项目展示，请各小组做好准备。展示顺序将在课前抽签决定。',
    date: '2024-03-20 10:30:00',
    type: 'notice',
    avatarUrl: 'https://example.com/avatar1.jpg'
  },
  {
    id: 2,
    title: '系统通知',
    content: '《软件工程》课程作业已发布：第三章课后习题，请在本周日前完成提交。',
    date: '2024-03-19 15:20:00',
    type: 'homework',
    attachments: [
      {
        id: 1,
        name: '软件工程作业要求.pdf',
        size: 1024 * 1024 * 2.5 // 2.5MB
      }
    ]
  },
  {
    id: 3,
    title: '李同学',
    content: '关于设计模式中观察者模式和发布订阅模式的区别，谁能详细解释一下？',
    date: '2024-03-19 09:15:00',
    type: 'question'
  },
  {
    id: 4,
    title: '系统通知',
    content: '您的《项目管理》课程期中考试成绩已公布，请查看。',
    date: '2024-03-18 16:45:00',
    type: 'grade'
  },
  {
    id: 5,
    title: '张教授',
    content: '关于下周的团队项目进度汇报，请各小组组长提前准备PPT，每组展示时间15分钟。',
    date: '2024-03-18 11:20:00',
    type: 'notice',
    attachments: [
      {
        id: 2,
        name: '进度汇报模板.pptx',
        size: 1024 * 1024 * 1.8 // 1.8MB
      }
    ]
  }
])

const loading = ref(false)

// 教学周计算
const weekNumber = computed(() => {
  const startDate = new Date('2024-09-2') // 开学日期
  const now = new Date()
  const diff = now.getTime() - startDate.getTime()
  const weekNum = Math.ceil(diff / (7 * 24 * 60 * 60 * 1000))
  return weekNum
})

// 下节课信息
const nextClass = computed(() => {
  const now = new Date()
  const hour = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hour * 60 + minutes

  const schedule = todaySchedule.value.find(s => {
    const [startTime] = s.time.split(' - ')
    const [h, m] = startTime.split(':').map(Number)
    const classTime = h * 60 + m
    return classTime > currentTime
  })

  return schedule ? `${schedule.title} (${schedule.time})` : null
})

// 未读消息数量
const unreadCount = ref(5) // 这里应该从后端获取实际未读消息数量

onMounted(() => {
  // 实际项目中，您需要保留该函数并从后端获取数据
})
</script>

<style scoped>
.home-container {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 统计卡片样式 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  background: color-mix(in srgb, var(--stat-color) 15%, white);
  color: var(--stat-color);
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.5rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--stat-color);
  line-height: 1;
}

.stat-title {
  color: var(--text-secondary);
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

/* 通知列表样式 */
.notifications-section {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.notifications-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.notification-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stats-section {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}

/* 新增样式 */
.welcome-banner {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  border-radius: var(--border-radius);
  padding: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
}

.welcome-content h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.info-item .el-icon {
  font-size: 1.2rem;
}

.quick-actions {
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem;
  border-radius: var(--border-radius);
  backdrop-filter: blur(4px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    justify-content: center;
  }

  .quick-actions {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.subtitle {
  opacity: 0.9;
  font-size: 1.1rem;
}

.stat-progress {
  margin-top: 0.5rem;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.side-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.todo-section,
.calendar-section {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.todo-date {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.schedule-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.time-block {
  padding: 0.5rem;
  background: color-mix(in srgb, var(--schedule-color) 15%, white);
  color: var(--schedule-color);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  white-space: nowrap;
}

.schedule-content {
  flex: 1;
}

.schedule-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.schedule-location {
  font-size: 0.9rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
