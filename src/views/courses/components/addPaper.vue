<!-- 添加考试 -->
<template>

  <section class="add">
    <h3>添加试卷</h3>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="试卷名称">
        <el-input v-model="form.paperName"></el-input>
      </el-form-item>
      <el-form-item label="介绍">
        <el-input v-model="form.paperDescription"></el-input>
      </el-form-item>
      <el-form-item label="考试开始时间">
        <el-col :span="11">
          <el-date-picker placeholder="选择日期" v-model="form.startTime" style="width: 100%;"
                          type="datetime"
                          format="YYYY-MM-DD HH:mm:ss"
                          value-format="YYYY-MM-DD HH:mm:ss"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="考试结束时间">
        <el-col :span="11">
          <el-date-picker placeholder="选择日期" v-model="form.endTime" style="width: 100%;"
                          type="datetime"
                          format="YYYY-MM-DD HH:mm:ss"
                          value-format="YYYY-MM-DD HH:mm:ss"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">立即创建</el-button>
        <el-button type="text" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import {createPaper} from "../../../api/paper.ts";
import {ElMessage} from "element-plus";

export default {
  name: "CreatePaper",
  props: {
    courseId:{
      type: String,
      required: true,
    }
  },
  data() {
    return {
      form: { //表单数据初始化
        paperName: null,
        paperDescription: null,
        startTime: null,
        endTime: null
      }
    };
  },
  methods: {
    onSubmit() {
      // let examDate = this.formatTime(this.form.examDate)
      // this.form.examDate = examDate.substr(0,10)
      this.form.courseId = parseInt(this.courseId)
      createPaper(this.form).then(res => {
        if(res.code === 200) {
          ElMessage.success('添加成功')
          this.$router.push({path: `/courses`})
        } else {
          ElMessage.error('添加失败')
        }
      })
    },
    cancel() { //取消按钮
      this.$router.push({path: `/courses`})
    },
    
  }
};
</script>
<style lang="less" scoped>
.add {
  padding: 0px 40px;
  width: 400px;
}
</style>

