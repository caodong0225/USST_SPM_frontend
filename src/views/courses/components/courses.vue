<template>
  <article class="course-card" @click="navigateTo">
    <div class="image-container">
      <img
          loading="lazy"
          :src=imageUrl
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
import {useRouter} from "vue-router";
export default defineComponent({
  name: 'CourseCard',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();

    const navigateTo = () => {
      router.push(`/course/detail/${props.id}`); // 跳转到课程详情页
    };

    return {
      navigateTo
    };
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