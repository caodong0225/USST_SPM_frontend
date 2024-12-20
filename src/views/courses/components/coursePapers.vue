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
          label="操作"
          align="center"
          width="180"
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

export default {
  name: "TableWithPagination",
  setup() {
    const columns = ref([
      { label: "用户名", prop: "username" },
      { label: "角色", prop: "role" },
      { label: "邮箱", prop: "email" },
    ]);

    const tableData = ref([
      { username: "用户A", role: "管理员", email: "a@example.com" },
      { username: "用户B", role: "普通用户", email: "b@example.com" },
      { username: "用户C", role: "普通用户", email: "c@example.com" },
      { username: "用户D", role: "管理员", email: "d@example.com" },
      { username: "用户E", role: "普通用户", email: "e@example.com" },
      { username: "用户F", role: "普通用户", email: "f@example.com" },
    ]);

    const currentPage = ref(1);
    const pageSize = ref(3);

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
