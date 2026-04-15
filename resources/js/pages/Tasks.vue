<template>
    <div class="card">
        <h1>Tasks</h1>

        <form @submit.prevent="submitTask" class="task-form">
            <input
                v-model="form.title"
                type="text"
                placeholder="Enter a task title"
            />
            <button type="submit">Add Task</button>
        </form>

        <small v-if="taskStore.errors.title" class="error">
            {{ taskStore.errors.title[0] }}
        </small>

        <div class="stats">
            <p>Total: {{ taskStore.totalTasks }}</p>
            <p>Completed: {{ taskStore.completedTasks.length }}</p>
            <p>Pending: {{ taskStore.pendingTasks.length }}</p>
        </div>

        <TaskList />
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import TaskList from '@/components/TaskList.vue'

const taskStore = useTaskStore()

const form = reactive({
    title: '',
})

onMounted(() => {
    taskStore.fetchTasks()
})

async function submitTask() {
    try {
        await taskStore.createTask({ title: form.title })
        form.title = ''
    } catch (error) {
        console.error('Create task failed:', error)
    }
}
</script>

<style scoped>
.card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.task-form {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.task-form input {
    flex: 1;
    padding: 0.7rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.task-form button {
    background: #198754;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

.stats {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    flex-wrap: wrap;
}

.error {
    color: #dc3545;
}
</style>
