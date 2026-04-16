<template>
    <div class="d-grid gap-4">
        <div class="card border-0 shadow-sm">
            <div class="card-body">
                <h1 class="h3 mb-3">Create Task</h1>
                <TaskForm
                    :is-edit="false"
                    button-text="Create Task"
                    @saved="handleCreated"
                />
            </div>
        </div>

        <div v-if="editingTask" class="card border-0 shadow-sm">
            <div class="card-body">
                <h2 class="h4 mb-3">Edit Task</h2>
                <TaskForm
                    :model-value="editingTask"
                    :is-edit="true"
                    button-text="Update Task"
                    @saved="handleUpdated"
                    @cancel="cancelEdit"
                />
            </div>
        </div>

        <div class="card border-0 shadow-sm">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <h2 class="h4 mb-0">Your Tasks</h2>
                    <div class="d-flex gap-3 flex-wrap small text-muted">
                        <span>Total: {{ totalTasks }}</span>
                        <span>Visible completed: {{ completedTasksCount }}</span>
                        <span>Visible pending: {{ pendingTasksCount }}</span>
                    </div>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-12 col-md-5">
                        <label class="form-label">Search</label>
                        <input
                            v-model="searchInput"
                            type="text"
                            class="form-control"
                            placeholder="Search tasks"
                        />
                    </div>

                    <div class="col-12 col-md-3">
                        <label class="form-label">Status</label>
                        <select v-model="completedFilter" class="form-select" @change="applyFilters">
                            <option value="">All</option>
                            <option value="true">Completed</option>
                            <option value="false">Pending</option>
                        </select>
                    </div>

                    <div class="col-12 col-md-2">
                        <label class="form-label">Per Page</label>
                        <select v-model.number="perPage" class="form-select" @change="applyFilters">
                            <option :value="5">5</option>
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                        </select>
                    </div>

                    <div class="col-12 col-md-2 d-flex align-items-end gap-2">
                        <button class="btn btn-outline-secondary w-100" @click="resetFilters">
                            Reset
                        </button>
                    </div>
                </div>

                <TaskList @edit="startEdit" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/tasks'
import TaskForm from '@/components/TaskForm.vue'
import TaskList from '@/components/TaskList.vue'

const taskStore = useTaskStore()
const { totalTasks, completedTasksCount, pendingTasksCount, filters } = storeToRefs(taskStore)

const editingTask = ref(null)
const searchInput = ref(filters.value.search)
const completedFilter = ref(filters.value.completed)
const perPage = ref(filters.value.per_page)

let searchTimer = null

onMounted(async () => {
    await taskStore.fetchTasks()
})

watch(searchInput, () => {
    clearTimeout(searchTimer)

    searchTimer = setTimeout(() => {
        applyFilters()
    }, 350)
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

async function applyFilters() {
    taskStore.setSearch(searchInput.value)
    taskStore.setCompletedFilter(completedFilter.value)
    taskStore.setPerPage(perPage.value)

    await taskStore.fetchTasks(1)
}

async function resetFilters() {
    searchInput.value = ''
    completedFilter.value = ''
    perPage.value = 10

    await applyFilters()
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
