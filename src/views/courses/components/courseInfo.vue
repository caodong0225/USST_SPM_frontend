<template>
  <section class="course-info-container">
<!--    <h1 class="course-title">课程信息</h1>-->
    <div class="course-details-row">
      <div class="course-detail-group">
        <div class="detail-wrapper">
          <div class="detail-grid">
            <div class="label-column"><span class="detail-label">课程名称</span></div>
            <div class="value-column"><span class="detail-value">{{courseInfo?.course.courseName}}</span></div>
          </div>
        </div>
      </div>
      <div class="course-detail-group">
        <div class="detail-wrapper">
          <div class="detail-grid">
            <div class="label-column"><span class="detail-label">开课日期</span></div>
            <div class="value-column"><span class="detail-value">{{courseInfo?.course.startTime}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="course-details-row">
      <div class="course-detail-group">
        <div class="detail-wrapper">
          <div class="detail-grid">
            <div class="label-column"><span class="detail-label">授课教师</span></div>
            <div class="value-column"><span class="detail-value">{{courseInfo?.teacher.nickname}}</span></div>
          </div>
        </div>
      </div>
      <div class="course-detail-group">
        <div class="detail-wrapper">
          <div class="detail-grid">
            <div class="label-column"><span class="detail-label">结课日期</span></div>
            <div class="value-column"><span class="detail-value">{{courseInfo?.course.endTime}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="course-details-row">
      <div class="course-detail-group">
        <div class="detail-wrapper">
          <div class="detail-grid">
            <div class="label-column"><span class="detail-label">课程状态</span></div>
            <div class="value-column"><span class="detail-value">{{courseInfo?.course.status}}</span></div>
          </div>
        </div>
      </div>
      <div class="course-detail-group">
        <div class="detail-wrapper">
          <div class="detail-grid">
            <div class="label-column"><span class="detail-label">课程编号</span></div>
            <div class="value-column"><span class="detail-value">{{courseInfo?.course.id}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="course-description">
      <h2 class="description-title">课程描述</h2>
      <p class="description-content">{{courseInfo?.course.courseDesc}}</p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
interface CourseInfo {
  course: {
    id: number;
    courseName: string;
    courseDesc: string;
    startTime: string;
    endTime: string;
    status: string;
  };
  teacher: {
    nickname: string;
  };
  picture: string
}
export default defineComponent({
  name: 'CourseInformation',
  props: {
    courseInfo: {
      type: Object as () => CourseInfo,
      required: true
    }
  }
})
</script>

<style scoped>
.course-info-container {
  display: flex;
  flex-direction: column;
  padding: 0 0 30px 30px;
}

.course-title {
  margin: 0;
  font-size: 1.5rem;
}

.course-details-row {
  display: flex;
  margin-top: 20px;
  padding-bottom: 10px;
}

.course-detail-group {
  display: flex;
  flex-direction: column;
  margin: 20px auto 0 0;
}

.detail-wrapper {
  margin-right: auto;
}

.detail-grid {
  display: flex;
  gap: 20px;
}

.label-column {
  display: flex;
  flex-direction: column;
  width: 50%;
}

.value-column {
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-left: 20px;
}

.detail-label {
  width: 80px;
}

.course-description {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding-bottom: 30px;
}

.description-title {
  margin: 20px 0 0;
  font-size: 1.2rem;
}

.description-content {
  margin: 20px 0 0;
}

@media (max-width: 991px) {
  .detail-grid {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .label-column,
  .value-column {
    width: 100%;
    margin-left: 0;
  }
}
</style>