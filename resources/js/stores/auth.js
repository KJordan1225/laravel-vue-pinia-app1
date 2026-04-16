import { defineStore } from 'pinia'
import api, { ensureCsrfCookie } from '@/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        initialized: false,
        errors: {},
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        userName: (state) => state.user?.name ?? '',
    },

    actions: {
        async fetchUser() {
            this.loading = true

            try {
                const { data } = await api.get('/api/user')
                this.user = data
            } catch (error) {
                this.user = null
            } finally {
                this.loading = false
                this.initialized = true
            }
        },

        async register(payload) {
            this.errors = {}
            this.loading = true

            try {
                await ensureCsrfCookie()

                const { data } = await api.post('/api/register', payload)
                this.user = data.user
                this.initialized = true

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

        async login(payload) {
            this.errors = {}
            this.loading = true

            try {
                await ensureCsrfCookie()

                const { data } = await api.post('/api/login', payload)
                this.user = data.user
                this.initialized = true

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
                await api.post('/api/logout')
                this.user = null
                this.errors = {}
                this.initialized = true
            } finally {
                this.loading = false
            }
        },

        clearErrors() {
            this.errors = {}
        },
    },
})
