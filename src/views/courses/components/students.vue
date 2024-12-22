<template>
  <div class="student-page">
    <!-- 按钮：打开选择学生的弹窗 -->
    <el-button type="primary" @click="openDialog" v-if="isAdmin">编辑学生</el-button>

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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="nickname" label="姓名" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
                size="small"
                :type="isAdded(scope.row.id) ? 'danger' : 'success'"
                @click="isAdded(scope.row.id) ? deleteStudent(scope.row) : addStudent(scope.row)"
                :disabled = "scope.row.roleName != null"
            >
              {{ isAdded(scope.row.id) ? "删除学生" : "添加学生" }}
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
      <el-table-column prop="users.id" label="id" />
      <el-table-column prop="users.nickname" label="姓名" />
      <el-table-column prop="users.email" label="邮箱" />
      <el-table-column prop="courseParticipants.status" label="状态" />
    </el-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {getUserList} from "../../../api/user.ts";
import {addCourseParticipate, deleteCourseParticipate, getCourseParticipate} from "../../../api/course.ts";
import {useUserInfoStore} from "../../../store";
import {ElMessage} from "element-plus";

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
    const userInfoStore = useUserInfoStore()
    const isAdmin = ref(false);
    if (userInfoStore.userInfo.role > 0) {
      isAdmin.value = true;
    }
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
    const isAdded = (studentId : number) => {
      // 检查学生是否已经添加
      for(let student of addedStudents.value) {
        if (student?.users.id === studentId) {
          return true;
        }
      }
      return false;
    };
    const addStudent = async(student : any) => {
      const res = await addCourseParticipate(props.courseId, student.id);
      // 如果res包含成功字段
      if (res.code == 200) {
        ElMessage.success("添加成功");
      } else {
        ElMessage.error(res.data);
      }
      await getCourseParticipatedStudents();
      await fetchStudentList(currentPage.value, pageSize.value);
    };
    const deleteStudent = async(student : any) => {
      // 删除学生
      const res = await deleteCourseParticipate(props.courseId, student.id);
      // 如果res包含成功字段
      if (res.code == 200) {
        ElMessage.success("删除成功");
      } else {
        ElMessage.error(res.data);
      }
      await getCourseParticipatedStudents();
      await fetchStudentList(currentPage.value, pageSize.value);
    };
    return {
      studentList,
      addedStudents,
      currentPage,
      pageSize,
      isAdmin,
      handlePageChange,
      addStudent,
      isAdded,
      deleteStudent,
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true; // 打开弹窗
    },
  },
});
</script>

<style scoped>
.student-page {
  padding: 20px;
}
</style>
