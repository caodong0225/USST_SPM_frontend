import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', {
    state: () => ({
        userInfo: {
            id: 0,
            nickname: '',
            role: 0,
            sessionId: ''
        }
    }),
    persist: {
        enabled: true,
        strategies: [{
            key: 'userInfo',
            storage: localStorage,
        }]
    }
})