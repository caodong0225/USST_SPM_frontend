<template>
  <article class="announcement-card">
    <h1 class="announcement-title">{{info.announcement.title}}</h1>
    <div class="announcement-meta">
      <span class="course-name">{{info.course.courseName}}</span>
      <time class="creation-time">{{info.announcement.createdAt}}</time>
      <span class="teacher-name">{{info.user.nickname}}</span>
      <div class="meta-content"></div>
    </div>
    <p class="announcement-content">{{info.announcement.content}}</p>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
interface AnnouncementInfo {
  announcement: {
    title: string;
    content: string;
    createdAt: string;
  };
  course: {
    courseName: string;
  };
  user: {
    nickname: string;
  };
}
export default defineComponent({
  name: 'AnnouncementCard',
  props: {
    info: {
      type: Object as () => AnnouncementInfo,
      required: true
    },
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