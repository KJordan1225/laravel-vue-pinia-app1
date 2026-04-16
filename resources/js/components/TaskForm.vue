<template>
    <form class="task-form" @submit.prevent="submitForm">
        <div class="form-group">
            <label for="title">Title</label>
            <input
                id="title"
                v-model="form.title"
                type="text"
                placeholder="Enter task title"
            />
            <small v-if="errors.title" class="error-text">
                {{ errors.title[0] }}
            </small>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea
                id="description"
                v-model="form.description"
                rows="4"
                placeholder="Enter task description"
            ></textarea>
            <small v-if="errors.description" class="error-text">
                {{ errors.description[0] }}
            </small>
        </div>

        <div v-if="isEdit" class="form-group checkbox-row">
            <label class="checkbox-label">
                <input v-model="form.completed" type="checkbox" />
                Completed
            </label>
        </div>

        <div class="button-row">
            <button type="submit" class="primary-btn" :disabled="submitting">
                {{ submitting ? 'Saving...' : buttonText }}
            </button>

            <button
                v-if="isEdit"
                type="button"
                class="secondary-btn"
                @click="$emit('cancel')"
            >
                Cancel
            </button>
        </div>
    </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/tasks'

const props = defineProps({
    modelValue: {
        type: Object,
        default: null,
    },
    isEdit: {
        type: Boolean,
        default: false,
    },
    buttonText: {
        type: String,
        default: 'Save Task',
    },
})

const emit = defineEmits(['saved', 'cancel'])

const taskStore = useTaskStore()
const { errors, submitting } = storeToRefs(taskStore)

const form = reactive({
    title: '',
    description: '',
    completed: false,
})

watch(
    () => props.modelValue,
    (value) => {
        form.title = value?.title ?? ''
        form.description = value?.description ?? ''
        form.completed = value?.completed ?? false
    },
    { immediate: true }
)

const payload = computed(() => ({
    title: form.title,
    description: form.description,
    completed: form.completed,
}))

async function submitForm() {
    taskStore.clearErrors()

    let savedTask = null

    if (props.isEdit && props.modelValue?.id) {
        savedTask = await taskStore.updateTask(props.modelValue.id, payload.value)
    } else {
        savedTask = await taskStore.createTask({
            title: form.title,
            description: form.description,
            completed: false,
        })

        form.title = ''
        form.description = ''
        form.completed = false
    }

    emit('saved', savedTask)
}
</script>

<style scoped>
.task-form {
    display: grid;
    gap: 1rem;
}

.form-group {
    display: grid;
    gap: 0.4rem;
}

label {
    font-weight: 600;
}

input[type='text'],
textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 1rem;
}

.checkbox-row {
    display: flex;
    align-items: center;
}

.checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
}

.button-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.primary-btn {
    background: #0d6efd;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    cursor: pointer;
}

.secondary-btn {
    background: #6c757d;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    cursor: pointer;
}

.error-text {
    color: #dc3545;
}
</style>
