import { defineStore } from 'pinia'
import api from '@/axios'
import { useUiStore } from '@/stores/ui'

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        tasks: [],
        currentTask: null,
        loading: false,
        submitting: false,
        errors: {},
        filters: {
            search: '',
            completed: '',
            per_page: 10,
            page: 1,
        },
        meta: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
        },
        links: {
            first: null,
            last: null,
            prev: null,
            next: null,
        },
    }),

    getters: {
        totalTasks: (state) => state.meta.total,
        completedTasksCount: (state) => state.tasks.filter(task => task.completed).length,
        pendingTasksCount: (state) => state.tasks.filter(task => !task.completed).length,
    },

    actions: {
        async fetchTasks(page = this.filters.page) {
            this.loading = true

            try {
                this.filters.page = page

                const params = {
                    search: this.filters.search || undefined,
                    completed: this.filters.completed !== '' ? this.filters.completed : undefined,
                    per_page: this.filters.per_page,
                    page: this.filters.page,
                }

                const { data } = await api.get('/api/tasks', { params })

                this.tasks = data.data
                this.meta = data.meta
                this.links = data.links

                return data
            } catch (error) {
                useUiStore().error('Failed to load tasks.')
                throw error
            } finally {
                this.loading = false
            }
        },

        async createTask(payload) {
            const ui = useUiStore()

            this.errors = {}
            this.submitting = true

            try {
                await api.post('/api/tasks', payload)
                await this.fetchTasks(1)
                ui.success('Task created.')
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors || {}
                } else {
                    ui.error('Task creation failed.')
                }

                throw error
            } finally {
                this.submitting = false
            }
        },

        async updateTask(id, payload) {
            const ui = useUiStore()

            this.errors = {}
            this.submitting = true

            try {
                const { data } = await api.put(`/api/tasks/${id}`, payload)

                const index = this.tasks.findIndex(task => task.id === id)
                if (index !== -1) {
                    this.tasks[index] = data.data
                }

                if (this.currentTask?.id === id) {
                    this.currentTask = data.data
                }

                ui.success('Task updated.')

                return data.data
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors || {}
                } else {
                    ui.error('Task update failed.')
                }

                throw error
            } finally {
                this.submitting = false
            }
        },

        async deleteTask(id) {
            const ui = useUiStore()

            try {
                await api.delete(`/api/tasks/${id}`)
                await this.fetchTasks(this.filters.page)
                ui.info('Task deleted.')
            } catch (error) {
                ui.error('Task deletion failed.')
                throw error
            }
        },

        async toggleTask(task) {
            return await this.updateTask(task.id, {
                title: task.title,
                description: task.description,
                completed: !task.completed,
            })
        },

        setSearch(search) {
            this.filters.search = search
        },

        setCompletedFilter(value) {
            this.filters.completed = value
        },

        setPerPage(value) {
            this.filters.per_page = value
        },

        clearErrors() {
            this.errors = {}
        },

        clearCurrentTask() {
            this.currentTask = null
        },
    },
})
