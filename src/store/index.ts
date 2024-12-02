import { defineStore } from 'pinia'
import { ref } from 'vue'
import {UserInfo} from "../types/users";

// Pinia 会自动将 Composition API 这些相关函数自动识别为状态管理的相关内容
// ref -> state,  computed -> getters,  methods -> actions    无 mutation 概念
// 等函数转换为响应式数据

export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        const userInfo = ref<UserInfo>({ id: 0, nickname: '', role: 0, sessionId: '' }) // 提供默认值
        return { userInfo }
    },
    getters: {
        // 检查是否登录的辅助方法
        isLoggedIn: (state) => !!state.userInfo.sessionId && state.userInfo.id > 0
    },
    persist: true // 持久化存储
})