<template>
  <section class="courses-list">
    <header>
      <h1>课程列表</h1>
    </header>

    <div class="courses-container">
      <CourseCard
          v-for="course in paginatedCourses"
          :key="course.id"
          :title="course.title"
          :startTime="course.startTime"
          :status="course.status"
          :description="course.description"
          :imageUrl="course.imageUrl"
      />
    </div>

    <footer class="pagination-controls">
      <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="itemsPerPage"
          :page-sizes="[5, 10, 15, 20]"
          :total="courses.length"
          @size-change="onPageSizeChange"
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
import { defineComponent, computed, ref } from "vue";
import CourseCard from "./components/courses.vue";
import { ElPagination, ElSelect, ElOption } from "element-plus";

// 定义课程数据的接口
interface Course {
  id: number;
  title: string;
  startTime: string;
  status: string;
  description: string;
  imageUrl: string;
}

export default defineComponent({
  name: "CoursesList",
  components: {
    CourseCard,
    ElPagination,
    ElSelect,
    ElOption,
  },
  setup() {
    // 模拟课程数据
    const courses = ref<Course[]>(Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `课程 ${i + 1}`,
      startTime: `2024-12-0${(i % 10) + 1}`,
      status: i % 2 === 0 ? "开放" : "已结束",
      description: `这是课程 ${i + 1} 的描述信息`,
      imageUrl:
          "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a",
    })));

    // 分页状态
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    // 计算分页后的课程列表
    const paginatedCourses = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return courses.value.slice(start, end);
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
      courses,
      currentPage,
      itemsPerPage,
      paginatedCourses,
      onPageSizeChange,
      onPageChange,
    };
  },
});
</script>

<style scoped>
.courses-list {
  padding: 20px;
}

.courses-container {
  display: flex;
  flex-wrap: wrap;
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
