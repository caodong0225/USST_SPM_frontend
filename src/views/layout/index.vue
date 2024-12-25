<script setup lang="ts" name="layout">
import { RouterView, useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElNotification } from 'element-plus'
import { useUserInfoStore } from "../../store";
import { logoutAPI } from "../../api/auth.ts";

// ------ data ------
const dialogFormVisible = ref(false)
const dialogStatusVisible = ref(false)
const formLabelWidth = '80px'
const isCollapse = ref(false)

const menuList = [
  {
    title: '首页',
    path: '/home',
    icon: 'HomeFilled',
    badge: '',
  },
  {
    title: '课程管理',
    path: '/courses',
    icon: 'Reading',
    children: [
      { title: '全部课程', path: '/courses' },
      { title: '我的课程', path: '/courses/my' },
      { title: '创建课程', path: '/courses/create', role: 'teacher' }
    ]
  },
  {
    title: '考试管理',
    path: '/exams',
    icon: 'DocumentChecked',
    children: [
      { title: '考试列表', path: '/exams' },
      { title: '考试记录', path: '/exams/records' },
      { title: '创建考试', path: '/exams/create', role: 'teacher' }
    ]
  },
  {
    title: '题库管理',
    path: '/questions',
    icon: 'Collection',
    children: [
      { title: '题目列表', path: '/questions' },
      { title: '添加题目', path: '/questions/add', role: 'teacher' },
      { title: '题目分类', path: '/questions/categories' }
    ]
  },
  {
    title: '公告',
    path: '/announcements',
    icon: 'Bell',
    badge: '3'
  },
  {
    title: '个人设置',
    path: '/settings',
    icon: 'Setting',
  },
]

const visibleMenuList = computed(() => {
  return menuList.map(menu => {
    if (menu.children) {
      return {
        ...menu,
        children: menu.children.filter(item =>
          !item.role || item.role === userInfoStore.userInfo.role
        )
      }
    }
    return menu
  })
})

const form = reactive({
  oldPwd: '',
  newPwd: '',
  rePwd: '',
})
const pwdRef = ref()
const status = ref(1)
const status_active = ref(1) // 单选框绑定的动态值

// 自定义校验规则: 两次密码是否一致
const samePwd = (rules: any, value: any, callback: any) => {
  if (value !== form.newPwd) {
    // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
    callback(new Error('两次输入的密码不一致!'))
  } else {
    // 如果验证成功，则直接调用 callback 回调函数即可。
    callback()
  }
}
const rules = { // 表单的规则检验对象
  oldPwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{6,15}$/,
      message: '原密码必须是6-15的大小写字母数字',
      trigger: 'blur'
    }
  ],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '新密码必须是6-15的非空字符', trigger: 'blur' }
  ],
  rePwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '新密码必须是6-15的非空字符', trigger: 'blur' },
    { validator: samePwd, trigger: 'blur' }
  ]
}

// ------ method ------
const router = useRouter()
const userInfoStore = useUserInfoStore()
const route = useRoute();
// 根据当前路由的路径返回要激活的菜单项
const getActiveAside = () => {
  console.log('当前路由的路径--------------', route.path)
  return route.path;
};

// 初始化时获取营业状态
const init = async () => {
  // const { data: res } = await getStatusAPI()
  // console.log('初始化后的status status_active', res.data)
  // status.value = res.data
  // status_active.value = res.data
}
init()

// 关闭修改店铺状态对话框
const cancelStatus = () => {
  ElMessage({
    type: 'info',
    message: '已取消修改',
  })
  dialogStatusVisible.value = false
}
// 关闭修改密码对话框
const cancelForm = () => {
  ElMessage({
    type: 'info',
    message: '已取消修改',
  })
  dialogFormVisible.value = false
}
// 修改店铺状态
const fixStatus = async () => {
  console.log('修改后的店铺状态为')
  console.log(status_active.value)
  // const { data: res } = await fixStatusAPI(status_active.value)
  // if (res.code != 0) return   // 修改失败信息会在相应拦截器中捕获并提示
  // 修改成功才改变status的值
  status.value = status_active.value
  ElMessage({
    type: 'success',
    message: '修改成功',
  })
  dialogStatusVisible.value = false
}
// 修改密码
const fixPwd = async () => {
  const valid = await pwdRef.value.validate()
  if (valid) {
    const submitForm = {
      oldPwd: form.oldPwd,
      newPwd: form.newPwd,
    }
    console.log('要提交的表单信息')
    console.log(submitForm)
    // const { data: res } = await fixPwdAPI(submitForm)
    // if (res.code != 0) return   // 密码错误信息会在相应拦截器中捕获并提示
    ElMessage({
      type: 'success',
      message: '修改成功',
    })
    dialogFormVisible.value = false
  } else {
    return false
  }
}

const quitFn = () => {
  // 为了让用户体验更好，来个确认提示框
  ElMessageBox.confirm(
    '确认退出吗?',
    '退出登录',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  )
    .then(async () => {
      // 向后端发送退出登录请求
      await logoutAPI()
      // 登录失败，提示用户，这个提示已经在响应拦截器中统一处理了，这里直接return就行
      // 清除用户信息，包括token
      userInfoStore.userInfo = { id: 0, nickname: '', role: 0, sessionId: '' }
      ElMessage({
        type: 'success',
        message: '退出成功',
      })
      await router.push('/login')
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消退出',
      })
    })
}

const shopShow = ref(false)

const handleClose = () => {
  shopShow.value = false
}

// lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClose)
  // getStatus()
  // 暂时关闭 WebSocket 连接
  // webSocket()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClose)
})

// 刷新页面
const refreshPage = () => {
  window.location.reload()
}

// 全屏切换
const isFullscreen = ref(false)
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 面包屑导航
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  return paths.map((path, index) => {
    const fullPath = '/' + paths.slice(0, index + 1).join('/')
    return {
      path: fullPath,
      title: menuList.find(menu => menu.path === fullPath)?.title || path
    }
  })
})

const openHelp = () => {
  window?.open('http://localhost:8080/doc.html', '_blank')
}
</script>

<template>
  <div class="common-layout">
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500">
      <el-form :model="form" :rules="rules" ref="pwdRef">
        <el-form-item prop="oldPwd" label="原密码" :label-width="formLabelWidth">
          <el-input v-model="form.oldPwd" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码" :label-width="formLabelWidth">
          <el-input v-model="form.newPwd" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="rePwd" label="确认密码" :label-width="formLabelWidth">
          <el-input v-model="form.rePwd" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="fixPwd">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-container>
      <el-header>
        <div class="header-left">
          <img src="../../assets/image/spm.png" class="logo" />
          <el-button class="toggle-sidebar" text @click="isCollapse = !isCollapse">
            <el-icon :size="20">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
          </el-button>
        </div>

        <div class="header-center">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
              <el-icon>
                <HomeFilled />
              </el-icon>首页
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="{ path: item.path }">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>

          <div class="quick-actions">
            <div class="action-group">
              <el-tooltip content="首页" placement="bottom">
                <el-button text @click="$router.push('/home')">
                  <el-icon>
                    <HomeFilled />
                  </el-icon>
                </el-button>
              </el-tooltip>
            </div>

            <el-divider direction="vertical" />

            <div class="action-group">
              <el-tooltip content="帮助文档" placement="bottom">
                <el-button text @click="openHelp">
                  <el-icon>
                    <QuestionFilled />
                  </el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="刷新页面" placement="bottom">
                <el-button text @click="refreshPage">
                  <el-icon>
                    <Refresh />
                  </el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="全屏" placement="bottom">
                <el-button text @click="toggleFullScreen">
                  <el-icon>
                    <FullScreen />
                  </el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </div>

        <div class="header-right">
          <el-popover placement="bottom" :width="300" trigger="click">
            <template #reference>
              <el-badge :value="3" class="notice-badge">
                <el-button text>
                  <el-icon>
                    <Bell />
                  </el-icon>
                </el-button>
              </el-badge>
            </template>
            <div class="notification-panel">
              <div class="panel-header">
                <span>系统通知</span>
                <el-button text size="small">全部已读</el-button>
              </div>
              <div class="notification-list">
                <div v-for="i in 3" :key="i" class="notification-item">
                  <el-icon color="#409EFF">
                    <Message />
                  </el-icon>
                  <div class="content">
                    <div class="title">系统通知</div>
                    <div class="desc">您有一个新的考试待参加</div>
                    <div class="time">10分钟前</div>
                  </div>
                </div>
              </div>
            </div>
          </el-popover>

          <el-dropdown>
            <div class="user-info">
              <el-avatar :size="32" :src="userInfoStore.userInfo?.avatar || '/person.png'" />
              <span class="username">{{ userInfoStore.userInfo?.nickname || '未登录' }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/settings')">
                  <el-icon>
                    <User />
                  </el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="dialogFormVisible = true">
                  <el-icon>
                    <Key />
                  </el-icon>修改密码
                </el-dropdown-item>
                <el-dropdown-item divided @click="quitFn">
                  <el-icon>
                    <SwitchButton />
                  </el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container class="box1">
        <el-menu :width="isCollapse ? '64px' : '240px'" :default-active="route.path" :collapse="isCollapse"
          background-color="#fff" text-color="#303133" active-text-color="#409EFF" :collapse-transition="false"
          unique-opened router>
          <div class="menu-header">
            <span v-if="!isCollapse">功能导航</span>
            <el-icon v-else>
              <Menu />
            </el-icon>
          </div>
          <template v-for="item in visibleMenuList" :key="item.path">
            <el-sub-menu v-if="item.children?.length" :index="item.path">
              <template #title>
                <el-icon>
                  <component :is="item.icon" />
                </el-icon>
                <span>{{ item.title }}</span>
              </template>
              <div class="submenu-content">
                <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
                  <template #title>
                    <span>{{ child.title }}</span>
                    <el-tag v-if="child.role === 'teacher'" size="small" type="success" effect="plain" class="role-tag">
                      教师
                    </el-tag>
                  </template>
                </el-menu-item>
              </div>
            </el-sub-menu>
            <el-menu-item v-else :index="item.path">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <template #title>
                <span>{{ item.title }}</span>
                <el-badge v-if="item.badge" :value="item.badge" class="menu-badge" />
              </template>
            </el-menu-item>
          </template>
        </el-menu>
        <div class="mycontainer">
          <el-main>
            <RouterView></RouterView>
          </el-main>
          <el-footer>
            Copyright © 2024 USST SPM
          </el-footer>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.common-layout {
  height: 100vh;
  background-color: var(--el-bg-color);
}

.el-header {
  background-color: #00aaff;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  color: #ffffff;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .logo {
      display: inline-block;
      margin: 10px 20px;
      width: 180px;
      height: 40px;
    }

    .toggle-sidebar {
      color: #ffffff;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .header-center {
    display: flex;
    align-items: center;
    gap: 24px;

    .el-breadcrumb {
      color: #fff;
      margin-right: 16px;

      :deep(.el-breadcrumb__item) {
        .el-breadcrumb__inner {
          color: rgba(255, 255, 255, 0.8);
          font-weight: normal;

          &:hover {
            color: #fff;
          }

          .el-icon {
            margin-right: 4px;
            font-size: 16px;
          }
        }

        &:last-child .el-breadcrumb__inner {
          color: #fff;
          font-weight: 600;
        }
      }
    }

    .quick-actions {
      display: flex;
      align-items: center;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 0 8px;

      .action-group {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .el-button {
        color: #ffffff;
        height: 32px;
        width: 32px;
        padding: 0;
        border-radius: 16px;

        .el-icon {
          font-size: 16px;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      .el-divider {
        height: 20px;
        margin: 0 8px;
        border-color: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

.el-dropdown .el-button {
  float: right;
  width: auto;
  min-width: 100px;
  margin: 14px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .arrow-down-icon {
    margin-left: 5px;
  }
}

.box1 {
  display: flex;
  height: calc(100vh - 60px);
}

.mycontainer {
  flex: 1;
  background-color: var(--el-bg-color-page);
  padding: 20px;
  overflow-y: auto;
}

.el-main {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.el-menu {
  width: 240px;
  height: 100%;
  background-color: #445566;
  border-right: none;
  transition: width 0.3s;
  overflow-x: hidden;
  overflow-y: auto;

  &.el-menu--collapse {
    width: 64px;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      padding: 0 20px !important;
      justify-content: center;
      text-align: center;

      .el-icon {
        margin: 0 auto !important;
      }

      span {
        display: none;
      }

      .menu-badge {
        display: none;
      }
    }
  }

  // 修复弹出菜单的样式
  :deep(.el-menu--popup-container) {
    .el-popper__content {
      background-color: #00aaff !important;
      border: none;
      padding: 0;
    }

    .el-menu {
      background-color: #00aaff !important;
      border: none;

      .el-menu-item {
        height: 40px;
        line-height: 40px;
        color: #fff;
        padding: 0 20px !important;
        margin: 4px 0;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &.is-active {
          background-color: #22ccff;
          color: #fff;
        }

        span {
          color: #fff;
        }
      }
    }

    // 修复子菜单的样式
    .el-menu--popup {
      background-color: #00aaff !important;

      .el-menu-item {
        background-color: #00aaff;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &.is-active {
          background-color: #22ccff;
        }
      }
    }

    .el-popper__arrow::before {
      background-color: #00aaff !important;
      border-color: #00aaff !important;
    }
  }

  :deep(.el-icon) {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    margin: 4px 0;
    color: #ffffff;
    display: flex;
    align-items: center;
    min-width: unset;

    :deep(.el-icon) {
      margin-right: 12px;
    }

    &.is-active {
      background-color: #22ccff;
      color: #ffffff;
      font-weight: 500;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      height: 50px;
      line-height: 50px;
      padding: 0 16px !important;
      margin: 4px 0;
      color: #ffffff;
      display: flex;
      align-items: center;

      .el-icon {
        margin-right: 12px;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      &.is-active {
        background-color: #22ccff;
      }
    }

    .el-menu {
      background-color: rgba(0, 0, 0, 0.2);

      .el-menu-item {
        padding-left: 48px !important;
        min-width: unset;

        &.is-active {
          background-color: #22ccff;
        }
      }
    }
  }

  .menu-badge {
    position: absolute;
    right: 20px;
  }
}

.el-footer {
  padding: 15px 0;
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  background-color: #fff;
  border-top: 1px solid var(--el-border-color-light);
}

// 对话框样式优化
.el-dialog {
  border-radius: 8px;

  .el-dialog__header {
    margin: 0;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  .el-dialog__body {
    padding: 20px;
  }

  .dialog-footer {
    padding-top: 10px;
    text-align: right;
  }
}

// 通知面板样式
.notification-panel {
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid var(--el-border-color-light);

    span {
      font-weight: bold;
    }
  }

  .notification-list {
    max-height: 300px;
    overflow-y: auto;

    .notification-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      cursor: pointer;

      &:hover {
        background-color: var(--el-fill-color-light);
      }

      .content {
        flex: 1;

        .title {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .desc {
          color: var(--el-text-color-regular);
          font-size: 12px;
          margin-bottom: 4px;
        }

        .time {
          color: var(--el-text-color-secondary);
          font-size: 12px;
        }
      }
    }
  }

  .panel-footer {
    padding: 12px;
    text-align: center;
    border-top: 1px solid var(--el-border-color-light);
  }
}

// 添加过渡动画
.el-menu-enter-active,
.el-menu-leave-active {
  transition: all 0.3s;
}

.el-menu-enter-from,
.el-menu-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .username {
    color: #fff;
    font-size: 14px;
  }
}
</style>