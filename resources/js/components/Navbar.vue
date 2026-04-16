<template>
    <header class="navbar">
        <div class="navbar-left">
            <router-link to="/" class="brand">Task Starter</router-link>
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link v-if="isAuthenticated" to="/tasks" class="nav-link">
                Tasks
            </router-link>
        </div>

        <div class="navbar-right">
            <template v-if="isAuthenticated">
                <span class="welcome">Hi, {{ userName }}</span>
                <button class="danger-btn" @click="handleLogout">Logout</button>
            </template>

            <template v-else>
                <router-link to="/login" class="nav-link">Login</router-link>
                <router-link to="/register" class="nav-link">Register</router-link>
            </template>
        </div>
    </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const { isAuthenticated, userName } = storeToRefs(authStore)

async function handleLogout() {
    await authStore.logout()
    router.push({ name: 'login' })
}
</script>

<style scoped>
.navbar {
    background: #212529;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 1rem;
}

.navbar-left,
.navbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.brand {
    font-weight: 700;
}

.nav-link,
.brand {
    color: #fff;
    text-decoration: none;
}

.nav-link.router-link-active,
.brand.router-link-active {
    text-decoration: underline;
}

.welcome {
    font-size: 0.95rem;
}

.danger-btn {
    background: #dc3545;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.6rem 0.9rem;
    cursor: pointer;
}
</style>
