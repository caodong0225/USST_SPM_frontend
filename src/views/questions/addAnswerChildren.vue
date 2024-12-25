// 添加题库
<template>
  <div class="add">
    <el-tabs v-model="activeName" class="question-tabs">
      <el-tab-pane name="first">
        <template #label>
          <div class="tab-label">
            <el-icon>
              <Plus />
            </el-icon>
            <span>添加试题</span>
          </div>
        </template>
        <div class="tab-header">
          <el-button @click="returnBack">
            <el-icon>
              <Back />
            </el-icon>返回
          </el-button>
        </div>
        <section class="append">
          <ul class="form-header">
            <li>
              <span>题目类型:</span>
              <el-select v-model="optionValue" placeholder="请选择题型" class="w150">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li v-if="optionValue == '选择题'">
              <span>难度等级:</span>
              <el-select v-model="postChange.level" placeholder="选择难度等级" class="w150">
                <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li v-if="optionValue == '填空题'">
              <span>难度等级:</span>
              <el-select v-model="postFill.level" placeholder="选择难度等级" class="w150">
                <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li v-if="optionValue == '判断题'">
              <span>难度等级:</span>
              <el-select v-model="postJudge.level" placeholder="选择难度等级" class="w150">
                <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li v-if="optionValue == '选择题'">
              <span>正确选项:</span>
              <el-select v-model="postChange.rightAnswer" placeholder="选择正确答案" class="w150">
                <el-option v-for="item in rights" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
          </ul>
          <!-- 选择题部分 -->
          <div class="change" v-if="optionValue == '选择题'">
            <div class="title">
              <div class="section-header">
                <el-tag type="primary" size="large">题目</el-tag>
                <el-tooltip content="在下面的输入框中输入题目,形如--DNS 服务器和DHCP服务器的作用是（）" placement="right">
                  <el-icon>
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
              <el-input type="textarea" rows="4" v-model="postChange.question" placeholder="请输入题目内容" resize="none"
                class="answer">
              </el-input>
              <div class="example-questions">
                <p class="example-title">示例题目：</p>
                <ul>
                  <li>在OSI参考模型中，（）层提供端到端的可靠数据传输服务。</li>
                  <li>以下关于Java中重载(Overload)的说法，错误的是（）。</li>
                  <li>在软件开发过程中，需求分析阶段的主要任务是（）。</li>
                </ul>
              </div>
            </div>
            <div class="options">
              <div class="section-header">
                <el-tag type="success" size="large">选项</el-tag>
              </div>
              <ul>
                <li v-for="(right, index) in rights" :key="index">
                  <el-tag type="success">{{ right.label }}</el-tag>
                  <el-input :placeholder="'请输入选项' + right.label + '的内容'" v-model="postChange['answer' + right.value]"
                    clearable="">
                  </el-input>
                </li>
              </ul>
              <div class="option-actions">
                <el-button type="primary" @click="handleAdd">
                  <el-icon>
                    <Plus />
                  </el-icon>添加选项
                </el-button>
                <el-button type="danger" @click="handleMinus">
                  <el-icon>
                    <Minus />
                  </el-icon>删除选项
                </el-button>
              </div>
            </div>
            <div class="title">
              <el-tag>解析:</el-tag>
              <span>在下面的输入框中输入题目解析</span>
              <el-input type="textarea" rows="4" v-model="postChange.analysis" placeholder="请输入答案解析" resize="none"
                class="answer">
              </el-input>
            </div>
            <div class="submit">
              <el-button type="primary" @click="changeSubmit()">立即添加</el-button>
            </div>
          </div>
          <!-- 填空题部分 -->
          <div class="change fill" v-if="optionValue == '填空题'">
            <div class="title">
              <div class="section-header">
                <el-tag type="primary" size="large">题目</el-tag>
                <el-tooltip content="输入题目,形如--从计算机网络系统组成的角度看，计算机网络可以分为()和()。注意需要考生答题部分一定要用括号（英文半角）括起来。"
                  placement="right">
                  <el-icon>
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
              <el-input type="textarea" rows="4" v-model="postFill.question" placeholder="请输入题目内容" resize="none"
                class="answer">
              </el-input>
              <div class="example-questions">
                <p class="example-title">示例题目：</p>
                <ul>
                  <li>计算机网络按照规模可分为（）和（）。</li>
                  <li>Java中的基本数据类型包括（）、（）、（）等。</li>
                </ul>
              </div>
            </div>
            <div class="fillAnswer">
              <el-tag>正确答案:</el-tag>
              <el-input v-model="postFill.answer"></el-input>
            </div>
            <div class="title analysis">
              <el-tag type="success">解析:</el-tag>
              <span>下方输入框中输入答案解析</span>
              <el-input type="textarea" rows="4" v-model="postFill.analysis" placeholder="请输入答案解析" resize="none"
                class="answer">
              </el-input>
            </div>
            <div class="submit">
              <el-button type="primary" @click="fillSubmit()">立即添加</el-button>
            </div>
          </div>
          <!-- 判断题 -->
          <div class="change judge" v-if="optionValue === '判断题'">
            <div class="title">
              <div class="section-header">
                <el-tag type="primary" size="large">题目</el-tag>
                <el-tooltip content="在下面的输入框中输入题目" placement="right">
                  <el-icon>
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
              <el-input type="textarea" rows="4" v-model="postJudge.question" placeholder="请输入题目内容" resize="none"
                class="answer">
              </el-input>
              <div class="example-questions">
                <p class="example-title">示例题目：</p>
                <ul>
                  <li>Java中的接口可以包含默认方法实现。（）</li>
                  <li>HTTP协议是无状态的协议。（）</li>
                </ul>
              </div>
            </div>
            <div class="judgeAnswer">
              <el-radio v-model="postJudge.answer" label="T">正确</el-radio>
              <el-radio v-model="postJudge.answer" label="F">错误</el-radio>
            </div>
            <div class="title">
              <el-tag>解析:</el-tag>
              <span>在下面的输入框中输入题目解析</span>
              <el-input type="textarea" rows="4" v-model="postJudge.analysis" placeholder="请输入答案解析" resize="none"
                class="answer">
              </el-input>
            </div>
            <div class="submit">
              <el-button type="primary" @click="judgeSubmit()">立即添加</el-button>
            </div>
          </div>
        </section>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"><i class="iconfont icon-daoru-tianchong"></i>在线组卷</span>
        <div class="box">
          <ul>
            <li>
              <span>试题难度:</span>
              <el-select v-model="difficultyValue" placeholder="试题难度" class="w150">
                <el-option v-for="item in difficulty" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li>
              <span>选择题数量：</span>
              <el-input type="text" v-model="changeNumber"></el-input>
            </li>
            <li>
              <span>填空题数量：</span>
              <el-input type="text" v-model="fillNumber"></el-input>
            </li>
            <li>
              <span>判断题数量：</span>
              <el-input type="text" v-model="judgeNumber"></el-input>
            </li>
            <li>
              <el-button type="primary" @click="create()">立即组卷</el-button>
            </li>
          </ul>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { createQuestion } from "../../api/questions.ts";
import { useRoute } from "vue-router";
import { ref } from "vue";

export default {
  name: 'AddAnswerChildren',
  setup() {
    const route = useRoute(); // 获取当前路由信息
    const courseId = route.params.id?.toString() || ''; // 从路由参数解析 id
    const paperId = route.params.paperId?.toString || null
    return {
      courseId,
      paperId
    }
  },
  data() {
    return {
      changeNumber: null, //选择题出题数量
      fillNumber: null, //填空题出题数量
      judgeNumber: null, //判断题出题数量
      activeName: 'first',  //活动选项卡
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
      difficulty: [ //试题难度
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
      optionValue: '选择题', //题型选中值
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
  created() {
    this.getParams()
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
    changeSubmit() { //选择题题库提交
      const options = {}
      for (let key in this.postChange) {
        if (key.startsWith('answer')) {
          options[key] = this.postChange[key]
        }
      }
      const createCourse = {}
      createCourse.options = JSON.stringify(options)
      createCourse.questionLevel = this.postChange.level
      createCourse.questionType = "choice"
      createCourse.courseId = this.courseId
      createCourse.question = this.postChange.question
      createCourse.explanation = this.postChange.analysis === "" ? this.postChange.analysis : null
      createCourse.answers = this.postChange.rightAnswer
      createQuestion(createCourse).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.clearData()
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
      })
    },
    fillSubmit() { //填空题提交
      const createCourse = {}
      createCourse.questionLevel = this.postFill.level
      createCourse.questionType = "fill"
      createCourse.courseId = this.courseId
      createCourse.question = this.postFill.question
      createCourse.explanation = this.postFill.analysis === "" ? this.postFill.analysis : null
      createCourse.answers = this.postFill.answer
      createQuestion(createCourse).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.clearData()
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
      })
    },
    judgeSubmit() { //判断题提交
      const createCourse = {}
      createCourse.questionLevel = this.postJudge.level
      createCourse.questionType = "judge"
      createCourse.courseId = this.courseId
      createCourse.question = this.postJudge.question
      createCourse.explanation = this.postJudge.analysis === "" ? this.postJudge.analysis : null
      createCourse.answers = this.postJudge.answer
      createQuestion(createCourse).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.clearData()
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
      })
    },
    clearData() {
      this.postChange = { //选择题提交内容
        level: '', //难度等级选中值
        rightAnswer: '', //正确答案选中值
        question: '', //题目
        analysis: '', //解析
        answerA: '',
        answerB: '',
      };
      this.postFill = { //填空题提交内容
        subject: '', //试卷名称
        level: '', //难度等级选中值
        answer: '', //正确答案
        question: '', //题目
        analysis: '', //解析
      };
      this.postJudge = { //判断题提交内容
        level: '', //难度等级选中值
        answer: '', //正确答案
        question: '', //题目
        analysis: '', //解析
      };
    }
  },
};
</script>

<style lang="less" scoped>
.add {
  margin: 0px 40px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);

  .question-tabs {
    .tab-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .box {
    padding: 0px 20px;

    ul li {
      margin: 10px 0px;
      display: flex;
      align-items: center;

      .el-input {
        width: 6%;
      }

      .w150 {
        margin-left: 20px;
        width: 7%;
      }
    }
  }

  .el-icon-circle-plus {
    margin-right: 10px;
  }

  .icon-daoru-tianchong {
    margin-right: 10px;
  }

  .append {
    margin: 0px 20px;

    ul {
      display: flex;
      align-items: center;

      li {
        margin-right: 20px;
      }
    }

    .change {
      margin-top: 20px;
      padding: 20px 16px;
      background-color: var(--el-bg-color-page);
      border-radius: 4px;

      .title {
        padding-left: 6px;
        color: #2f4f4f;

        span:nth-child(1) {
          margin-right: 6px;
        }

        .answer {
          margin: 20px 0px 20px 8px;
        }

        .el-textarea {
          width: 98% !important;
        }
      }

      .example-questions {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--el-fill-color-lighter);
        border-radius: 4px;

        .example-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--el-text-color-secondary);
        }

        ul {
          list-style: disc;
          margin-left: 1.5rem;

          li {
            margin-bottom: 0.5rem;
            color: var(--el-text-color-regular);
          }
        }
      }

      .options {
        ul {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .option-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
      }

      .submit {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .fill {
      .fillAnswer {
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          margin-right: 6px;
        }

        .el-input {
          width: 91% !important;
        }
      }

      .analysis {
        margin-top: 20px;
        margin-left: 5px;
      }
    }

    .judge {
      .judgeAnswer {
        margin-left: 20px;
        margin-bottom: 20px;
      }
    }

    .w150 {
      width: 150px;
    }

    li:nth-child(2) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
