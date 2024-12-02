<template>
  <article class="course-card">
    <div class="image-container">
      <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a"
          class="course-image"
          alt="Course thumbnail"
      />
    </div>
    <div class="content-container">
      <h2 class="course-title">{{title}}</h2>
      <div class="course-details">
        <div class="detail-row">
          <span class="detail-label">开课：</span>
          <span class="detail-value">{{startTime}}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">课程状态：</span>
          <span class="detail-value">{{status}}</span>
        </div>
      </div>
      <p class="course-description">{{description}}</p>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface CourseCardProps {
  title: string
  startTime: string
  status: string
  description: string
  imageUrl: string
}

export default defineComponent({
  name: 'CourseCard',
  props: {
    title: {
      type: String,
      required: true,
      default: "课程标题"
    },
    startTime: {
      type: String,
      required: true,
      default: "2024-11-29"
    },
    status: {
      type: String,
      required: true,
      default: "开课中"
    },
    description: {
      type: String,
      required: true,
      default: "课程描述"
    },
    imageUrl: {
      type: String,
      required: true,
    }
  }
})
</script>

<style scoped>
.course-card {
  display: flex;
  flex-direction: row;
}

.image-container {
  display: flex;
  flex-direction: row;
  position: relative;
  padding: 0 0 30px;
}

.course-image {
  aspect-ratio: 1.42;
  object-fit: cover;
  object-position: center;
  width: 256px;
  min-height: 20px;
  min-width: 20px;
  overflow: hidden;
  height: 182px;
  margin: 20px auto 0 40px;
}

.content-container {
  display: flex;
  flex-direction: column;
  position: relative;
  flex-grow: 1;
  width: auto;
  margin: 20px 40px 30px 20px;
}

.course-title {
  margin-left: 20px;
  font-size: 24px;
}

.course-details {
  display: flex;
  flex-direction: column;
  position: relative;
  height: auto;
  margin: 5px 0 0 20px;
}

.detail-row {
  display: flex;
  flex-direction: row;
}

.detail-label {
  width: 80px;
}

.detail-value {
  height: auto;
}

.course-description {
  margin: 5px 0 0 20px;
}
</style>