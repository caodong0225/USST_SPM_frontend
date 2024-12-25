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
          role="button"
          class="upload-button"
          @click="triggerFileInput"
          tabindex="0"
        >
          上传图片
        </el-button>
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleImageUpload"
          class="visually-hidden"
        />
      </div>
      <img
        :src="formData.coursePic ? formData.coursePic : '/course.png'"
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
import { defineComponent, ref } from 'vue';
import FormComponents from './components/formComponents.vue';
import { addCourse } from "../../api/course";
import router from "../../router";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: 'CourseForm',
  components: {
    FormComponents
  },
  methods: {
    goBack(): void {
      this.$router.push(`/courses`);
    }
  },
  setup() {
    const formData = ref<any>({
      courseName: '',
      courseDesc: '',
      coursePic: '',
      startTime: '',
      endTime: ''
    });

    const createCourse = async () => {
      try {
        // 验证必填字段
        if (!formData.value.courseName.trim()) {
          ElMessage.error('请输入课程名称');
          return;
        }
        if (!formData.value.courseDesc.trim()) {
          ElMessage.error('请输入课程描述');
          return;
        }
        if (!formData.value.startTime || !formData.value.endTime) {
          ElMessage.error('请选择开始和结束时间');
          return;
        }

        // 验证时间逻辑
        const startTime = new Date(formData.value.startTime);
        const endTime = new Date(formData.value.endTime);
        if (endTime <= startTime) {
          ElMessage.error('结束时间必须晚于开始时间');
          return;
        }

        const submitData = {
          courseName: formData.value.courseName.trim(),
          courseDesc: formData.value.courseDesc.trim(),
          coursePic: formData.value.coursePic || '',  // 如果没有图片就发送空字符串
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        };

        console.log('提交的数据:', submitData);
        const res = await addCourse(submitData);
        console.log('服务器响应:', res);

        if (res && res.data) {
          await router.push(`/course/detail/${res.data.id}`);
          ElMessage.success('创建成功');
        }
      } catch (error) {
        console.error('错误详情:', error);
        ElMessage.error(error.response?.data?.message || '创建失败，请重试');
      }
    };

    const triggerFileInput = () => {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      fileInput?.click();
    };

    const handleImageUpload = (event: Event): void => {
      const fileInput = event.target as HTMLInputElement;
      const file = fileInput.files?.[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            const pic = e.target.result as string;
            try {
              formData.value.coursePic = pic;
              ElMessage.success('封面上传成功');
            } catch (error) {
              ElMessage.error('封面上传失败，请重试');
            }
          }
        };
        reader.readAsDataURL(file);
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

.submit-button {
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