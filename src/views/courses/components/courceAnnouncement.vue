<template>
  <el-card class="announcement-item">
    <h3>{{ announcement.title }}</h3>
    <div class="meta">
      <span>{{ announcement.date }}</span>
      <el-icon><i class="el-icon-user"></i></el-icon>
      <span>{{ announcement.author }}</span>
    </div>
    <p>{{ announcement.content }}</p>
  </el-card>
</template>

<script>
export default {
  name: "AnnouncementItem",
  props: {
    announcement: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.announcement-item {
  margin-bottom: 20px;
}
.meta {
  color: #888;
  font-size: 12px;
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.meta span {
  margin-right: 10px;
}
</style>
