<template>
  <div>
    <h3>我创建的课程</h3>
    <el-table
        :data="courses"
        border
        style="width: 100%; margin-top: 20px"
        v-loading="loading"
    >
      <!-- 序号列 -->
      <el-table-column
          type="index"
          label="id"
      ></el-table-column>

      <!-- 课程名称 -->
      <el-table-column
          prop="courseName"
          label="课程名称"
      ></el-table-column>

      <!-- 状态 -->
      <el-table-column
          prop="status"
          label="状态"
      ></el-table-column>

      <!-- 操作列 -->
      <el-table-column
          label="操作"
      >
        <template #default="scope">
          <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
          >
            编辑题库
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        style="margin-top: 20px; text-align: right"
        background
        layout="prev, pager, next, total"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="handlePageChange"
    ></el-pagination>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {deleteCourse, getMyCreatedCourses} from "../../api/course.ts";

export default defineComponent({
  name: 'CoursesTable',
  methods: {
    // 编辑课程
    handleEdit(course: any) : void {
      // 路由跳转
      this.$router.push(`/questions/list/${course.id}`)
    }
  },
  setup() {
    const courses = ref([]); // 表格数据
    const total = ref(0); // 数据总数
    const currentPage = ref(1); // 当前页
    const pageSize = ref(10); // 每页大小
    const loading = ref(false); // 加载状态

    // 获取课程数据
    const fetchCourses = async () => {
      loading.value = true;
      try {
        const { data } = await getMyCreatedCourses(currentPage.value, pageSize.value);
        console.log(data)
        courses.value = data.records; // 后端分页的课程数据
        total.value = data.total; // 总条目数
      } catch (error) {
        ElMessage.error('获取课程数据失败');
      } finally {
        loading.value = false;
      }
    };

    // 分页切换
    const handlePageChange = (page: number) => {
      currentPage.value = page;
      fetchCourses();
    };

    // 删除课程
    const handleDelete = (course: any) => {
      deleteCourse(course.id).then(res => {
        if(res.code == 200){
          ElMessage.success('删除成功');
        }else{
          ElMessage.error('删除失败');
        }
        fetchCourses();
      })
    };

    // 初始化加载数据
    onMounted(() => {
      fetchCourses();
    });

    return {
      courses,
      total,
      currentPage,
      pageSize,
      loading,
      handlePageChange,
      handleDelete,
    };
  },
});
</script>
<style scoped>
.el-table th {
  background-color: #f5f7fa;
  text-align: center;
}

.el-table td {
  text-align: center;
}
</style>
