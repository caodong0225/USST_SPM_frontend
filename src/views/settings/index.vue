<template>
  <section class="profile-container">
    <h2 class="section-title">基本信息</h2>
    <div class="basic-info">
      <div class="info-row">
        <span class="info-label">用户名</span>
        <span class="info-value">张三</span>
      </div>
      <div class="info-row">
        <span class="info-label">当前头像</span>
        <div class="avatar-container">
          <button
              class="upload-button"
              @click="handleUpload"
              tabindex="0"
              role="button"
              aria-label="上传头像">
            上传头像
          </button>
          <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a"
              class="profile-avatar"
              alt="用户头像"
          />
        </div>
      </div>
      <div class="info-row">
        <span class="info-label">平台角色</span>
        <span class="info-value">学生</span>
      </div>
    </div>
    <section class="account-section">
      <h2 class="section-title">账号绑定</h2>
      <div class="binding-info">
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">test@test.com</span>
        </div>
        <div class="info-row">
          <span class="info-label">手机号码</span>
          <span class="info-value">11111111111</span>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserProfile',
  methods: {
    handleUpload(): void {
      // Implementation for upload functionality
    }
  }
})
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
}

.section-title {
  margin: 10px 20px;
}

.basic-info, .binding-info {
  padding: 0 25px;
}

.info-row {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.info-row:first-child {
  margin-top: 0;
}

.info-label {
  width: 120px;
}

.info-value {
  width: 250px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  width: 200px;
  padding-bottom: 30px;
}

.upload-button {
  all: unset;
  display: flex;
  flex-direction: column;
  background-color: #1a73eb;
  color: white;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  width: 100px;
  height: 25px;
  padding: 5px 10px;
}

.upload-button:focus {
  outline: 2px solid #0056b3;
  outline-offset: 2px;
}

.profile-avatar {
  aspect-ratio: 1.42;
  object-fit: cover;
  object-position: center;
  width: 200px;
  height: 200px;
  margin-top: 20px;
  min-height: 20px;
  min-width: 20px;
  overflow: hidden;
}

.account-section {
  display: flex;
  flex-direction: column;
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