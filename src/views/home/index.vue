<template>
  <section class="notification-list">
    <h1 class="list-title">动态</h1>
    <div class="notifications-container">
      <NotificationCard
          v-for="notification in notifications_list"
          :key="notification.id"
          :title="notification.title"
          :date="notification.createdAt"
          :content="notification.content"
          :avatarUrl="notification.avatarUrl"
      />
    </div>
  </section>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import NotificationCard from "./components/notifications.vue";
import {fetchNotifications} from "../../api/notifications.ts";

export default defineComponent({
  name: 'NotificationList',
  components: {NotificationCard },
  setup() {
    const notifications = ref<any[]>([]);
    // 获取数据
    const getNotifications = async () => {
      const {data:res} = await fetchNotifications();
      notifications.value = res;
    }
    getNotifications();
    return {
      notifications_list: notifications
    };
  }
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
