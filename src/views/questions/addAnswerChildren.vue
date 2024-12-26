<template>
  <div class="add">
    <!-- 添加顶部导航区域 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="returnBack">
          <i class="iconfont icon-fanhui"></i>返回
        </el-button>
      </div>
      <div class="header-center">
        <el-steps :active="1" simple>
          <el-step title="选择题型" />
          <el-step title="编写题目" />
          <el-step title="完成添加" />
        </el-steps>
      </div>
    </div>

    <el-tabs v-model="activeName" class="question-tabs">
      <el-tab-pane name="first">
        <span slot="label"><i class="iconfont icon-tianjia"></i>添加试题</span>
        
        <!-- 改进题型选择区域 -->
        <div class="type-selector">
          <el-radio-group v-model="optionValue" size="large">
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

        <!-- 题型说明卡片 -->
        <el-card class="type-info" v-if="optionValue">
          <template #header>
            <div class="type-header">
              <div class="header-left">
                <el-icon :size="20" class="mr-2">
                  <component :is="getTypeIcon"></component>
                </el-icon>
                <span class="title">{{ optionValue }}说明</span>
              </div>
              <el-tag :type="getTypeTagType" effect="dark">{{ optionValue }}</el-tag>
            </div>
          </template>
          
          <div class="type-content">
            <!-- 题型说明 -->
            <div class="description-section">
              <h4>题型说明</h4>
              <p>{{ getTypeDescription }}</p>
              <el-alert
                :title="getTypeAlert"
                type="info"
                :closable="false"
                show-icon
              />
            </div>

            <!-- 示例部分 -->
            <div class="example-section">
              <div class="section-header">
                <h4>示例题目</h4>
                <el-button type="primary" link @click="showMoreExamples">
                  更多示例
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>

              <!-- 选择题示例 -->
              <div v-if="optionValue === '选择题'" class="example-item">
                <div class="question">在OSI参考模型中，（）层提供端到端的可靠数据传输服务。</div>
                <div class="options">
                  <div v-for="(option, index) in ['网络层', '传输层', '会话层', '应用层']" 
                       :key="index"
                       class="option">
                    <el-tag size="small" type="info">{{ String.fromCharCode(65 + index) }}</el-tag>
                    <span>{{ option }}</span>
                  </div>
                </div>
                <div class="answer">
                  <el-tag type="success" effect="dark">正确答案：B</el-tag>
                </div>
              </div>

              <!-- 填空题示例 -->
              <div v-if="optionValue === '填空题'" class="example-item">
                <div class="question">计算机网络按照规模可分为（）和（）。</div>
                <div class="answer">
                  <el-tag type="success" effect="dark">正确答案：局域网、广域网</el-tag>
                </div>
              </div>

              <!-- 判断题示例 -->
              <div v-if="optionValue === '判断题'" class="example-item">
                <div class="question">HTTP协议是无状态的协议。（）</div>
                <div class="answer">
                  <el-tag type="success" effect="dark">正确答案：正确</el-tag>
                </div>
              </div>
            </div>

            <!-- 注意事项 -->
            <div class="tips-section">
              <el-collapse>
                <el-collapse-item title="注意事项">
                  <div class="tips-content">
                    <ul>
                      <li v-for="(tip, index) in getTypeTips" :key="index">
                        {{ tip }}
                      </li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-card>

        <!-- 保持原有的表单内容，只添加过渡动画 -->
        <transition name="el-fade-in-linear">
          <!-- 选择题 -->
          <div v-if="optionValue === '选择题'" class="change">
            <!-- 1. 题目部分 -->
            <div class="question-section">
              <div class="section-header">
                <el-tag>题目:</el-tag>
                <span class="tip">在下面的输入框中输入题目,形如--DNS 服务器和DHCP服务器的作用是（）</span>
              </div>
              <el-input
                type="textarea"
                rows="4"
                v-model="postChange.question"
                placeholder="请输入题目内容"
                resize="none"
                class="question-input">
              </el-input>
              <!-- 添加示例展示 -->
              <div class="example-drawer">
                <el-popover
                  placement="right"
                  width="400"
                  trigger="click">
                  <template #reference>
                    <el-button type="info" text>
                      <el-icon><QuestionFilled /></el-icon>
                      查看示例
                    </el-button>
                  </template>
                  <div class="example-content">
                    <h4>选择题示例：</h4>
                    <div class="example-item">
                      <p class="question">1. 在OSI参考模型中，（）层提供端到端的可靠数据传输服务。</p>
                      <div class="options">
                        <p>A. 网络层</p>
                        <p>B. 传输层</p>
                        <p>C. 会话层</p>
                        <p>D. 应用层</p>
                      </div>
                      <p class="answer">正确答案：B</p>
                      <p class="analysis">解析：传输层负责提供端到端的可靠数据传输服务。</p>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>

            <!-- 2. 难度等级 -->
            <div class="level-section">
              <div class="section-header">
                <el-tag>难度等级:</el-tag>
              </div>
              <el-select v-model="postChange.level" placeholder="请选择难度等级">
                <el-option
                  v-for="item in levels"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <!-- 3. 选项部分 -->
            <div class="options-section">
              <div class="section-header">
                <el-tag>选项:</el-tag>
              </div>
              <ul class="options-list">
                <li v-for="(right, index) in rights" :key="index" class="option-item">
                  <el-tag type="success" class="option-label">{{ right.label }}</el-tag>
                  <el-input
                    :placeholder="'请输入选项' + right.label + '的内容'"
                    v-model="postChange['answer' + right.value]"
                    clearable>
                  </el-input>
                </li>
              </ul>
              <div class="options-actions">
                <el-button type="primary" @click="handleAdd">添加选项</el-button>
                <el-button type="danger" @click="handleMinus">删除选项</el-button>
              </div>
            </div>

            <!-- 4. 正确答案 -->
            <div class="answer-section">
              <div class="section-header">
                <el-tag>正确答案:</el-tag>
              </div>
              <el-select v-model="postChange.rightAnswer" placeholder="请选择正确答案">
                <el-option
                  v-for="right in rights"
                  :key="right.value"
                  :label="right.label"
                  :value="right.value">
                </el-option>
              </el-select>
            </div>

            <!-- 5. 解析部分 -->
            <div class="analysis-section">
              <div class="section-header">
                <el-tag>解析:</el-tag>
                <span class="tip">在下面的输入框中输入题目解析</span>
              </div>
              <el-input
                type="textarea"
                rows="4"
                v-model="postChange.analysis"
                placeholder="请输入答案解析"
                resize="none"
                class="analysis-input">
              </el-input>
            </div>

            <div class="submit-section">
              <el-button type="primary" @click="changeSubmit">立即添加</el-button>
            </div>
          </div>
        </transition>

        <transition name="el-fade-in-linear">
          <!-- 填空题 -->
          <div v-if="optionValue === '填空题'" class="change fill">
            <!-- 1. 题目部分 -->
            <div class="question-section">
              <div class="section-header">
                <el-tag>题目:</el-tag>
                <span class="tip">输入题目,形如--从计算机网络系统组成的角度看，计算机网络可以分为()和()。</span>
              </div>
              <el-input
                type="textarea"
                rows="4"
                v-model="postFill.question"
                placeholder="请输入题目内容"
                resize="none"
                class="question-input">
              </el-input>
              <!-- 添加示例展示 -->
              <div class="example-drawer">
                <el-popover
                  placement="right"
                  width="400"
                  trigger="click">
                  <template #reference>
                    <el-button type="info" text>
                      <el-icon><QuestionFilled /></el-icon>
                      查看示例
                    </el-button>
                  </template>
                  <div class="example-content">
                    <h4>填空题示例：</h4>
                    <div class="example-item">
                      <p class="question">1. 计算机网络按照规模可分为（）和（）。</p>
                      <p class="answer">正确答案：局域网、广域网</p>
                      <p class="analysis">解析：按照网络覆盖范围，计算机网络主要分为局域网(LAN)和广域网(WAN)。</p>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>

            <!-- 2. 难度等级 -->
            <div class="level-section">
              <div class="section-header">
                <el-tag>难度等级:</el-tag>
              </div>
              <el-select v-model="postFill.level" placeholder="请选择难度等级">
                <el-option
                  v-for="item in levels"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <!-- 3. 答案部分 -->
            <div class="answer-section">
              <div class="section-header">
                <el-tag>正确答案:</el-tag>
              </div>
              <el-input 
                v-model="postFill.answer"
                placeholder="请输入正确答案">
              </el-input>
            </div>

            <!-- 4. 解析部分 -->
            <div class="analysis-section">
              <div class="section-header">
                <el-tag>解析:</el-tag>
                <span class="tip">在下面的输入框中输入题目解析</span>
              </div>
              <el-input
                type="textarea"
                rows="4"
                v-model="postFill.analysis"
                placeholder="请输入答案解析"
                resize="none"
                class="analysis-input">
              </el-input>
            </div>

            <div class="submit-section">
              <el-button type="primary" @click="fillSubmit">立即添加</el-button>
            </div>
          </div>
        </transition>

        <transition name="el-fade-in-linear">
          <!-- 判断题 -->
          <div v-if="optionValue === '判断题'" class="change judge">
            <div class="question-section">
              <div class="section-header">
                <el-tag>题目:</el-tag>
                <span class="tip">在下面的输入框中输入题目</span>
              </div>
              <el-input
                type="textarea"
                rows="4"
                v-model="postJudge.question"
                placeholder="请输入题目内容"
                resize="none"
                class="question-input">
              </el-input>
              <!-- 添加示例展示 -->
              <div class="example-drawer">
                <el-popover
                  placement="right"
                  width="400"
                  trigger="click">
                  <template #reference>
                    <el-button type="info" text>
                      <el-icon><QuestionFilled /></el-icon>
                      查看示例
                    </el-button>
                  </template>
                  <div class="example-content">
                    <h4>判断题示例���</h4>
                    <div class="example-item">
                      <p class="question">1. HTTP协议是无状态的协议。（）</p>
                      <p class="answer">正确答案：正确</p>
                      <p class="analysis">解析：HTTP协议是无状态协议，每次请求都是独立的。</p>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>

            <div class="answer-section">
              <div class="section-header">
                <el-tag>正确答案:</el-tag>
              </div>
              <div class="judge-options">
                <el-radio-group v-model="postJudge.answer">
                  <el-radio label="T">正确</el-radio>
                  <el-radio label="F">错误</el-radio>
                </el-radio-group>
              </div>
            </div>

            <div class="analysis-section">
              <div class="section-header">
                <el-tag>解析:</el-tag>
                <span class="tip">在下面的输入框中输入题目解析</span>
              </div>
              <el-input
                type="textarea"
                rows="4"
                v-model="postJudge.analysis"
                placeholder="请输入答案解析"
                resize="none"
                class="analysis-input">
              </el-input>
            </div>

            <div class="level-section">
              <div class="section-header">
                <el-tag>难度等级:</el-tag>
              </div>
              <el-select v-model="postJudge.level" placeholder="请选择难度等级">
                <el-option
                  v-for="item in levels"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="submit-section">
              <el-button type="primary" @click="judgeSubmit">立即添加</el-button>
            </div>
          </div>
        </transition>
      </el-tab-pane>

      <!-- 保持原有的在线组卷部分不变 -->
    </el-tabs>
  </div>
</template>

<script>
import { createQuestion } from "../../api/questions.ts";

export default {
  name: 'AddAnswerChildren',
  data() {
    return {
      courseId: this.$route.params.id,
      paperId: this.$route.query.paperId,
      changeNumber: null, //选择题出题数量
      fillNumber: null, //填空题出题数量
      judgeNumber: null, //判断题出题数量
      activeName: 'first',  //活动选项卡
      optionValue: '选择题', //题型选中值
      options: [ //题库类型
        {
          value: '选择题',
          label: '选择题'
        },
        {
          value: '填空题',
          label: '填空题'
        },
        {
          value: '判断题',
          label: '判断题'
        },
      ],
      difficulty: [ //题难度
        {
          value: '简单',
          label: '简单'
        },
        {
          value: '一般',
          label: '一般'
        },
        {
          value: '困难',
          label: '困难'
        }
      ],
      difficultyValue: '简单',
      levels: [ //难度等级
        {
          value: '简单',
          label: '简单'
        },
        {
          value: '一般',
          label: '一般'
        },
        {
          value: '困难',
          label: '困难'
        },
      ],
      rights: [ //正确答案
        {
          value: 'A',
          label: 'A'
        },
        {
          value: 'B',
          label: 'B'
        },
      ],
      subject: '', //试卷名称用来接收路由参数
      postChange: { //选择题提交内容
        level: '', //难度等级选中值 
        rightAnswer: '', //正确答案选中值
        question: '', //题目
        analysis: '', //解析
        answerA: '',
        answerB: '',
      },
      postFill: { //填空题提交内容
        subject: '', //试卷名称
        level: '', //难度等级选中值 
        answer: '', //正确答案
        question: '', //题目
        analysis: '', //解析
      },
      postJudge: { //判断题提交内容
        level: '', //难度等级选中值 
        answer: '', //正确答案
        question: '', //题目
        analysis: '', //解析
      },
      postPaper: { //考试管理表对应字段
        paperId: null,
        questionType: null, // 试卷类型 1--选择题  2--填空题   3--判断题
        questionId: null,
      }
    };
  },
  computed: {
    // 获取当前步骤
    getStepActive() {
      if (!this.optionValue) return 1;
      const currentForm = this.getCurrentForm();
      return currentForm && currentForm.question ? 3 : 2;
    },
    // 获取当前表单
    getCurrentForm() {
      const formMap = {
        '选择题': this.postChange,
        '填空题': this.postFill,
        '判断题': this.postJudge
      };
      return formMap[this.optionValue];
    },
    // 获取题型标签类型
    getTypeTagType() {
      const typeMap = {
        '选择题': 'primary',
        '填空题': 'success',
        '判断题': 'warning'
      }
      return typeMap[this.optionValue] || 'info'
    },
    // 获取题型说明
    getTypeDescription() {
      const descMap = {
        '选择题': '从给定的选项中选择正确答案，支持单选题型。',
        '填空题': '在题目中留出空白部分，要求填写正确答案。',
        '判断题': '判断题目的正误，答案为"正确"或"错误"。'
      }
      return descMap[this.optionValue] || ''
    },
    // 获取题型提示
    getTypeAlert() {
      const alertMap = {
        '选择题': '建议：选项内容要简洁明确，避免模棱两可',
        '填空题': '建议：缺部分要适当，不宜过多或过少',
        '判断题': '建议：陈述要明确，避免使用"可能"等模糊语'
      }
      return alertMap[this.optionValue] || ''
    },
    // 获取题型图标
    getTypeIcon() {
      const iconMap = {
        '选择题': 'Select',
        '填空题': 'Edit',
        '判断题': 'Switch'
      }
      return iconMap[this.optionValue]
    },
    // 获取题型提示
    getTypeTips() {
      const tipsMap = {
        '选择题': [
          '选项内容要简洁明确，避免模棱两可',
          '选项之间要有明显区分度',
          '正确答案要唯一',
          '建议提供4-5个选项'
        ],
        '填空题': [
          '空缺部分要适当，不宜过多或过少',
          '括号要使用英文半角括号()',
          '答案要简洁明确',
          '多个空的答案用顿号、分隔'
        ],
        '判断题': [
          '陈述要明确，避免使用"可能"等模糊词语',
          '题目要有明确的对错判断',
          '避免使用过于主观的描述',
          '答案只能是"正确"或"错误"'
        ]
      }
      return tipsMap[this.optionValue] || []
    }
  },
  methods: {
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    returnBack() {
      if (this.paperId == null) {
        this.$router.push(`/questions/list/${this.courseId}`)
      } else {
        this.$router.push(`/questions/list/${this.courseId}?paperId=${this.paperId}`)
      }
    },
    handleAdd() {
      const last = this.rights[this.rights.length - 1]
      const char = String.fromCharCode(last.value.charCodeAt() + 1)
      if (char > 'Z') {
        this.$message({
          message: '选项不能超过26个',
          type: 'warning'
        })
        return
      }
      this.rights.push({
        value: char,
        label: char
      })
      this.postChange['answer' + char] = ''
    },
    handleMinus() {
      if (this.rights.length > 0) {
        this.rights.pop()
        this.postChange['answer' + this.rights[this.rights.length - 1].value] = ''
      }
    },
    getParams() {
      let paperId = this.$route.query.paperId //获取paperId
      this.paperId = paperId
      this.postPaper.paperId = paperId
    },
    // 选择题提交
    async changeSubmit() {
      try {
        // 构造选项数组
        const optionsArray = this.rights.map(right => ({
          label: right.value,
          content: this.postChange[`answer${right.value}`]
        }));

        const params = {
          courseId: Number(this.courseId),
          questionType: 'choice',
          question: this.postChange.question,
          questionLevel: this.postChange.level,
          options: JSON.stringify(optionsArray),
          explanation: this.postChange.analysis,
          answers: this.postChange.rightAnswer
        };

        const res = await createQuestion(params);
        if (res.code === 200) {
          this.$message.success('添加成功');
          this.clearForm();
          this.returnBack();
        } else {
          this.$message.error(res.message || '添加失败');
        }
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('提交失败');
      }
    },

    // 填空题提交
    async fillSubmit() {
      try {
        const params = {
          courseId: Number(this.courseId),
          questionType: 'fill',
          question: this.postFill.question,
          questionLevel: this.postFill.level,
          options: '', // 填空题无选项
          explanation: this.postFill.analysis,
          answers: this.postFill.answer
        };

        const res = await createQuestion(params);
        if (res.code === 200) {
          this.$message.success('添加成功');
          this.clearForm();
          this.returnBack();
        } else {
          this.$message.error(res.message || '添加失败');
        }
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('提交失败');
      }
    },

    // 判断题提交
    async judgeSubmit() {
      try {
        const params = {
          courseId: Number(this.courseId),
          questionType: 'judge',
          question: this.postJudge.question,
          questionLevel: this.postJudge.level,
          options: '', // 判断题无选项
          explanation: this.postJudge.analysis,
          answers: this.postJudge.answer // 'T' 或 'F'
        };

        const res = await createQuestion(params);
        if (res.code === 200) {
          this.$message.success('添加成功');
          this.clearForm();
          this.returnBack();
        } else {
          this.$message.error(res.message || '添加失败');
        }
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('提交失败');
      }
    },

    // 清空表单
    clearForm() {
      if (this.optionValue === '选择题') {
        this.postChange = {
          level: '',
          rightAnswer: '',
          question: '',
          analysis: '',
          answerA: '',
          answerB: ''
        };
      } else if (this.optionValue === '填空题') {
        this.postFill = {
          level: '',
          answer: '',
          question: '',
          analysis: ''
        };
      } else if (this.optionValue === '判断题') {
        this.postJudge = {
          level: '',
          answer: '',
          question: '',
          analysis: ''
        };
      }
    }
  }
};
</script>

<style lang="less" scoped>
.add {
  padding: 20px;
  background: var(--el-bg-color-page);

  .page-header {
    margin-bottom: 24px;
    padding: 16px 24px;
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-center {
      flex: 1;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .type-selector {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;

    .el-radio-button {
      min-width: 120px;
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }

  .type-info {
    margin-bottom: 24px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--el-box-shadow);
    }

    .type-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;

        .title {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    .type-content {
      .description-section {
        margin-bottom: 24px;

        h4 {
          margin: 0 0 12px;
          color: var(--el-text-color-primary);
          font-weight: 500;
        }

        p {
          margin: 0 0 16px;
          color: var(--el-text-color-regular);
          line-height: 1.6;
        }
      }

      .example-section {
        background: var(--el-fill-color-light);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          h4 {
            margin: 0;
          }
        }

        .example-item {
          .question {
            font-weight: 500;
            margin-bottom: 12px;
            color: var(--el-text-color-primary);
          }

          .options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 8px;
            margin-bottom: 12px;

            .option {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px;
              background: var(--el-bg-color);
              border-radius: 4px;
            }
          }

          .answer {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px dashed var(--el-border-color-lighter);
          }
        }
      }

      .tips-section {
        .tips-content {
          ul {
            margin: 0;
            padding-left: 20px;

            li {
              color: var(--el-text-color-regular);
              margin-bottom: 8px;
              line-height: 1.6;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }
  }

  .question-content {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 24px;
    box-shadow: var(--el-box-shadow-light);
  }

  .form-section {
    margin-bottom: 24px;
    padding: 16px;
    background: var(--el-fill-color-light);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: var(--el-box-shadow-light);
    }
  }

  .example-questions {
    margin-top: 16px;
    
    .example-content {
      padding: 16px;
      
      h4 {
        margin: 0 0 12px;
        color: var(--el-text-color-primary);
      }

      ul {
        padding-left: 20px;
        margin: 0;
        
        li {
          margin-bottom: 8px;
          color: var(--el-text-color-regular);
        }
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.w150 {
  width: 150px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    padding: 16px;

    .header-center {
      width: 100%;
    }
  }

  .type-selector {
    .el-radio-button {
      min-width: auto;
    }
  }

  .add {
    padding: 12px;
    
    .question-content {
      padding: 16px;
    }

    .form-section {
      padding: 12px;
    }

    .el-col {
      width: 100%;
      margin-bottom: 16px;
    }
  }
}

/* 添加过渡动画 */
.el-fade-in-linear-enter-active,
.el-fade-in-linear-leave-active {
  transition: all 0.3s ease;
}

.el-fade-in-linear-enter-from,
.el-fade-in-linear-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.change {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);

  .question-section,
  .options-section,
  .analysis-section {
    margin-bottom: 24px;
    padding: 16px;
    background: var(--el-fill-color-light);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: var(--el-box-shadow-light);
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .tip {
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }

  .options-list {
    list-style: none;
    padding: 0;
    margin: 0 0 16px;

    .option-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      padding: 8px;
      background: var(--el-bg-color);
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateX(4px);
      }

      .option-label {
        min-width: 32px;
        text-align: center;
      }
    }
  }

  .options-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .submit-section {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

/* 响应式处理 */
@media (max-width: 768px) {
  .change {
    padding: 16px;

    .option-item {
      flex-direction: column;
      align-items: stretch;

      .option-label {
        margin-bottom: 8px;
      }
    }
  }
}
</style>