<!--考生答题界面-->
<template>
  <h3>题库管理</h3>
  <div id="answer">
    <!--顶部信息栏-->
    <div class="flexarea">
      <!--左边题目编号区-->
      <transition name="slider-fade">
        <div class="left" v-if="slider_flag">
          <div class="l-top">
            <el-button icon="plus" type="primary" @click="addQuestion">
              添加题目
            </el-button>
            <el-button icon="minus" type="danger" @click="deleteQuestion" :disabled="examData.length === 0">
              删除本题
            </el-button>
          </div>
          <div class="l-bottom">
            <div class="item">
              <p>选择题部分</p>
              <ul>
                <li v-for="(list, index1) in topic[1]" :key="index1">
                  <a href="javascript:;"
                     @click="change(index1)"
                     :class="{'border': index == index1 && currentType === 1,'bg': bg_flag && topic[1][index1].isClick == true}">
                    <span :class="{'mark': topic[1][index1].isMark === true}"></span>
                    {{ list.id }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="item">
              <p>填空题部分</p>
              <ul>
                <li v-for="(list, index2) in topic[2]" :key="index2">
                  <a href="javascript:;" @click="fill(index2)"
                     :class="{'border': index == index2 && currentType == 2,'bg': fillAnswer[index2][3] == true}"><span
                      :class="{'mark': topic[2][index2].isMark == true}"></span>{{ list.id }}</a>
                </li>
              </ul>
            </div>
            <div class="item">
              <p>判断题部分</p>
              <ul>
                <li v-for="(list, index3) in topic[3]" :key="index3">
                  <a href="javascript:;" @click="judge(index3)"
                     :class="{'border': index == index3 && currentType == 3,'bg': bg_flag && topic[3][index3].isClick == true}"><span
                      :class="{'mark': topic[3][index3].isMark == true}"></span>{{ list.id }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
      <!--右边选择答题区-->
      <transition name="slider-fade">
        <div class="right">
          <div class="title">
            <p>{{ title }}</p>
            <i class="iconfont icon-right auto-right"></i>
            <span>共{{ examData.length }}题  <i class="iconfont icon-time"></i></span>
            <span v-if="paperId != null">已选择{{selectedNum}}题</span>
          </div>
          <div class="content" v-if="examData.length > 0">
            <p class="topic"><span class="number">{{ number }}</span>{{ showQuestion.questionName }}</p>
            <div v-if="currentType === 1">
              <el-radio-group v-model="radio[index]">
                <el-radio v-for="(list, indexS) in showAnswer" :label="indexS" :value="indexS">
                  {{ indexS.toString().substring(6) }}:{{ list }}
                </el-radio>
              </el-radio-group>
              <div class="analysis">
                <ul>
                  <li>
                    <el-tag type="success">正确答案：</el-tag>
                    <span class="right">{{ showQuestion.answers }}</span></li>
                  <li>
                    <el-tag>题目解析：</el-tag>
                  </li>
                  <li>{{ showQuestion.explanation == null ? '暂无解析' : showQuestion.explanation }}</li>
                </ul>
              </div>
            </div>
            <div class="fill" v-if="currentType === 2">
              <div class="analysis">
                <ul>
                  <li>
                    <el-tag type="success">正确答案：</el-tag>
                    <span class="right">{{ topic[2][index].answers }}</span></li>
                  <li>
                    <el-tag>题目解析：</el-tag>
                  </li>
                  <li>{{ topic[2][index].explanation == null ? '暂无解析' : topic[2][index].explanation }}</li>
                </ul>
              </div>
            </div>
            <div class="judge" v-if="currentType === 3">
              <el-radio-group v-model="judgeAnswer[index]" v-if="currentType === 3">
                <el-radio :label="1">正确</el-radio>
                <el-radio :label="2">错误</el-radio>
              </el-radio-group>
              <div class="analysis">
                <ul>
                  <li>
                    <el-tag type="success">正确答案：</el-tag>
                    <span class="right">{{ topic[3][index]?.answers }}</span></li>
                  <li>
                    <el-tag>题目解析：</el-tag>
                  </li>
                  <li>{{ topic[3][index].explanation == null ? '暂无解析' : topic[3][index].explanation }}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="operation" v-if="examData.length>0">
            <ul class="end">
              <li @click="previous()"><i class="iconfont icon-previous"></i><span>上一题</span></li>
              <div v-if="paperId!=null">
                <li @click="mark()" v-if="!this.topic[this.currentType][this.index]['isMark']"><i
                    class="iconfont icon-mark-o"></i><span>选择题目</span></li>
                <li @click="unmark()" v-else><i class="iconfont icon-mark-o"></i><span>取消选择</span></li>
              </div>
              <li @click="next()"><span>下一题</span><i class="iconfont icon-next"></i></li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import {deleteQuestion, getQuestionList} from "../../api/questions.ts";
import {ElMessage} from "element-plus";
import {addPaperQuestion, deletePaperQuestion, getAddedQuestions} from "../../api/paper.ts";

export default {
  name: "manageQuestion",
  data() {
    return {
      reduceAnswer: [],  //vue官方不支持3层以上数据嵌套,如嵌套则会数据渲染出现问题,此变量直接接收3层嵌套时的数据。
      answerScore: 0, //答题总分数
      bg_flag: false, //已答标识符,已答改变背景色
      isFillClick: false, //选择题是否点击标识符
      slider_flag: true, //左侧显示隐藏标识符
      flag: false, //个人信息显示隐藏标识符
      currentType: 1, //当前题型类型  1--选择题  2--填空题  3--判断题
      selectedNum: 0,
      radio: [], //保存考生所有选择题的选项
      title: "题目列表",
      index: 0, //全局index
      topicCount: [],//每种类型题目的总数
      score: [],  //每种类型分数的总数
      examData: { //考试信息
        // source: null,
        // totalScore: null,
      },
      topic: {  //试卷信息
        1: [],
        2: [],
        3: []
      },
      showQuestion: [], //当前显示题目信息
      showAnswer: {}, //当前题目对应的答案选项
      number: 1, //题号
      part: null, //填空题的空格数量
      fillAnswer: [[]], //二维数组保存所有填空题答案
      judgeAnswer: [], //保存所有判断题答案
      topic1Answer: [],  //学生选择题作答编号,
      rightAnswer: ''
    }
  },
  setup() {
    const route = useRoute(); // 获取当前路由信息
    const courseId = route.params.id?.toString() || ''; // 从路由参数解析 id
    const paperId = route.query?.paperId || null // 从路由参数解析 paperId
    return {
      courseId,
      paperId
    }
  },
  created() {
    this.getExamData()
    if (this.paperId != null) {
      this.getAddedData(this.paperId)
    }
  },
  methods: {
    mark() { //标记功能
      addPaperQuestion(this.paperId, {"questionId": this.topic[this.currentType][this.index].id}).then(res => {
        if (res.code === 200) {
          ElMessage.success('添加成功')
          this.topic[this.currentType][this.index]["isMark"] = true //标记
          this.selectedNum++;
        } else {
          ElMessage.error(res.message)
        }
      }).catch(error => {
        ElMessage.error("添加失败")
      })
    },
    unmark() { //取消标记
      deletePaperQuestion(this.paperId, this.topic[this.currentType][this.index].id).then(res => {
        if (res.code === 200) {
          ElMessage.success('删除成功')
          this.topic[this.currentType][this.index]["isMark"] = false //取消标记
          this.selectedNum--;
        } else {
          ElMessage.error(res.message)
        }
      }).catch(error => {
        ElMessage.error("删除失败")
      })
    },
    deleteQuestion() {
      deleteQuestion(this.topic[this.currentType][this.index].id).then(res => {
        if (res.code === 200) {
          ElMessage.success('删除成功')
          this.topic = {  //试卷信息
            1: [],
            2: [],
            3: []
          }
          this.getExamData()
        } else {
          ElMessage.error('删除失败')
        }
      }).catch(error => {
        ElMessage.error("删除失败")
      })
    },
    addQuestion() {
      // 页面跳转
      if(this.paperId != null) {
        this.$router.push(`/questions/${this.courseId}?paperId=${this.paperId}`)
      } else {
        this.$router.push(`/questions/${this.courseId}`)
      }
    },
    getAddedData(paperId) {
      getAddedQuestions(paperId).then(res => {
        if (res.code === 200) {
          this.selectedNum = res.data.length
          for (let j = 0; j < res.data.length; j++) {
            for (let k = 1; k <= 3; k++) {
              for (let i = 0; i < this.topic[k].length; i++) {
                if (res.data[j].questionId === this.topic[k][i].id) {
                  this.topic[k][i]["isMark"] = true
                }
              }
            }
          }
        } else {
          ElMessage.error(res.message)
        }
      }).catch(error => {
        ElMessage.error("请求失败")
      })
    },
    getExamData() { //获取当前试卷所有信息
      getQuestionList(parseInt(this.courseId)).then(res => {
        this.examData = res.data //获取考试详情
        for (let i = 0; i < this.examData.length; i++) {
          if (this.examData[i].questionType === 'choice') {
            this.topic[1].push(this.examData[i])
          } else if (this.examData[i].questionType === 'fill') {
            this.topic[2].push(this.examData[i])
          } else if (this.examData[i].questionType === 'judge') {
            this.topic[3].push(this.examData[i])
          }
          if (this.topic[1].length > 0) {
            this.change(0);
          } else if (this.topic[2].length > 0) {
            this.fill(0);
          } else if (this.topic[3].length > 0) {
            this.judge(0);
          }
        }
      })
      // this.$axios(`/api/exam/${examCode}`).then(res => {  //通过examCode请求试卷详细信息
      //   this.examData = { ...res.data.data} //获取考试详情
      //   this.index = 0
      //   this.time = this.examData.totalScore //获取分钟数
      //   let paperId = this.examData.paperId
      //   this.$axios(`/api/paper/${paperId}`).then(res => {  //通过paperId获取试题题目信息
      //     this.topic = {...res.data}
      //     let reduceAnswer = this.topic[1][this.index]
      //     this.reduceAnswer = reduceAnswer
      //     let keys = Object.keys(this.topic) //对象转数组
      //     keys.forEach(e => {
      //       let data = this.topic[e]
      //       this.topicCount.push(data.length)
      //       let currentScore = 0
      //       for(let i = 0; i< data.length; i++) { //循环每种题型,计算出总分
      //         currentScore += data[i].score
      //       }
      //       this.score.push(currentScore) //把每种题型总分存入score
      //     })
      //     let len = this.topicCount[1]
      //     let father = []
      //     for(let i = 0; i < len; i++) { //根据填空题数量创建二维空数组存放每道题答案
      //       let children = [null,null,null,null]
      //       father.push(children)
      //     }
      //     this.fillAnswer = father
      //     let dataInit = this.topic[1]
      //     this.number = 1
      //     this.showQuestion = dataInit[0].question
      //     this.showAnswer = dataInit[0]
      //   })
      // })
    },
    change(index) { //选择题
      this.index = index
      this.isFillClick = true
      this.currentType = 1
      let len = this.topic[1].length
      if (this.index < len) {
        if (this.index <= 0) {
          this.index = 0
        }
        console.log(`总长度${len}`)
        console.log(`当前index:${index}`)
        this.title = "选择题"
        let Data = this.topic[1]
        this.showQuestion = Data[this.index]
        this.showAnswer = JSON.parse(Data[this.index].questionOptions)
        this.number = this.index + 1
      } else if (this.index >= len) {
        this.index = 0
        this.fill(this.index)
      }
    },
    fill(index) { //填空题
      let len = this.topic[2].length
      this.currentType = 2
      this.index = index
      if (index < len) {
        if (index < 0) {
          index = this.topic[1].length - 1
          this.change(index)
        } else {
          console.log(`总长度${len}`)
          console.log(`当前index:${index}`)
          this.title = "填空题"
          let Data = this.topic[2]
          console.log(Data)
          this.showQuestion = Data[this.index] //获取题目信息
          this.number = index + 1
        }
      } else if (index >= len) {
        this.index = 0
        this.judge(this.index)
      }
    },
    judge(index) { //判断题
      let len = this.topic[3].length
      this.currentType = 3
      this.index = index
      if (this.index < len) {
        if (this.index < 0) {
          this.index = this.topic[2].length - 1
          this.fill(this.index)
        } else {
          console.log(`总长度${len}`)
          console.log(`当前index:${this.index}`)
          this.title = "判断题"
          let Data = this.topic[3]
          console.log(Data)
          this.showQuestion = Data[index] //获取题目信息
          this.number = index + 1
        }
      } else if (this.index >= len) {
        this.index = 0
        this.change(this.index)
      }
    },
    previous() { //上一题
      this.index--
      switch (this.currentType) {
        case 1:
          this.change(this.index)
          break
        case 2:
          this.fill(this.index)
          break
        case 3:
          this.judge(this.index)
          break
      }
    },
    next() { //下一题
      this.index++
      switch (this.currentType) {
        case 1:
          this.change(this.index)
          break
        case 2:
          this.fill(this.index)
          break
        case 3:
          this.judge(this.index)
          break
      }
    },
  },
}
</script>

<style lang="less">
.iconfont.icon-time {
  color: #2776df;
  margin: 0px 6px 0px 20px;
}

.analysis {
  margin-top: 20px;

  .right {
    color: #2776df;
    font-size: 18px;
    border: 1px solid #2776df;
    padding: 0px 6px;
    border-radius: 4px;
    margin-left: 20px;
  }

  ul li:nth-child(2) {
    margin: 20px 0px;
  }

  ul li:nth-child(3) {
    padding: 10px;
    background-color: #d3c6c9;
    border-radius: 4px;
  }
}

.analysis span:nth-child(1) {
  font-size: 18px;
}

.mark {
  position: absolute;
  width: 4px;
  height: 4px;
  content: "";
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 22px;
}

.border {
  position: relative;
  border: 1px solid #FF90AA !important;
}

.bg {
  background-color: #5188b8 !important;
}

.fill .el-input {
  display: inline-flex;
  width: 150px;
  margin-left: 20px;

  .el-input__inner {
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
  }
}

/* slider过渡效果 */
.slider-fade-enter-active {
  transition: all .3s ease;
}

.slider-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slider-fade-enter, .slider-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.operation .end li:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(39, 118, 223);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #fff;
}

.operation .end li {
  cursor: pointer;
  margin: 0 100px;
}

.operation {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 0px;
  margin-right: 10px;
}

.operation .end {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(39, 118, 223);
}

.content .number {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: rgb(39, 118, 223);
  border-radius: 4px;
  margin-right: 4px;
}

.content {
  padding: 0px 20px;
}

.content .topic {
  padding: 20px 0px;
  padding-top: 30px;
}

.right .content {
  background-color: #fff;
  margin: 10px;
  margin-left: 0px;
  height: 470px;
}

.content .el-radio-group label {
  color: #000;
  margin: 5px 0px;
}

.content .el-radio-group {
  display: flex;
  flex-direction: column;
}

.right .title p {
  margin-left: 20px;
}

.flexarea {
  display: flex;
}

.flexarea .right {
  flex: 1;
}

.auto-right {
  margin-left: auto;
  color: #2776df;
  margin-right: 10px;
}

.right .title {
  margin-right: 10px;
  padding-right: 30px;
  display: flex;
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
}

.clearfix {
  clear: both;
}

.l-bottom .final {
  cursor: pointer;
  display: inline-block;
  text-align: center;
  background-color: rgb(39, 118, 223);
  width: 240px;
  margin: 20px 0px 20px 10px;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  margin-top: 22px;
}

#answer .left .item {
  padding: 0px;
  font-size: 16px;
}

.l-bottom {
  border-radius: 4px;
  background-color: #fff;
}

.l-bottom .item p {
  margin-bottom: 15px;
  margin-top: 10px;
  color: #000;
  margin-left: 10px;
  letter-spacing: 2px;
}

.l-bottom .item li {
  width: 15%;
  margin-left: 5px;
  margin-bottom: 10px;
}

.l-bottom .item {
  display: flex;
  flex-direction: column;
}

.l-bottom .item ul {
  width: 100%;
  margin-bottom: -8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.l-bottom .item ul li a {
  position: relative;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #eee;
  text-align: center;
  color: #000;
  font-size: 16px;
}

.left .l-top {
  display: flex;
  justify-content: space-around;
  padding: 16px 0px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}

.left {
  width: 260px;
  height: 100%;
  margin: 10px 10px 0px 10px;
}

.left .l-top li:nth-child(2) a {
  border: 1px solid #eee;
}

.left .l-top li:nth-child(3) a {
  background-color: #5188b8;
  border: none;
}

.left .l-top li:nth-child(4) a {
  position: relative;
  border: 1px solid #eee;
}

.left .l-top li:nth-child(4) a::before {
  width: 4px;
  height: 4px;
  content: " ";
  position: absolute;
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 16px;
}

.left .l-top li {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.left .l-top li a {
  display: inline-block;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #FF90AA;
}

#answer .top {
  background-color: rgb(39, 118, 223);
}

#answer .item {
  color: #fff;
  display: flex;
  padding: 20px;
  font-size: 20px;
}

#answer .top .item li:nth-child(1) {
  margin-right: 10px;
}

#answer .top .item li:nth-child(3) {
  position: relative;
  margin-left: auto;
}

#answer {
  padding-bottom: 30px;
}

.icon20 {
  font-size: 20px;
  font-weight: bold;
}

.item .msg {
  padding: 10px 15px;
  border-radius: 4px;
  top: 47px;
  right: -30px;
  color: #6c757d;
  position: absolute;
  border: 1px solid rgba(0, 0, 0, .15);
  background-color: #fff;
}

.item .msg p {
  font-size: 16px;
  width: 200px;
  text-align: left;
}
</style>
