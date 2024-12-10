<template>
  <form class="course-form">
    <nav class="navigation">
      <button class="back-button" @click="goBack" tabindex="0">&lt;返回</button>
      <h1 class="course-title">添加课程</h1>
    </nav>

    <div class="form-group">
      <FormComponents
          type="text"
          id="courseName"
          name="courseName"
          label="课程名称"
          placeholder="请输入课程名称"
          v-model="formData.courseName"
      />
    </div>

    <div class="cover-section">
      <div class="cover-header">
        <label class="cover-label">课程封面</label>
        <el-button
            type="button"
            class="upload-button"
            @click="triggerFileInput"
            tabindex="0"
        >
          上传图片
        </el-button>
        <el-input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="handleImageUpload"
            class="visually-hidden"
        />
      </div>
      <img
          :src="formData.coursePic? formData.coursePic:'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a'"
          alt="课程封面图片"
          class="cover-image"
      />
    </div>

    <div class="description-section">
      <label for="description" class="description-label">课程描述</label>
      <div class="description-wrapper">
        <textarea
            id="description"
            v-model="formData.courseDesc"
            placeholder="介绍一下这门课吧"
            class="description-input"
            aria-label="课程描述"
        ></textarea>
      </div>
    </div>

    <div class="time-section">
      <FormComponents
          type="datetime"
          id="startTime"
          name="startTime"
          label="开课时间"
          v-model="formData.startTime"
      />
    </div>

    <div class="time-section">
      <FormComponents
          type="datetime"
          id="endTime"
          name="endTime"
          label="结课时间"
          v-model="formData.endTime"
      />
    </div>
    <div class="submit-button">
      <el-button type="primary" @click="createCourse">提交</el-button>
    </div>

  </form>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import FormComponents from './components/formComponents.vue';
import {CreateCourseDTO} from "../../model/dto/CreateCourseDTO.ts";
import {addCourse} from "../../api/course.ts";
import router from "../../router.ts";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: 'CourseForm',
  components: {
    FormComponents
  },
  methods: {
    goBack(): void {
      this.$router.push(`/courses`); // 跳转到课程详情页
    }
  },
  setup() {
    const formData = ref<CreateCourseDTO>({
      courseName: '',
      courseDesc: '',
      coursePic: '',
      startTime: '',
      endTime: ''
    });

    const createCourse = async () => {
      try {
        const {data: res} = await addCourse(formData.value);
        // 创建成功，需要跳转到详情页面
        await router.push(`/course/detail/${res.id}`);
        ElMessage.success('创建成功');
      } catch (error) {
        console.error(error);
        ElMessage.error('创建失败，请重试');
      }
    };

    const triggerFileInput = () => {
      // Trigger the file input click event
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      fileInput?.click()
    }

    const handleImageUpload = (event: Event): void => {
      // Image upload logic would go here
      const fileInput = event.target as HTMLInputElement
      const file = fileInput.files?.[0]

      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target) {
            // Set the base64 encoded image to the avatarBase64 variable
            const pic = e.target.result as string
            try {
              formData.value.coursePic = pic
              ElMessage.success('头像上传成功')
            } catch (error) {
              // 处理上传失败的情况
              ElMessage.error('头像上传失败，请重试')
            }
          }
        }
        reader.readAsDataURL(file) // Read the file and convert it to base64
      }
    };

    return {
      formData,
      createCourse,
      handleImageUpload,
      triggerFileInput
    };
  }
});
</script>

<style scoped>
.back-button {
  height: auto;
  width: 60px;
  margin: auto 0;
  background: none;
  border: none;
  cursor: pointer;
}

.navigation {
  display: flex;
  flex-direction: row;
  margin-right: 20px;
}

.submit-button{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.course-form {
  display: flex;
  flex-direction: column;
  padding: 0 25px 30px;
  margin: 20px 0;
}

.course-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 15px;
}

.form-group {
  margin: 15px 0;
  padding-left: 30px;
}

.cover-section {
  margin: 10px 0 0 30px;
  padding-bottom: 30px;
}

.cover-header {
  display: flex;
  align-items: center;
}

.cover-label {
  margin-right: 20px;
}

.upload-button {
  border: none;
  border-radius: 4px;
  padding: 15px 25px;
  cursor: pointer;
}

.cover-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  margin: 20px 0 0 80px;
}

.description-section {
  margin: 20px 0 0 30px;
  padding-bottom: 30px;
}

.description-wrapper {
  max-width: 800px;
  margin-top: 9px;
  padding: 0 20px;
}

.description-input {
  width: 100%;
  min-height: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  font-family: Arial, sans-serif;
  line-height: 1.5;
  resize: vertical;
}

.time-section {
  margin: 20px 0 0 30px;
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