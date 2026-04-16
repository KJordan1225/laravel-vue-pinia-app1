<template>
    <div class="app-shell">
        <Navbar />
        <main class="page-container">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
.app-shell {
    min-height: 100vh;
    background: #f4f6f9;
}

.page-container {
    max-width: 960px;
    margin: 0 auto;
    padding: 1rem;
}
</style>
