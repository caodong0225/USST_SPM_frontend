<template>
  <div id="message">
    <div class="title" v-if = "isAdmin">创建公告</div>
    <div class="title" v-else>公告列表</div>
    <div class="wrapper">
      <div class="title1" v-if = "isAdmin">
        <el-input
          placeholder="公告标题"
          v-model="title"
          clearable>
        </el-input>
      </div>
      <div class="content" v-if = "isAdmin">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="公告内容"
          v-model="content"
          clearable>
        </el-input>
      </div>
      <div class="btn" v-if = "isAdmin">
        <el-button type="primary" @click="submit()">发布公告</el-button>
      </div>
      <div class="all">
        <ul class="msglist">
          <li class="list" 
          @mouseenter="enter(index)" 
          @mouseleave="leave(index)"
          v-for="(data,index) in msg" :key="index"
          >
            <p class="title"> <i class="iconfont icon-untitled33"></i>{{data.title}}</p>
            <p class="content">{{data.content}}</p>
            <p class="date"><i class="iconfont icon-date"></i>{{data.time}}</p>
<!--            <div v-for="(replayData,index2) in data.replays" :key="index2">-->
<!--              <p class="comment"><i class="iconfont icon-huifuxiaoxi"></i>{{replayData.replay}}</p>-->
<!--            </div>-->
<!--            <span class="replay" @click="replay(data.id)" v-if="flag && index == current">Comment</span>-->
          </li>
        </ul>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[4,6,8,10]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {createAnnouncement, fetchCourseAnnouncement} from "../../../api/announcement.ts";
import {ElMessage} from "element-plus";
import {ref} from "vue";
import {useUserInfoStore} from "../../../store/index.ts";

export default {
  name: 'CreateAnnouncement',
  props: {
    courseId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      flag: false,
      current: 0,
      title: "",
      content: "",
      pagination: { //分页后的留言列表
        current: 1, //当前页
        total: null, //记录条数
        size: 4 //每页条数
      },
      msg: []
    }
  },
  methods: {
    getMsg() {
      fetchCourseAnnouncement(this.courseId,this.pagination.current,this.pagination.size).then(res => {
        if(res.code === 200) {
          this.msg = res.data.records
          this.pagination = res.data.pages
        }
      })
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val
      this.getMsg()
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getMsg()
    },
    // formatTime(date) { //日期格式化
    //   let year = date.getFullYear()
    //   let month= date.getMonth()+ 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    //   let day=date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    //   let hours=date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    //   let minutes=date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    //   let seconds=date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    //   // 拼接
    //   return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    // },
    submit() {
      if(this.title.length == 0 || this.content.length == 0) { //非空判断
        ElMessage.error("公告标题或内容不能为空")
       } else {
        createAnnouncement(this.courseId,{title:this.title,content:this.content}).then(res => {
          ElMessage.success("公告发布成功")
        })
    }
      this.title = ""
      this.content = ""
      this.getMsg()
    },
    enter(index) {
      this.flag = true
      this.current = index
    },
    leave(index) {
      this.flag = false;
      this.current = index;
    }
  },
  created() {
    this.getMsg()
  },
  setup() {
    const isAdmin = ref(false);
    const userInfoStore = useUserInfoStore();
    if (userInfoStore.userInfo.role > 0) {
      isAdmin.value = true;
    }
    return {
      isAdmin
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  display: flex;
  justify-content: center;
}
#message {
  width: 980px;
  margin: 0 auto;
}
.title {
  margin: 20px;
}
.content {
  padding: 20px 0px;
}
#message  {
  .btn {
   padding-bottom: 20px;
  }
  .all {
    .date {
      color: rgb(80, 157, 202);
      line-height: 45px;
      font-size: 13px;
    }
    .list {
      background-color: #eee;
      padding:10px;
      border-radius: 4px;
      margin: 10px 0px;
      position: relative;
      transition: all .3s ease;
      .title {
        color: #5f5f5f;
        margin: 0px;
        font-size: 13px;
        line-height: 30px;
      }
      .content {
        padding: 0px;
      }
      .icon-untitled33 {
        font-size: 13px;
        margin-right: 4px;
      }
      .icon-date {
        font-size: 13px;
        margin-right: 4px;
        color: rgb(80, 157, 202);
      }
      .replay {
        position: absolute;
        right: 30px;
        bottom: 15px;
        color: tomato;
        cursor: pointer;
        transition: all .3s ease;
      }
      .comment {
        margin:-7px 0px; 
        padding-bottom: 12px;
        font-size: 13px;
        color: #28b2b4;
        i {
          margin-right: 4px;
        }
      }
    }
  }
}
#message .wrapper {
  background-color: #fff;
  padding: 20px;

}
</style>
