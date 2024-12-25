<script setup lang="ts">
import {useRouter} from 'vue-router'
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useUserInfoStore} from "../../store";
import {loginAPI} from "../../api/auth.ts";

const userInfoStore = useUserInfoStore()

const form = ref({
  username: '',
  password: ''
});

// 表单校验的ref
const loginRef = ref()

// 添加错误状态
const errors = ref({
  username: '',
  password: '',
  system: ''
})

// 添加加载状态
const loading = ref(false)

const rules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {pattern: /^[a-zA-Z0-9]{3,20}$/, message: '用户名必须是3-20的字母数字', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {
      pattern: /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,32}$/,
      message: '密码必须是6-32的数字+英文字符',
      trigger: 'blur'
    }
  ]
}

const router = useRouter()

const loginFn = async () => {
  try {
    loading.value = true
    console.log('开始登录，发送数据:', form.value)

    const valid = await loginRef.value.validate()
    if (valid) {
      const {data: response} = await loginAPI(form.value)
      console.log('登录响应完整数据:', response)  // 查看完整响应
      console.log('登录响应中的角色:', response.roles)  // 特别关注角色信息
      console.log('登录响应中的token:', response.sessionId)  // 特别关注token

      userInfoStore.userInfo = {
        id: response.users.id,
        nickname: response.users.nickname,
        role: response.roles.includes('super-admin') ? 2 : 
              response.roles.includes('teacher') ? 1 : 0,
        sessionId: response.sessionId
      }

      console.log('存储到 store 的用户信息:', userInfoStore.userInfo)
      ElMessage.success('登录成功')
      await router.push('/')
    }
  } catch (error) {
    console.error('登录失败:', error)
  }
}
</script>

<template>
  <div class="background">
    <!-- 保持原有的下雨效果 -->
    <div class="rain">
      <!-- ... 原有的 rain spans ... -->
    </div>
    
    <el-form label-width="0px" class="login-box" :model="form" :rules="rules" ref="loginRef">
      <div class="title-box">登 录</div>
      
      <el-form-item prop="username">
        <el-input 
          v-model="form.username" 
          placeholder="请输入账号"
          :class="{ 'is-error': errors.username }"
        ></el-input>
        <div class="error-message" v-if="errors.username">{{ errors.username }}</div>
      </el-form-item>
      
      <el-form-item prop="password">
        <el-input 
          type="password" 
          v-model="form.password" 
          placeholder="请输入密码"
          :class="{ 'is-error': errors.password }"
        ></el-input>
        <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
      </el-form-item>
      
      <!-- 系统错误提示 -->
      <div class="system-error" v-if="errors.system">{{ errors.system }}</div>
      
      <el-form-item class="my-el-form-item">
        <el-button 
          type="primary" 
          class="btn-login" 
          @click="loginFn"
          :loading="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </el-button>
        <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.background {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-image: url('../../assets/image/bg.webp');
  overflow: hidden;
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.rain {
  position: relative;
  display: flex;
}

.rain span {
  position: relative;
  width: 20px;
  height: 20px;
  background-color: #eee;
  margin: 0 4px;
  border-radius: 50%;
  box-shadow: 0 0 10px 5px rgba(238, 238, 238, 0.5),
    0 0 30px 15px rgba(238, 238, 238, 0.3),
    0 0 50px 30px rgba(221, 221, 221, 0.2);
  animation: animate 15s linear infinite;
  animation-duration: calc(200s / var(--i));
}

.rain span:nth-child(even) {
  background: #ff8800;
  box-shadow: 0 0 10px 5px rgba(255, 150, 50, 0.5),
    0 0 30px 15px rgba(200, 100, 50, 0.3),
    0 0 50px 30px rgba(200, 50, 50, 0.1);
}

@keyframes animate {
  0% {
    transform: translateY(100vh) scale(0);
  }
  100% {
    transform: translateY(-10vh) scale(1);
  }
}

.login-box {
  z-index: 10;
  width: 400px;
  height: 340px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 0 30px;
  box-sizing: border-box;
}

.title-box {
  height: 100px;
  line-height: 100px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #00aaff;
}

.btn-login {
  width: 100%;
}

.error-message {
  color: #ff4949;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 4px;
}

.system-error {
  color: #ff4949;
  text-align: center;
  margin: -10px 0 10px;
  font-size: 12px;
}

.is-error {
  border-color: #ff4949;
}
</style>