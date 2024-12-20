<template>
  <section class="courses-list">
    <header>
      <div class="header-container">
        <h1 class="header-title">课程列表</h1>
        <!-- 如果是管理员，则显示添加课程按钮 -->
        <el-button type="primary" @click="goToAddCourse" v-if="isAdmin" class="add-course-btn" icon="Plus">
          添加课程
        </el-button>
      </div>
    </header>

    <div class="courses-container">
      <!--如果没有课程数据，则显示none.vue组件信息-->
      <None v-if="totalNum < 1" />
      <CourseCard
          v-else
          v-for="course in courses"
          :key="course.courseId"
          :id="course.courseId"
          :title="course.courseName"
          :startTime="course.startTime"
          :status="course.status"
          :description="course.courseDesc"
          :imageUrl="course.coursePic? course.coursePic : '/course.png'"
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
import {useUserInfoStore} from "../../store";

export default defineComponent({
  name: "CoursesList",
  methods: {
    goToAddCourse(): void {
      this.$router.push(`/courses/add`);
    },
  },
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
    const isAdmin = ref(false);
    // 获取useUserInfoStore来判断是否是管理员
    const userInfoStore = useUserInfoStore();
    if (userInfoStore.userInfo.role > 0) {
      isAdmin.value = true;
    }

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
      isAdmin,
      onPageSizeChange,
      onPageChange,
    };
  },
});
</script>

<style scoped>

.header-container {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 两端对齐 */
  padding: 0 20px; /* 根据需要调整内边距 */
}

.header-title {
  margin: 0; /* 去掉默认外边距 */
}

.add-course-btn {
  margin-left: auto; /* 保证按钮靠右 */
}

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
