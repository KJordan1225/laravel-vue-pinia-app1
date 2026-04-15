import { defineStore } from 'pinia'
import axios from '@/axios'

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        user: null,
        loading: false,
        errors: {},
        initialized: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        async fetchUser() {
            this.loading = true

            try {
                const { data } = await axios.get('/api/user')
                this.user = data
            } catch (error) {
                this.user = null
            } finally {
                this.loading = false
                this.initialized = true
            }
        },

        async login(payload) {
            this.errors = {}
            this.loading = true

            try {
                const { data } = await axios.post('/api/login', payload)
                this.user = data.user
                return data
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors || {}
                }
                throw error
            } finally {
                this.loading = false
            }
        },

        async logout() {
            this.loading = true

            try {
                await axios.post('/api/logout')
                this.user = null
            } finally {
                this.loading = false
            }
        },
    },
})
