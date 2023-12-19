<template>
  <a :href="props.article.pageUrl" target="_blank" class="text-decoration-none no-underline hover:no-underline">
    <div class="my-3">
      <v-img v-if="props.article.imageUrl" :src="props.article.imageUrl" height="300px" alt="Article image"></v-img>
      <!-- TODO: Replace with a placeholder image -->
      <v-img v-else src="https://placehold.co/600x400.png" height="300px" alt="Article image placeholder"></v-img>
      <div class="px-2">
        <div class="text-h6 my-2 text-black hover:text-black" style="line-height: 1.5;">{{ props.article.title }}</div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Article } from "../types/ArticleInterface.ts";

const props = defineProps({
  article: {
    type: Object as PropType<Article>,
    required: true,
  },
});
</script>

<style scoped>
.no-underline {
  text-decoration: none !important;
}
.no-underline:hover {
  text-decoration: none !important;
}
</style>
