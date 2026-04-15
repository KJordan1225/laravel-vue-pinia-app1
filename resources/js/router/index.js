import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Tasks from '@/pages/Tasks.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { guest: true },
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: Tasks,
        meta: { requiresAuth: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    if (!authStore.initialized) {
        await authStore.fetchUser()
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next({ name: 'login' })
    }

    if (to.meta.guest && authStore.isAuthenticated) {
        return next({ name: 'tasks' })
    }

    next()
})

export default router
