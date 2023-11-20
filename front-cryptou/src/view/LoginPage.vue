<script setup lang="ts">
import { ref } from "vue";
import LoginForm from "@/components/LoginForm.vue";
</script>

<template>
  <div class="w-full mx-auto px-1 sm:px-4 lg:px-0 sm:max-w-3xl">
    <div class="sm:flex items-center justify-between">
      <h2 class="text-4xl ml-2">Se connecter</h2>
    </div>
    <LoginForm />
  </div>
</template>

<style scoped></style>
