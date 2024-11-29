<template>
  <article class="notification-card">
    <div class="notification-header">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a"
              alt="Notification sender avatar"
              class="avatar-image"
          />
        </div>
      </div>
      <div class="notification-meta">
        <h2 class="notification-title">公告发布</h2>
        <time class="notification-date">2024-11-29</time>
      </div>
    </div>
    <p class="notification-content">消息内容</p>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface NotificationProps {
  title: string
  date: string
  content: string
  avatarUrl: string
}

export default defineComponent({
  name: 'NotificationCard',
  props: {
    title: {
      type: String,
      required: true,
      default: '公告发布'
    },
    date: {
      type: String,
      required: true,
      default: '2024-11-29'
    },
    content: {
      type: String,
      required: true,
      default: '消息内容'
    },
    avatarUrl: {
      type: String,
      required: true,
      default: '../../assets/image/none.jpg'
    }
  }
})
</script>

<style scoped>
.notification-card {
  width: 100%;
  margin: 0 auto;
}

.notification-header {
  display: flex;
  margin: 15px 25px 20px;
}

.avatar-container {
  flex-shrink: 0;
}

.avatar-wrapper {
  width: 60px;
  height: 60px;
}

.avatar-image {
  width: 60px;
  height: 60px;
  aspect-ratio: 1.42;
  object-fit: cover;
  min-width: 20px;
  min-height: 20px;
  overflow: hidden;
}

.notification-meta {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  height: 60px;
  width: 270px;
}

.notification-title {
  font-size: 24px;
  margin: 0;
}

.notification-date {
  margin-top: 5px;
}

.notification-content {
  margin: 20px 25px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>