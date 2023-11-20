<script setup lang="ts">
import { RouterView } from "vue-router";
import LoginPage from "@/view/LoginPage.vue";
</script>

<template>
  <div>
    <h1>Cryptou</h1>
    <LoginPage />
    <router-view />
  </div>
</template>

<style scoped></style>
