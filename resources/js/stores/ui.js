import { defineStore } from 'pinia'

let nextToastId = 1

export const useUiStore = defineStore('ui', {
    state: () => ({
        toasts: [],
    }),

    actions: {
        addToast(message, type = 'success', timeout = 3000) {
            const id = nextToastId++

            this.toasts.push({
                id,
                message,
                type,
            })

            if (timeout > 0) {
                window.setTimeout(() => {
                    this.removeToast(id)
                }, timeout)
            }

            return id
        },

        removeToast(id) {
            this.toasts = this.toasts.filter(toast => toast.id !== id)
        },

        success(message) {
            this.addToast(message, 'success')
        },

        error(message) {
            this.addToast(message, 'danger', 5000)
        },

        info(message) {
            this.addToast(message, 'info')
        },
    },
})
