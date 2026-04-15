<template>
    <div class="container py-4">
        <Navbar />
        <router-view />
    </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style>
body {
    font-family: Arial, sans-serif;
    background: #f8f9fa;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 960px;
    margin: 0 auto;
}
</style>
