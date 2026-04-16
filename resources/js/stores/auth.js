import { defineStore } from 'pinia'
import api, { ensureCsrfCookie } from '@/axios'
import { useUiStore } from '@/stores/ui'

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
            } catch {
                this.user = null
            } finally {
                this.loading = false
                this.initialized = true
            }
        },

        async register(payload) {
            const ui = useUiStore()

            this.errors = {}
            this.loading = true

            try {
                await ensureCsrfCookie()
                const { data } = await api.post('/register', payload)
                this.user = data.user
                this.initialized = true
                ui.success('Registration successful.')

                return data
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors || {}
                } else {
                    ui.error('Registration failed.')
                }

                throw error
            } finally {
                this.loading = false
            }
        },

        async login(payload) {
            const ui = useUiStore()

            this.errors = {}
            this.loading = true            

            try {
                await ensureCsrfCookie()
                const { data } = await api.post('/login', payload)
                this.user = data.user
                this.initialized = true
                ui.success('Login successful.')

                return data
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors || {}
                } else {
                    ui.error('Login failed.')
                }

                throw error
            } finally {
                this.loading = false
            }
        },

        async logout() {
            const ui = useUiStore()

            this.loading = true

            try {
                await api.post('/logout')
                this.user = null
                this.errors = {}
                this.initialized = true
                ui.info('Logged out.')
            } finally {
                this.loading = false
            }
        },

        clearErrors() {
            this.errors = {}
        },
    },
})
