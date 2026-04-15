<template>
    <div class="card">
        <h1>Login</h1>

        <form @submit.prevent="submit">
            <div class="form-group">
                <label>Email</label>
                <input v-model="form.email" type="email" />
                <small v-if="authStore.errors.email" class="error">
                    {{ authStore.errors.email[0] }}
                </small>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input v-model="form.password" type="password" />
                <small v-if="authStore.errors.password" class="error">
                    {{ authStore.errors.password[0] }}
                </small>
            </div>

            <button type="submit" :disabled="authStore.loading">
                {{ authStore.loading ? 'Logging in...' : 'Login' }}
            </button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
    email: 'shadow902@gmail.com',
    password: 'password',
})

async function submit() {
    try {
        await authStore.login(form)
        router.push('/tasks')
    } catch (error) {
        console.error('Login failed:', error)
    }
}
</script>

<style scoped>
.card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    max-width: 500px;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    background: #0d6efd;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

.error {
    color: #dc3545;
    display: block;
    margin-top: 0.25rem;
}
</style>
