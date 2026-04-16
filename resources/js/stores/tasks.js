import { defineStore } from 'pinia'
import api from '@/axios'

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        tasks: [],
        currentTask: null,
        loading: false,
        submitting: false,
        errors: {},
    }),

    getters: {
        totalTasks: (state) => state.tasks.length,
        completedTasks: (state) => state.tasks.filter(task => task.completed),
        pendingTasks: (state) => state.tasks.filter(task => !task.completed),
    },

    actions: {
        async fetchTasks() {
            this.loading = true

            try {
                const { data } = await api.get('/api/tasks')
                this.tasks = data
                return data
            } catch (error) {
                console.error('Failed to fetch tasks:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchTask(id) {
            this.loading = true

            try {
                const { data } = await api.get(`/api/tasks/${id}`)
                this.currentTask = data
                return data
            } catch (error) {
                console.error('Failed to fetch task:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async createTask(payload) {
            this.errors = {}
            this.submitting = true

            try {
                const { data } = await api.post('/api/tasks', payload)
                this.tasks.unshift(data)
                return data
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors || {}
                }

                throw error
            } finally {
                this.submitting = false
            }
        },

        async updateTask(id, payload) {
            this.errors = {}
            this.submitting = true

            try {
                const { data } = await api.put(`/api/tasks/${id}`, payload)

                const index = this.tasks.findIndex(task => task.id === id)
                if (index !== -1) {
                    this.tasks[index] = data
                }

                if (this.currentTask?.id === id) {
                    this.currentTask = data
                }

                return data
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors || {}
                }

                throw error
            } finally {
                this.submitting = false
            }
        },

        async deleteTask(id) {
            await api.delete(`/api/tasks/${id}`)

            this.tasks = this.tasks.filter(task => task.id !== id)

            if (this.currentTask?.id === id) {
                this.currentTask = null
            }
        },

        async toggleTask(task) {
            return await this.updateTask(task.id, {
                title: task.title,
                description: task.description,
                completed: !task.completed,
            })
        },

        clearErrors() {
            this.errors = {}
        },

        clearCurrentTask() {
            this.currentTask = null
        },
    },
})
