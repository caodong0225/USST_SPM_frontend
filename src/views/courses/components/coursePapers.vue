<template>
  <el-card>
    <el-table
        :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        style="width: 100%"
        :border="true"
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
          v-if = "role != null"
      />
      <el-table-column
          label="操作"
          align="center"
          width="180"
          v-if = "role != null"
      >
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
</template>

<script>
import { ref } from "vue";
import {useUserInfoStore} from "../../../store";

export default {
  name: "TableWithPagination",
  props: {
    tableData: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const columns = ref([
      { label: "测试ID", prop: "id"},
      { label: "测试名称", prop: "paperName" },
      { label: "测试开始时间", prop: "paperStartTime" },
      { label: "测试状态", prop: "status" },
    ]);

    const tableData = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(3);
    const userInfoStore = useUserInfoStore()
    const role = userInfoStore.userInfo.role

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const handleEdit = (row) => {
      alert(`编辑用户：${row.username}`);
    };

    const handleDelete = (row) => {
      alert(`删除用户：${row.username}`);
    };

    return {
      columns,
      tableData,
      currentPage,
      pageSize,
      role,
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
</style>
