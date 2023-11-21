<template>
  <input class="custom-text-field"
         :placeholder="placeholder"
         :style="{backgroundColor: colorBackground}"
         :value="modelValue"
         @input="updateValue"/>
</template>

<script setup lang="ts">

defineProps({
  placeholder: {
    type: String,
    required: true
  },
  colorBackground: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.custom-text-field {
  width: 350px;
  height: 50px;
  border-radius: 5px;
  border: none;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.custom-text-field::placeholder {
  padding-left: 10px;
}
</style>
