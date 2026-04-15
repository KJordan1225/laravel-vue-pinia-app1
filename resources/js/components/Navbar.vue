<template>
    <nav class="navbar">
        <div class="nav-left">
            <router-link to="/">Home</router-link>
            <router-link to="/tasks">Tasks</router-link>
        </div>

        <div class="nav-right">
            <template v-if="authStore.isAuthenticated">
                <span class="user-name">Welcome, {{ authStore.user?.name }}</span>
                <button @click="handleLogout">Logout</button>
            </template>

            <template v-else>
                <router-link to="/login">Login</router-link>
            </template>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
    await authStore.logout()
    router.push('/login')
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #212529;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.nav-left,
.nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

a {
    color: white;
    text-decoration: none;
}

a.router-link-active {
    font-weight: bold;
    text-decoration: underline;
}

button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 0.9rem;
    border-radius: 4px;
    cursor: pointer;
}

.user-name {
    font-size: 0.95rem;
}
</style>
