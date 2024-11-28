import { defineStore } from 'pinia'
import { ref } from 'vue'
import {UserInfo} from "../types/users";

// Pinia 会自动将 Composition API 这些相关函数自动识别为状态管理的相关内容
// ref -> state,  computed -> getters,  methods -> actions    无 mutation 概念
// 等函数转换为响应式数据

export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        const userInfo = ref<UserInfo>({ id: 0, nickname: '' }) // 提供默认值
        return { userInfo }
    },
    persist: true // 持久化存储
})