<template>
    <div>
        <div v-if="loading" class="d-grid gap-3">
            <div class="card border-0 shadow-sm" v-for="n in 3" :key="n">
                <div class="card-body">
                    <div class="placeholder-glow">
                        <span class="placeholder col-6"></span>
                        <span class="placeholder col-8 mt-2"></span>
                        <span class="placeholder col-4 mt-3"></span>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="!tasks.length" class="empty-state">
            You do not have any tasks yet.
        </div>

        <div v-else class="task-list">
            <article v-for="task in tasks" :key="task.id" class="task-card">
                <div class="task-header">
                    <div>
                        <h3 :class="{ done: task.completed }">{{ task.title }}</h3>
                        <p v-if="task.description" class="description">
                            {{ task.description }}
                        </p>
                    </div>

                    <span
                        class="status-pill"
                        :class="task.completed ? 'status-complete' : 'status-pending'"
                    >
                        {{ task.completed ? 'Completed' : 'Pending' }}
                    </span>
                </div>

                <div class="task-actions">
                    <button class="primary-btn small-btn" @click="$emit('edit', task)">
                        Edit
                    </button>

                    <button class="success-btn small-btn" @click="handleToggle(task)">
                        {{ task.completed ? 'Mark Pending' : 'Mark Complete' }}
                    </button>

                    <button class="danger-btn small-btn" @click="handleDelete(task.id)">
                        Delete
                    </button>
                </div>
            </article>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/tasks'

defineEmits(['edit'])

const taskStore = useTaskStore()
const { tasks, loading } = storeToRefs(taskStore)

async function handleToggle(task) {
    await taskStore.toggleTask(task)
}

async function handleDelete(id) {
    const confirmed = window.confirm('Delete this task?')

    if (!confirmed) {
        return
    }

    await taskStore.deleteTask(id)
}
</script>

<style scoped>
.task-list {
    display: grid;
    gap: 1rem;
}

.task-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
}

.task-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
}

h3 {
    margin: 0 0 0.4rem;
}

.done {
    text-decoration: line-through;
    color: #6c757d;
}

.description {
    margin: 0;
    color: #555;
}

.status-pill {
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    align-self: flex-start;
}

.status-complete {
    background: #d1e7dd;
    color: #0f5132;
}

.status-pending {
    background: #fff3cd;
    color: #664d03;
}

.task-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 1rem;
}

.small-btn {
    border: none;
    border-radius: 6px;
    padding: 0.6rem 0.9rem;
    color: #fff;
    cursor: pointer;
}

.primary-btn {
    background: #0d6efd;
}

.success-btn {
    background: #198754;
}

.danger-btn {
    background: #dc3545;
}

.empty-state {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
}
</style>
