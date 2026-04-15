<template>
    <div>
        <div v-if="taskStore.loading">Loading tasks...</div>

        <ul v-else class="task-list">
            <li v-for="task in taskStore.tasks" :key="task.id" class="task-item">
                <label>
                    <input
                        type="checkbox"
                        :checked="task.completed"
                        @change="taskStore.toggleTask(task.id)"
                    />
                    <span :class="{ done: task.completed }">
                        {{ task.title }}
                    </span>
                </label>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useTaskStore } from '@/stores/tasks'

const taskStore = useTaskStore()
</script>

<style scoped>
.task-list {
    list-style: none;
    padding: 0;
}

.task-item {
    background: white;
    margin-bottom: 0.75rem;
    padding: 0.9rem 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.done {
    text-decoration: line-through;
    color: #777;
}
</style>
