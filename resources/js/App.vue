<template>
    <div class="bg-light min-vh-100">
        <Navbar />
        <main class="container py-4">
            <router-view />
        </main>
        <ToastContainer />
    </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import ToastContainer from '@/components/ToastContainer.vue'
</script>
