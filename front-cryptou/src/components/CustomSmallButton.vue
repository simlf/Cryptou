<template>
  <button
    class="custom-button"
    :style="{ backgroundColor: colorBackground }"
    @click="$emit('onClick')"
  >
    {{ message }}
  </button>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true,
  },
  colorBackground: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.custom-button {
  width: auto;
  padding: 5px 10px;
  border-radius: 10px;
  border: none;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
