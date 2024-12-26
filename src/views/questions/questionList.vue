<template>
  <div class="question-list">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <div class="left">
        <el-button-group>
          <el-button type="primary" @click="$router.push('/questions/create')">
            <el-icon><Plus /></el-icon>新增试题
          </el-button>
          <el-button type="success">
            <el-icon><Upload /></el-icon>批量导入
          </el-button>
        </el-button-group>
      </div>
      <div class="right">
        <el-input
          v-model="searchQuery"
          placeholder="搜索试题"
          class="search-input"
          clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="题型">
          <el-select v-model="filterForm.type" placeholder="全部类型" clearable>
            <el-option label="选择题" value="choice" />
            <el-option label="填空题" value="fill" />
            <el-option label="判断题" value="judge" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="filterForm.level" placeholder="全部难度" clearable>
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 题目列表 -->
    <div class="questions-table" v-loading="loading">
      <el-table :data="filteredQuestions" border stripe>
        <el-table-column type="index" width="60" align="center" />
        <el-table-column prop="questionType" label="题型" width="100">
          <template #default="{ row }">
            <el-tag :type="getQuestionTypeTag(row.questionType)">
              {{ row.questionType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="questionName" label="题目" show-overflow-tooltip />
        <el-table-column prop="questionLevel" label="难度" width="100">
          <template #default="{ row }">
            <el-tag :type="getDifficultyTag(row.questionLevel)">
              {{ row.questionLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="handlePreview(row)">
                <el-icon><View /></el-icon>预览
              </el-button>
              <el-button type="primary" link @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>编辑
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getQuestionList, deleteQuestion } from '@/api/questions'

// 定义接口类型
interface QuestionItem {
  id: number;
  questionType: string;
  questionName: string;  // 注意这里是 questionName 而不是 question
  questionLevel: string;
  questionOptions: string;  // 注意这里是 questionOptions 而不是 options
  createdAt: string;
  updatedAt: string;
  courseId: number;
  explanation: string;
  answers: string;
}

const router = useRouter()
const loading = ref(false)
const questions = ref<QuestionItem[]>([])  // 直接使用 mock 数据初始化
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)  // 使用 mock 数据长度
const filterForm = ref({
  type: '',
  level: ''
})

// 获取题目列表
const fetchQuestions = async () => {
  loading.value = true
  try {
    const res = await getQuestionList()
    console.log('API响应:', res)

    if (res.code === 200) {
      questions.value = res.data
      total.value = res.data.length
    } else {
      // 如果API调用失败，使用 mock 数据
      questions.value = mockQuestions
      total.value = mockQuestions.length
      ElMessage.warning('使用模拟数据进行展示')
    }
  } catch (error) {
    console.error('获取题目列表失败:', error)
    // 发生错误时也使用 mock 数据
    questions.value = mockQuestions
    total.value = mockQuestions.length
    ElMessage.warning('使用模拟数据进行展示')
  } finally {
    loading.value = false
  }
}

// 过滤后的题目列表
const filteredQuestions = computed(() => {
  let result = questions.value

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(q => 
      q.questionName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 类型过滤
  if (filterForm.value.type) {
    result = result.filter(q => q.questionType === filterForm.value.type)
  }

  // 难度过滤
  if (filterForm.value.level) {
    result = result.filter(q => q.questionLevel === filterForm.value.level)
  }

  return result
})

// 处理预览
const handlePreview = (row) => {
  router.push(`/questions/preview/${row.id}`)
}

// 处理编辑
const handleEdit = (row) => {
  router.push(`/questions/update/${row.id}`)
}

// 处理删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这道题目吗？', '提示', {
      type: 'warning'
    })
    
    const res = await deleteQuestion(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchQuestions()
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 获取题型标签类型
const getQuestionTypeTag = (type) => {
  const typeMap = {
    '选择题': 'primary',
    '填空题': 'success',
    '判断题': 'warning'
  }
  return typeMap[type] || 'info'
}

// 获取难度标签类型
const getDifficultyTag = (level) => {
  const levelMap = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return levelMap[level] || 'info'
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 初始化加载
fetchQuestions()
</script>

<style lang="less" scoped>
.question-list {
  padding: 20px;

  .operation-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .search-input {
      width: 300px;
    }
  }

  .filter-section {
    margin-bottom: 20px;
    padding: 16px;
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
  }

  .questions-table {
    background: var(--el-bg-color);
    padding: 20px;
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style> 