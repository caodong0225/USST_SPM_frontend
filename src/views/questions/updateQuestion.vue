<template>
  <!-- 复用 addAnswerChildren.vue 的模板，但修改标题和提交方法 -->
  <div class="update">
    <!-- 顶部导航区域 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="returnBack">
          <i class="iconfont icon-fanhui"></i>返回
        </el-button>
      </div>
      <div class="header-center">
        <el-steps :active="1" simple>
          <el-step title="选择题型" />
          <el-step title="修改题目" />
          <el-step title="完成更新" />
        </el-steps>
      </div>
    </div>

    <!-- 其他部分与 addAnswerChildren.vue 相似，但需要修改提交方法 -->
    <el-tabs v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label"><i class="iconfont icon-bianji"></i>修改试题</span>
        
        <!-- 题型选择（禁用状态，不允许修改题型） -->
        <div class="type-selector">
          <el-radio-group v-model="optionValue" size="large" disabled>
            <el-radio-button label="选择题">
              <el-icon><Select /></el-icon>选择题
            </el-radio-button>
            <el-radio-button label="填空题">
              <el-icon><Edit /></el-icon>填空题
            </el-radio-button>
            <el-radio-button label="判断题">
              <el-icon><Switch /></el-icon>判断题
            </el-radio-button>
          </el-radio-group>
        </div>

        <!-- 表单部分与添加页面相似 -->
        <!-- ... -->

        <!-- 修改提交按钮 -->
        <div class="submit-section">
          <el-button @click="returnBack">取消</el-button>
          <el-button type="primary" @click="handleUpdate">确认修改</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getQuestionDetail, updateQuestion } from '@/api/questions';

export default {
  name: 'UpdateQuestion',
  data() {
    return {
      questionId: this.$route.params.id,
      loading: false,
      // ... 其他数据与 addAnswerChildren.vue 相似
    };
  },
  created() {
    this.getQuestionData();
  },
  methods: {
    // 获取试题详情
    async getQuestionData() {
      try {
        this.loading = true;
        const res = await getQuestionDetail(this.questionId);
        if (res.code === 200) {
          const { data } = res;
          // 根据题型设置表单数据
          this.optionValue = data.questionType;
          if (data.questionType === '选择题') {
            this.postChange = {
              level: data.questionLevel,
              rightAnswer: data.answers,
              question: data.question,
              analysis: data.explanation,
              ...JSON.parse(data.options).reduce((acc, curr) => {
                acc[`answer${curr.label}`] = curr.content;
                return acc;
              }, {})
            };
          } else if (data.questionType === '填空题') {
            this.postFill = {
              level: data.questionLevel,
              answer: data.answers,
              question: data.question,
              analysis: data.explanation
            };
          } else if (data.questionType === '判断题') {
            this.postJudge = {
              level: data.questionLevel,
              answer: data.answers,
              question: data.question,
              analysis: data.explanation
            };
          }
        }
      } catch (error) {
        console.error('获取试题详情失败:', error);
        this.$message.error('获取试题详情失败');
      } finally {
        this.loading = false;
      }
    },

    // 更新试题
    async handleUpdate() {
      try {
        this.loading = true;
        let params = {
          id: this.questionId,
          questionType: this.optionValue
        };

        if (this.optionValue === '选择题') {
          const options = this.rights.map(right => ({
            label: right.value,
            content: this.postChange[`answer${right.value}`]
          }));

          params = {
            ...params,
            question: this.postChange.question,
            questionLevel: this.postChange.level,
            options: JSON.stringify(options),
            explanation: this.postChange.analysis,
            answers: this.postChange.rightAnswer
          };
        } else if (this.optionValue === '填空题') {
          params = {
            ...params,
            question: this.postFill.question,
            questionLevel: this.postFill.level,
            options: '',
            explanation: this.postFill.analysis,
            answers: this.postFill.answer
          };
        } else if (this.optionValue === '判断题') {
          params = {
            ...params,
            question: this.postJudge.question,
            questionLevel: this.postJudge.level,
            options: '',
            explanation: this.postJudge.analysis,
            answers: this.postJudge.answer
          };
        }

        const res = await updateQuestion(params);
        if (res.code === 200) {
          this.$message.success('更新成功');
          this.returnBack();
        }
      } catch (error) {
        console.error('更新失败:', error);
        this.$message.error('更新失败');
      } finally {
        this.loading = false;
      }
    },

    returnBack() {
      this.$router.push('/questions/list');
    }
  }
};
</script>

<style lang="less" scoped>
// 样式可以复用 addAnswerChildren.vue 的样式
// ...
</style> 