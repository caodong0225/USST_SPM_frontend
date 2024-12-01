<template>
  <section class="announcements-list">
    <header>
      <h1>公告列表</h1>
    </header>

    <div class="announcements-container">
      <AnnouncementCard
          v-for="announcement in paginatedAnnouncements"
          :key="announcement.id"
          :title="announcement.title"
          :courseName="announcement.courseName"
          :createdAt="announcement.createdAt"
          :teacherName="announcement.teacherName"
          :content="announcement.content"
      />
    </div>

    <footer class="pagination-controls">
      <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="itemsPerPage"
          :total="announcements.length"
          @current-change="onPageChange"
      />

      <div class="page-size-selector">
        <el-select v-model="itemsPerPage" @change="onPageSizeChange" placeholder="每页显示数">
          <el-option :key="5" :label="'每页 5 条'" :value="5"></el-option>
          <el-option :key="10" :label="'每页 10 条'" :value="10"></el-option>
          <el-option :key="15" :label="'每页 15 条'" :value="15"></el-option>
          <el-option :key="20" :label="'每页 20 条'" :value="20"></el-option>
        </el-select>
      </div>
    </footer>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import AnnouncementCard from "./components/announcements.vue";
import { ElPagination, ElSelect, ElOption } from "element-plus";

interface Announcement {
  id: number;
  title: string;
  courseName: string;
  createdAt: string;
  teacherName: string;
  content: string;
}

export default defineComponent({
  name: "AnnouncementsList",
  components: {
    AnnouncementCard,
    ElPagination,
    ElSelect,
    ElOption,
  },
  setup() {
    // 模拟公告数据
    const announcements = ref<Announcement[]>(Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `公告标题 ${i + 1}`,
      courseName: `课程 ${i % 5 + 1}`,
      createdAt: `2024-12-0${(i % 10) + 1}`,
      teacherName: `教师 ${String.fromCharCode(65 + (i % 5))}`,
      content: `这是公告内容 ${i + 1}。`,
    })));

    // 分页状态
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    // 计算分页后的公告列表
    const paginatedAnnouncements = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return announcements.value.slice(start, end);
    });

    // 修改每页条数
    const onPageSizeChange = (size: number) => {
      itemsPerPage.value = size;
      currentPage.value = 1; // 重新调整为第一页
    };

    // 修改当前页码
    const onPageChange = (page: number) => {
      currentPage.value = page;
    };

    return {
      announcements,
      currentPage,
      itemsPerPage,
      paginatedAnnouncements,
      onPageSizeChange,
      onPageChange,
    };
  },
});
</script>

<style scoped>
.announcements-list {
  padding: 20px;
}

.announcements-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.pagination-controls {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-size-selector {
  display: flex;
  align-items: center;
}
</style>
