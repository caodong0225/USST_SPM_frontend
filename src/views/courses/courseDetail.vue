<template>
  <main class="course-container">
    <header class="course-header">
      <nav class="navigation">
        <button class="back-button" @click="goBack" tabindex="0">&lt;返回</button>
        <h1 class="course-title">{{courseInfo?.course.courseName}}</h1>
      </nav>
      <section class="instructor-section">
        <h2 class="instructor-label">授课教师</h2>
        <el-tooltip
            effect="dark"
            :content="courseInfo?.teacher.nickname">
          <img
              loading="lazy"
              :src="courseInfo?.picture || defaultAvatar"
              class="instructor-avatar"
              alt="授课教师头像"
          />
        </el-tooltip>
        <div class="course-actions">
          <button class="action-button" tabindex="0" :class="{ 'highlight': subView === 1 }">
            <el-icon><InfoFilled /></el-icon>
            <span class="action-text" @click="changeView(1)">课程信息</span>
          </button>
        </div>
        <div class="member-section">
          <button class="action-button" tabindex="0" :class="{ 'highlight': subView === 2 }">
            <el-icon><user /></el-icon>
            <span class="action-text" @click="changeView(2)">班级成员</span>
          </button>
        </div>
      </section>
    </header>
    <nav class="course-navigation" v-if = "subView == 0">
      <ul class="navigation-list">
        <li
            v-for="(item, index) in navItems"
            :key="index"
            :class="{ 'active': activeIndex === index }"
            @click="changeIndex(index)"
        >
          <el-button class="nav-item" tabindex="0" :icon="item.icon">{{ item.label }}</el-button>
        </li>
        <li :class="{ 'active': activeIndex === 3 }" v-if = "isAdmin">
          <el-button class="nav-item" tabindex="0" @click="changeIndex(3)" icon="Grid">题库</el-button>
        </li>
      </ul>
      <TableWithPagination :table-data="paperInfo" :course-id="courseId" v-if = "activeIndex == 0"/>
      <CreateAnnouncement :course-id="courseId" v-if = "activeIndex == 1"/>
    </nav>
    <CourseInformation v-if = "subView == 1" :course-info="courseInfo"/>
    <Students v-if = "subView == 2"  :course-id="courseId"/>
  </main>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {getCourseDetail} from "../../api/course.ts";
import {useRoute} from "vue-router";
import CourseInformation from "./components/courseInfo.vue";
import TableWithPagination from "./components/coursePapers.vue";
import {getPapers} from "../../api/paper.ts";
import CreateAnnouncement from "./components/createAnnouncement.vue";
import {useUserInfoStore} from "../../store";
import Students from "./components/students.vue";

export default defineComponent({
  name: 'CourseDetails',
  components: {Students, CreateAnnouncement, TableWithPagination, CourseInformation},
  methods: {
    goBack(): void {
      this.$router.push(`/courses`); // 跳转到课程详情页
    }
  },
  data() {
    return {
      navItems: [
        { label: '测试', icon: 'Document' },       // 使用图标组件
        { label: '公告', icon: 'ChatRound' },
        { label: '课件', icon: 'DocumentCopy' },
      ],
    }
  },
  setup() {
    const route = useRoute(); // 获取当前路由信息
    const courseId = ref<string>(route.params.id?.toString() || ''); // 从路由参数解析 id
    const courseInfo = ref<any>(); // 课程详细信息
    const paperInfo = ref<any>(); // 课程详细信息
    const subView = ref<number>(0); // 子视图
    const activeIndex = ref<number>(0); // 当前激活的导航栏索引
    const isAdmin = ref(false);
    const userInfoStore = useUserInfoStore();
    if (userInfoStore.userInfo.role > 0) {
      isAdmin.value = true;
    }
    const fetchCourseDetailedInfo = async () => {
      // 根据 courseId 获取课程详细信息
      // 将courseId解析为数字
      const {data: res} = await getCourseDetail(parseInt(courseId.value));
      courseInfo.value = res;
    };
    const fetchCoursePapers = async () => {
      // Fetch course detailed info
      const { data: res } = await getPapers(courseId.value);
      paperInfo.value = res;
    };
    const changeView = (data : number) => {
      subView.value = data;
    }
    const changeIndex = (data : number) => {
      if(data == 0){
        fetchCoursePapers()
      }
      activeIndex.value = data;
    }
    fetchCourseDetailedInfo()
    fetchCoursePapers()
    return {
      courseInfo,
      courseId,
      activeIndex,
      paperInfo,
      isAdmin,
      changeView,
      changeIndex,
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

.navigation-list li.active .nav-item {
  background-color: #409eff;
  color: #fff;
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

.highlight {
  background-color: #409eff; /* 高亮背景色 */
  color: white; /* 高亮字体颜色 */
  border-radius: 5px;
}
</style>