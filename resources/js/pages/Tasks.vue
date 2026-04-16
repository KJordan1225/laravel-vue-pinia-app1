<template>
    <section class="page-grid">
        <article class="card">
            <h1>Create Task</h1>
            <TaskForm
                :is-edit="false"
                button-text="Create Task"
                @saved="handleCreated"
            />
        </article>

        <article v-if="editingTask" class="card">
            <h2>Edit Task</h2>
            <TaskForm
                :model-value="editingTask"
                :is-edit="true"
                button-text="Update Task"
                @saved="handleUpdated"
                @cancel="cancelEdit"
            />
        </article>

        <article class="card">
            <div class="stats-row">
                <span>Total: {{ totalTasks }}</span>
                <span>Completed: {{ completedTasks.length }}</span>
                <span>Pending: {{ pendingTasks.length }}</span>
            </div>

            <TaskList @edit="startEdit" />
        </article>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/tasks'
import TaskForm from '@/components/TaskForm.vue'
import TaskList from '@/components/TaskList.vue'

const taskStore = useTaskStore()
const { totalTasks, completedTasks, pendingTasks } = storeToRefs(taskStore)

const editingTask = ref(null)

onMounted(async () => {
    await taskStore.fetchTasks()
})

function startEdit(task) {
    editingTask.value = { ...task }
}

function cancelEdit() {
    editingTask.value = null
    taskStore.clearErrors()
}

function handleCreated() {
    taskStore.clearErrors()
}

function handleUpdated() {
    editingTask.value = null
    taskStore.clearErrors()
}
</script>

<style scoped>
.page-grid {
    display: grid;
    gap: 1.5rem;
}

.card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
}

.stats-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    font-weight: 600;
}
</style>
