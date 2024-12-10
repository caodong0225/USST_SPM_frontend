<template>
  <section class="profile-container">
    <h2 class="section-title">基本信息</h2>
    <div class="basic-info">
      <div class="info-row">
        <span class="info-label">用户名</span>
        <span class="info-value">{{ nickname ? nickname : '未设置' }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">当前头像</span>
        <div class="avatar-container">
          <el-button
              @click="triggerFileInput"
              tabindex="0"
              role="button"
              aria-label="上传头像">
            上传头像
          </el-button>
          <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handleImageUpload"
              class="visually-hidden"
          />
          <img
              :src="avatarBase64?avatarBase64:'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a'"
              class="profile-avatar"
              alt="用户头像"
          />
        </div>
      </div>
      <div class="info-row">
        <span class="info-label">平台角色</span>
        <span class="info-value">{{ role > 2 ? '管理员' : role > 1 ? '教师' : '学生' }}</span>
      </div>
    </div>
    <section class="account-section">
      <h2 class="section-title">账号绑定</h2>
      <div class="binding-info">
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">{{ email ? email : '未设置' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">手机号码</span>
          <span class="info-value">{{ phone ? phone : '未设置' }}</span>
        </div>
      </div>
    </section>
  </section>
</template>
<script lang="ts">
import {defineComponent, ref} from 'vue'
import {getUserExtraInfo, updateUserExtraInfo} from "../../api/user.ts";
import {useUserInfoStore} from "../../store";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: 'UserProfile',
  setup() {
    const avatarBase64 = ref<string | null>(null)
    const description = ref<string | null>(null)
    const email = ref<string | null>(null)
    const phone = ref<string | null>(null)
    const userInfoStore = useUserInfoStore()
    const role = userInfoStore.userInfo.role
    const nickname = userInfoStore.userInfo.nickname
    const fetchUserExtraInfo = async () => {
      // Fetch user extra info
      const {data: res} = await getUserExtraInfo(userInfoStore.userInfo.id)
      avatarBase64.value = res.userExtraInfo.pic
      description.value = res.userExtraInfo.description
      email.value = res.user.email
      phone.value = res.user.phone
    }
    const updateUserExt = async (key: string, value: string) => {
      // Update user extra info
      const {data: res} = await updateUserExtraInfo(userInfoStore.userInfo.id, key, {
        "value": value,
      });
      return res;
    }

    fetchUserExtraInfo()

    const triggerFileInput = () => {
      // Trigger the file input click event
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      fileInput?.click()
    }

    const handleImageUpload = (event: Event): void => {
      const fileInput = event.target as HTMLInputElement
      const file = fileInput.files?.[0]

      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target) {
            // Set the base64 encoded image to the avatarBase64 variable
            const pic = e.target.result as string
            try {
              // 上传图片并处理返回结果
              updateUserExt("pic", pic)
              avatarBase64.value = pic
              ElMessage.success('头像上传成功')
            } catch (error) {
              // 处理上传失败的情况
              ElMessage.error('头像上传失败，请重试')
            }
          }
        }
        reader.readAsDataURL(file) // Read the file and convert it to base64
      }
    }

    return {
      avatarBase64,
      nickname,
      role,
      email,
      phone,
      description,
      triggerFileInput,
      handleImageUpload
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
  aspect-ratio: 1; /* 保持图片为正方形 */
  object-fit: contain; /* 保证图片按比例缩放并保持完整显示 */
  object-position: center; /* 将图像居中 */
  width: 200px;
  height: 200px;
  margin-top: 20px;
  min-height: 20px;
  min-width: 20px;
  overflow: hidden; /* 如果图片比容器大，隐藏超出部分 */
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