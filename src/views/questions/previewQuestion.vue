<template>
  <div class="preview-question">
    <div class="page-header">
      <div class="header-left">
        <el-button @click="returnBack">
          <i class="iconfont icon-fanhui"></i>返回
        </el-button>
      </div>
      <div class="header-title">
        <el-icon><View /></el-icon>
        <span>预览试题</span>
      </div>
    </div>

    <div class="question-content">
      <!-- 题目信息 -->
      <el-descriptions :column="1" border>
        <el-descriptions-item label="题目类型">
          {{ question.questionType }}
        </el-descriptions-item>
        <el-descriptions-item label="难度等级">
          <el-tag :type="getDifficultyType">{{ question.questionLevel }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="题目内容">
          {{ question.question }}
        </el-descriptions-item>
        <el-descriptions-item label="选项" v-if="question.questionType === '选择题'">
          <div v-for="(option, index) in parsedOptions" :key="index" class="option-item">
            <el-tag size="small" :type="option.label === question.answers ? 'success' : ''">
              {{ option.label }}
            </el-tag>
            {{ option.content }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="正确答案">
          {{ question.answers }}
        </el-descriptions-item>
        <el-descriptions-item label="解析">
          {{ question.explanation }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getQuestionDetail } from '@/api/questions'

export default {
  name: 'PreviewQuestion',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const question = ref({})

    const getDifficultyType = computed(() => {
      const typeMap = {
        '简单': 'success',
        '中等': 'warning',
        '困难': 'danger'
      }
      return typeMap[question.value.questionLevel] || 'info'
    })

    const parsedOptions = computed(() => {
      if (!question.value.options) return []
      try {
        return JSON.parse(question.value.options)
      } catch {
        return []
      }
    })

    const getQuestionData = async () => {
      try {
        const res = await getQuestionDetail(Number(route.params.id))
        if (res.code === 200) {
          question.value = res.data
        }
      } catch (error) {
        console.error('获取题目详情失败:', error)
      }
    }

    const returnBack = () => {
      router.back()
    }

    // 初始化加载
    getQuestionData()

    return {
      question,
      getDifficultyType,
      parsedOptions,
      returnBack
    }
  }
}
</script>

<style lang="less" scoped>
.preview-question {
  padding: 20px;

  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 500;
    }
  }

  .question-content {
    background: var(--el-bg-color);
    padding: 24px;
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);

    .option-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style> 