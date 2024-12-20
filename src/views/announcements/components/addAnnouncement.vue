<template>
  <form class="announcement-form" @submit.prevent="handleSubmit">
    <h1 class="form-title">创建公告</h1>
    <div class="form-group">
      <h2 class="input-title">公告标题</h2>
      <el-input
          type="text"
          placeholder="请输入公告标题"
          name="title"
          :required="true"
      />
    </div>
    <div class="form-group">
      <h2 class="input-title">公告内容</h2>
      <textarea
          placeholder="请输入公告内容"
          name="announcement_content"
          :required="true"
      />
    </div>
    <button type="submit" class="submit-button" tabindex="0">创建</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreateAnnouncement',
  components: {
  },
  methods: {
    handleSubmit(event: Event) {
      const formData = new FormData(event.target as HTMLFormElement)
    }
  }
})
</script>

<style scoped>
.announcement-form {
  display: flex;
  flex-direction: column;
  padding: 0 30px 20px;
}

.form-title {
  margin: 10px 0;
  font-size: 24px;
}

.form-group {
  margin: 20px 0;
}

.input-title {
  font-weight: 600;
  margin-bottom: 20px;
}

.submit-button {
  background-color: #1a73eb;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 15px 25px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-start;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #1557b0;
}

.submit-button:focus {
  outline: 2px solid #1a73eb;
  outline-offset: 2px;
}
</style>