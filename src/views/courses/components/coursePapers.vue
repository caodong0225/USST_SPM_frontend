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
          prop="papers.visible"
          v-if = "isAdmin"
      />
      <el-table-column
          label="操作"
          align="center"
          width="280"
          v-if = "isAdmin"
      >
        <template #default="scope">
          <el-button size="mini" type="primary" @click="handlePreview(scope.row)">提交记录</el-button>
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
    <el-dialog title="提交记录" v-model="dialogVisible" width="60%">
      <el-table :data="submitRecords" border>
        <el-table-column prop="id" label="记录ID" />
        <el-table-column prop="result.correctNum" label="正确数" />
        <el-table-column prop="result.wrongNum" label="错误数" />
        <el-table-column prop="createdAt" label="提交时间" />
      </el-table>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </el-card>
  <CreatePaper :course-id="courseId" v-else/>
</template>

<script>
import { ref } from "vue";
import {useUserInfoStore} from "../../../store";
import CreatePaper from "./addPaper.vue";
import {deletePaper} from "../../../api/paper.ts";
import {ElMessage} from "element-plus";
import {getSubmitList} from "../../../api/submit.ts";

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
  methods: {
    handleEdit(row) {
      this.$router.push(`/questions/list/${this.courseId}?paperId=${row.papers.id}`)
    },
    handleEntry(row) {
      if(dialogVisible.value)
        return
      this.$router.push(`/papers/${row.papers.id}`)
    }
  },
  setup() {
    const columns = ref([
      { label: "测试ID", prop: "papers.id"},
      { label: "测试名称", prop: "papers.paperName" },
      { label: "测试开始时间", prop: "papers.paperStartTime" },
      { label: "测试结束时间", prop: "papers.paperEndTime" },
      { label: "测试状态", prop: "papers.status" },
      { label: "试题数量", prop: "questionsNum"},
    ]);

    const currentPage = ref(1);
    const pageSize = ref(3);
    const userInfoStore = useUserInfoStore()
    const isAdmin = ref(false);
    const addPaper = ref(false);
    const dialogVisible = ref(false);
    const submitRecords = ref([]);
    if (userInfoStore.userInfo.role > 0) {
      isAdmin.value = true;
    }
    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const handlePreview = (row) => {
      getSubmitList(row.papers.id).then((res) => {
        if (res.code === 200) {
          submitRecords.value = [];
          for (let record of res.data) {
            submitRecords.value.push({
              id: record.id,
              createdAt: record.createdAt,
              result: JSON.parse(record.result),
            });
          }
          dialogVisible.value = true;
        } else {
          ElMessage.error("获取提交记录失败");
        }
      });
    };

    const handleDelete = (row) => {
      deletePaper(row.papers.id).then(res => {
        if(res.code === 200){
          ElMessage.success('删除成功');
          // 刷新当前组件的数据信息
          this.tableData = this.tableData.filter(item => item.papers.id !== row.papers.id)
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
      handlePageChange,
      handleDelete,
      handlePreview,
      dialogVisible,
      submitRecords
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
