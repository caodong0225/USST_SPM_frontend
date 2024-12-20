<template>
  <main class="course-container">
    <header class="course-header">
      <nav class="navigation">
        <button class="back-button" @click="goBack" tabindex="0">&lt;返回</button>
        <h1 class="course-title">{{courseInfo?.course.courseName}}</h1>
      </nav>
      <section class="instructor-section">
        <h2 class="instructor-label">授课教师</h2>
        <img
            loading="lazy"
            :src="courseInfo?.picture || defaultAvatar"
            class="instructor-avatar"
            alt="授课教师头像"
        />
        <div class="course-actions">
          <button class="action-button" tabindex="0">
            <el-icon><InfoFilled /></el-icon>
            <span class="action-text">课程信息</span>
          </button>
        </div>
        <div class="member-section">
          <button class="action-button" tabindex="0">
            <el-icon><user /></el-icon>
            <span class="action-text">班级成员</span>
          </button>
        </div>
      </section>
    </header>
    <nav class="course-navigation" v-if = "subView != 0">
      <ul class="navigation-list">
        <li>
          <el-icon><Reading /></el-icon>
          <button class="nav-item" tabindex="0" @click="changeView(0)">测试</button>
        </li>
        <li>
          <el-icon><ChatRound /></el-icon>
          <button class="nav-item" tabindex="0">公告</button>
        </li>
        <li>
          <el-icon><DocumentCopy /></el-icon>
          <button class="nav-item" tabindex="0">课件</button>
        </li>
      </ul>
    </nav>
    <TableWithPagination v-if = "subView == 0"/>
    <CreateAnnouncement v-if = "subView == 1"/>
    <CreateAnnouncement v-if = "subView == 4"/>
  </main>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {getCourseDetail} from "../../api/course.ts";
import {useRoute} from "vue-router";
import CourseInformation from "./components/courseInfo.vue";
import CreateAnnouncement from "../announcements/components/addAnnouncement.vue";
import TableWithPagination from "./components/coursePapers.vue";

export default defineComponent({
  name: 'CourseDetails',
  components: {TableWithPagination, CreateAnnouncement, CourseInformation},
  methods: {
    goBack(): void {
      this.$router.push(`/courses`); // 跳转到课程详情页
    }
  },
  setup() {
    const route = useRoute(); // 获取当前路由信息
    const courseId = ref<string>(route.params.id?.toString() || ''); // 从路由参数解析 id
    const courseInfo = ref<any>(); // 课程详细信息
    const subView = ref<number>(0); // 子视图
    const fetchCourseDetailedInfo = async () => {
      // 根据 courseId 获取课程详细信息
      // 将courseId解析为数字
      const {data: res} = await getCourseDetail(parseInt(courseId.value));
      courseInfo.value = res;
    };
    const changeView = (data : number) => {
      subView.value = data;
    }
    fetchCourseDetailedInfo()
    return {
      courseInfo,
      changeView,
      subView,
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  }
})
</script>

<style scoped>
.course-container {
  display: flex;
  flex-direction: column;
  height: auto;
  padding-bottom: 30px;
}

.course-header {
  display: flex;
  flex-direction: column;
  height: auto;
  margin-left: 25px;
}

.navigation {
  display: flex;
  flex-direction: row;
  margin-right: 20px;
}

.back-button {
  height: auto;
  width: 60px;
  margin: auto 0;
  background: none;
  border: none;
  cursor: pointer;
}

.course-title {
  height: auto;
  font-size: 22px;
  margin: auto 0;
}

.instructor-section {
  display: flex;
  flex-direction: row;
  margin: 10px 20px 0 0;
}

.instructor-label {
  height: auto;
  width: 100px;
  margin: auto 0;
}

.instructor-avatar {
  aspect-ratio: 1.42;
  object-fit: cover;
  width: 40px;
  height: 40px;
  border-radius: 22px;
  margin: auto 0;
}

.course-actions {
  display: flex;
  margin: auto 0 auto auto;
}

.action-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
}

.action-icon {
  width: 20px;
  height: 20px;
  object-fit: cover;
}

.action-text {
  padding-left: 5px;
}

.member-section {
  margin: auto 0;
}

.course-navigation {
  margin: 0 40px;
}

.navigation-list {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
}

.nav-item {
  margin: auto;
  padding: 0 5px;
  background: none;
  border: none;
  cursor: pointer;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>