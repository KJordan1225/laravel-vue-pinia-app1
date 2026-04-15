import { defineStore } from 'pinia'
import axios from '@/axios'

export const useTaskStore = defineStore('taskStore', {
    state: () => ({
        tasks: [],
        loading: false,
        errors: {},
    }),

    getters: {
        completedTasks: (state) => state.tasks.filter(task => task.completed),
        pendingTasks: (state) => state.tasks.filter(task => !task.completed),
        totalTasks: (state) => state.tasks.length,
    },

    actions: {
        async fetchTasks() {
            this.loading = true

            try {
                const { data } = await axios.get('/api/tasks')
                this.tasks = data
            } catch (error) {
                console.error('Failed to fetch tasks:', error)
            } finally {
                this.loading = false
            }
        },

        async createTask(payload) {
            this.errors = {}

            try {
                const { data } = await axios.post('/api/tasks', payload)
                this.tasks.unshift(data)
                return data
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors || {}
                }
                throw error
            }
        },

        toggleTask(id) {
            const task = this.tasks.find(task => task.id === id)

            if (task) {
                task.completed = !task.completed
            }
        },
    },
})
