<template>
  <article class="announcement-card">
    <h1 class="announcement-title">公告标题</h1>
    <div class="announcement-meta">
      <span class="course-name">课程名称</span>
      <time class="creation-time">创建时间</time>
      <span class="teacher-name">教师姓名</span>
      <div class="meta-content"></div>
    </div>
    <p class="announcement-content">消息内容...</p>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface AnnouncementProps {
  title: string
  courseName: string
  createdAt: string
  teacherName: string
  content: string
}

export default defineComponent({
  name: 'AnnouncementCard',
  props: {
    title: {
      type: String,
      required: true
    },
    courseName: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    },
    teacherName: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped>
.announcement-card {
  display: flex;
  flex-direction: column;
  height: auto;
  padding: 0 20px 30px;
}

.announcement-title {
  font-size: 24px;
  width: 100px;
}

.announcement-meta {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.course-name {
  margin: auto 0;
}

.creation-time {
  margin: auto 0 auto 20px;
}

.teacher-name {
  margin: auto 0 auto 20px;
}

.meta-content {
  display: flex;
  flex-direction: column;
  width: 200px;
  margin: auto 0 auto 20px;
}

.announcement-content {
  margin-top: 20px;
}
</style>