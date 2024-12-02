<template>
  <section class="courses-list">
    <header>
      <h1>课程列表</h1>
    </header>

    <div class="courses-container">
      <!--如果没有课程数据，则显示none.vue组件信息-->
      <None v-if="totalNum < 1" />
      <CourseCard
          v-else
          v-for="course in courses"
          :title="course.courseName"
          :startTime="course.startTime"
          :status="course.status"
          :description="course.courseDesc"
          :imageUrl="course.coursePic"
      />
    </div>

    <footer class="pagination-controls">
      <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="itemsPerPage"
          :page-sizes="[5, 10, 15, 20]"
          :total="totalNum"
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
import { defineComponent, ref } from "vue";
import CourseCard from "./components/courses.vue";
import { ElPagination, ElSelect, ElOption } from "element-plus";
import {getUserCoursesPage} from "../../api/course.ts";

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
    const courses = ref<any[]>([]);
    const totalNum = ref(0);

    // 分页状态
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    // 修改每页条数
    const onPageSizeChange = (size: number) => {
      itemsPerPage.value = size;
      currentPage.value = 1; // 重新调整为第一页
      fetchCourses();
    };

    // 修改当前页码
    const onPageChange = (page: number) => {
      currentPage.value = page;
      fetchCourses();
    };

    // 向后端发送请求获取课程数据
    const fetchCourses = async () => {
      const res = await getUserCoursesPage(
        currentPage.value,
        itemsPerPage.value
      );
      totalNum.value = res.data.total;
      courses.value = res.data.records;
    };
    fetchCourses();
    return {
      courses,
      currentPage,
      itemsPerPage,
      totalNum,
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
  width: 120px;
}
</style>
