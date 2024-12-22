<template>
  <el-card v-if="!addPaper">
    <div class = "header-container">
      <h3>测试列表</h3>
      <el-button type="primary" @click="addPaper = true" style="margin-left: auto;" icon="Plus" v-if="isAdmin">新建测试</el-button>
    </div>
    <el-table
        :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        style="width: 100%"
        :border="true"
        @row-click="handleEntry"
    >
      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          align="center"
      />
      <el-table-column
          label="可见性"
          align="center"
          width="180"
          prop="visible"
          v-if = "isAdmin"
      />
      <el-table-column
          label="操作"
          align="center"
          width="180"
          v-if = "isAdmin"
      >
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row)" v-if = "isAdmin">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)" v-if = "isAdmin">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        style="margin-top: 20px; text-align: center;"
        background
        layout="prev, pager, next"
        :total="tableData.length"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="handlePageChange"
    />
  </el-card>
  <CreatePaper :course-id="courseId" v-else/>
</template>

<script>
import { ref } from "vue";
import {useUserInfoStore} from "../../../store";
import CreatePaper from "./addPaper.vue";
import {deletePaper} from "../../../api/paper.ts";
import {ElMessage} from "element-plus";

export default {
  name: "TableWithPagination",
  components: {CreatePaper},
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    courseId:{
      type: String,
      required: true,
    }
  },
  setup() {
    const columns = ref([
      { label: "测试ID", prop: "id"},
      { label: "测试名称", prop: "paperName" },
      { label: "测试开始时间", prop: "paperStartTime" },
      { label: "测试结束时间", prop: "paperEndTime" },
      { label: "测试状态", prop: "status" },
    ]);

    const currentPage = ref(1);
    const pageSize = ref(3);
    const userInfoStore = useUserInfoStore()
    const isAdmin = ref(false);
    const addPaper = ref(false);
    if (userInfoStore.userInfo.role > 0) {
      isAdmin.value = true;
    }
    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const handleEdit = (row) => {
      alert(`编辑用户：${row.username}`);
    };

    const handleEntry = (row) =>{
      console.log(row)
    }

    const handleDelete = (row) => {
      deletePaper(row.id).then(res => {
        if(res.code === 200){
          ElMessage.success('删除成功');
          // 刷新当前组件的数据信息
          this.tableData = this.tableData.filter(item => item.id !== row.id)
        }else{
          ElMessage.error('删除失败')
        }
      })
    };

    return {
      columns,
      currentPage,
      pageSize,
      isAdmin,
      addPaper,
      handleEntry,
      handlePageChange,
      handleEdit,
      handleDelete,
    };
  },
};
</script>

<style scoped>
.table-container {
  padding: 20px;
}
.header-container {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 两端对齐 */
  padding: 0 20px; /* 根据需要调整内边距 */
}
</style>
