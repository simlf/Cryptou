<template>
  <v-container class="selector-wrapper">
    <v-select
        :label="placeholder"
        :items="arrayChoices"
        :bg-color="colorBackground"
        v-model="selectedValue"
        class="custom-selector"
    />
  </v-container>
</template>

<script setup lang="ts">
import { watch, ref, defineEmits } from 'vue';

defineProps({
  placeholder: {
    type: String,
    required: true
  },
  colorBackground: {
    type: String,
    required: true
  },
  arrayChoices: {
    type: Array,
    required: true
  },
})

let selectedValue = ref('')
const emit = defineEmits(['update:modelValue'])

watch(selectedValue, (newVal) => {
  emit('update:modelValue', newVal);
});

</script>


<style scoped>
.custom-selector{
  width: 350px;
  height: 50px;
  border-radius: 5px;
  border: none;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.selector-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  height: 100%;
}
</style>
