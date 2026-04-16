<template>
    <section class="auth-card">
        <h1>Register</h1>

        <form class="auth-form" @submit.prevent="submit">
            <div class="form-group">
                <label for="name">Name</label>
                <input id="name" v-model="form.name" type="text" autocomplete="name" />
                <small v-if="errors.name" class="error-text">
                    {{ errors.name[0] }}
                </small>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="form.email" type="email" autocomplete="email" />
                <small v-if="errors.email" class="error-text">
                    {{ errors.email[0] }}
                </small>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    autocomplete="new-password"
                />
                <small v-if="errors.password" class="error-text">
                    {{ errors.password[0] }}
                </small>
            </div>

            <div class="form-group">
                <label for="password_confirmation">Confirm Password</label>
                <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    autocomplete="new-password"
                />
            </div>

            <button class="primary-btn" type="submit" :disabled="loading">
                {{ loading ? 'Registering...' : 'Register' }}
            </button>
        </form>

        <p class="auth-footer">
            Already have an account?
            <router-link :to="{ name: 'login' }">Login</router-link>
        </p>
    </section>
</template>

<script setup>
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'


const router = useRouter()
const authStore = useAuthStore()
const { loading, errors } = storeToRefs(authStore)

const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
})

async function submit() {
    await authStore.register(form)
    router.push({ name: 'tasks' })
}
</script>

<style scoped>
.auth-card {
    max-width: 520px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
}

.auth-form {
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
input[type='email'],
input[type='password'] {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
}

.primary-btn {
    background: #0d6efd;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    cursor: pointer;
}

.error-text {
    color: #dc3545;
}

.auth-footer {
    margin-top: 1rem;
}
</style>
