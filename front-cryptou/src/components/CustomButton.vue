<template>
  <button class="custom-button" :style="{backgroundColor: colorBackground}" @click="$emit('onClick')">
    {{message}}
  </button>
</template>

<script setup lang="ts">

defineProps({
  message: {
    type: String,
    required: true
  },
  colorBackground: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.custom-button {
  width: 300px;
  height: 50px;
  border-radius: 10px;
  border: none;
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.custom-button:hover {
  transform: scale(1.05);
}

</style>
