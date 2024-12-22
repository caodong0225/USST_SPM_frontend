<template>
  <div class="student-page">
    <!-- 按钮：打开选择学生的弹窗 -->
    <el-button type="primary" @click="openDialog">选择学生</el-button>

    <!-- 弹窗 -->
    <el-dialog
        title="学生信息列表"
        v-model="dialogVisible"
        width="50%"
    >
      <!-- 学生列表表格 -->
      <el-table
          :data="studentList"
          border
          style="width: 100%"
      >
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="nickname" label="姓名" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
                size="small"
                type="success"
                @click="addStudent(scope.row)"
                :disabled="isAdded(scope.row.id)"
            >
              {{ isAdded(scope.row.id) ? "已添加" : "添加学生" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="studentList.length"
          layout="prev, pager, next"
          style="margin-top: 20px; text-align: right;"
      />

      <!-- 弹窗底部按钮 -->
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 已添加学生表格 -->
    <el-table
        :data="addedStudents"
        border
        style="margin-top: 20px; width: 100%"
    >
      <el-table-column prop="id" label="学号" width="100" />
      <el-table-column prop="name" label="姓名" />
    </el-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {getUserList} from "../../../api/user.ts";
import {getCourseParticipate} from "../../../api/course.ts";

export default defineComponent({
  name: "Students",
  props: {
    // 课程ID
    courseId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示/隐藏
    }
  },
  setup(props) {
    // 模拟学生数据
    const studentList = ref<any>(); // 课程详细信息
    const addedStudents = ref<any>(); // 课程详细信息
    const currentPage = ref<number>(1); // 课程详细信息
    const pageSize = ref<number>(5); // 课程详细信息
    const fetchStudentList = async (current:number,size:number) => {
      const {data: res} = await getUserList(current,size);
      studentList.value = res.records;
    };
    const getCourseParticipatedStudents = async () => {
      const {data: res} = await getCourseParticipate(props.courseId);
      addedStudents.value = res.records;
    };
    fetchStudentList(currentPage.value,pageSize.value);
    getCourseParticipatedStudents();
    const handlePageChange = (page:number) => {
      // 更新当前页码
      currentPage.value = page;
      fetchStudentList(currentPage.value,pageSize.value);
    };
    return {
      studentList,
      addedStudents,
      currentPage,
      pageSize,
      handlePageChange
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true; // 打开弹窗
    },
    addStudent(student) {
      // 如果学生未添加到已选择列表中，则添加
      if (!this.isAdded(student.id)) {
        this.addedStudents.push(student);
      }
    },
    isAdded(studentId) {
      // 检查学生是否已经添加
      for(let student of this.addedStudents) {
        if (student?.id === studentId) {
          return true;
        }
      }
      return false;
    },
  },
});
</script>

<style scoped>
.student-page {
  padding: 20px;
}
</style>
