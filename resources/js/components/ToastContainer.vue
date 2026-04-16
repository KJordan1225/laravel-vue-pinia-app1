<template>
    <div class="toast-wrap position-fixed top-0 end-0 p-3" style="z-index: 1080;">
        <div
            v-for="toast in toasts"
            :key="toast.id"
            class="toast show align-items-center border-0 mb-2"
            :class="toastClass(toast.type)"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div class="d-flex">
                <div class="toast-body">
                    {{ toast.message }}
                </div>
                <button
                    type="button"
                    class="btn-close btn-close-white me-2 m-auto"
                    aria-label="Close"
                    @click="uiStore.removeToast(toast.id)"
                ></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const { toasts } = storeToRefs(uiStore)

function toastClass(type) {
    switch (type) {
        case 'success':
            return 'text-bg-success'
        case 'danger':
            return 'text-bg-danger'
        case 'info':
            return 'text-bg-info'
        default:
            return 'text-bg-secondary'
    }
}
</script>
