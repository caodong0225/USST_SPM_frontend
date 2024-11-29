<template>
  <section class="notification-list">
    <h1 class="list-title">动态</h1>
    <div class="notifications-container">
      <NotificationCard
          v-for="notification in notifications_list"
          :key="notification.id"
          :title="notification.title"
          :date="notification.date"
          :content="notification.content"
          :avatarUrl="notification.avatarUrl"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotificationCard from "./components/notifications.vue";

interface Notification {
  id: number;
  title: string;
  date: string;
  content: string;
  avatarUrl: string;
}

export default defineComponent({
  name: 'NotificationList',
  components: {NotificationCard },
  data() {
    return {
      notifications_list: [
        {
          id: 1,
          title: '公告发布',
          date: '2024-11-29',
          content: '这是一条重要通知的内容。',
          avatarUrl: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a',
        },
        {
          id: 2,
          title: '系统更新',
          date: '2024-11-28',
          content: '系统将在今晚进行维护。',
          avatarUrl: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fdefault-avatar',
        },
        {
          id: 3,
          title: '活动提醒',
          date: '2024-11-27',
          content: '公司年会将于下周举行。',
          avatarUrl: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fuser-avatar',
        },
      ] as Notification[],
    };
  },
});
</script>

<style scoped>
.notification-list {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.list-title {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
}

.notifications-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
