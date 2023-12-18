<template>
  <v-container class="selector-wrapper">
    <v-autocomplete
        v-model="selectedValue"
        :items="arrayChoices"
        :background-color="colorBackground"
        :label="placeholder"
        multiple
        class="custom-selector"
        :search-input.sync="search"
    >
      <template v-slot:selection="{ item, index }">
        <v-chip v-if="index < 2">
          <span>{{ item.title }}</span>
        </v-chip>
        <span v-if="index === 2" class="text-grey text-caption align-self-center">
          (+{{ selectedValue.length - 2 }} others)
        </span>
      </template>
    </v-autocomplete>
  </v-container>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';

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

let selectedValue = ref([]);
const search = ref('');
const emit = defineEmits(['update:modelValue']);

watch(selectedValue, (newVal) => {
  emit('update:modelValue', newVal);
});

</script>

<style scoped>
.custom-selector {
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
