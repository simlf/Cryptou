<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import FilterArticles from "./FilterArticles.vue";

interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  pageUrl: string;
}

interface Pagination {
  currentPage: number;
  pageSize: number;
  totalArticles: number;
}

const articles = ref<Article[]>([]);
const pagination = reactive<Pagination>({
  currentPage: 1,
  pageSize: 9,
  totalArticles: 0
});

const errorState = ref(false);
const errorMessage = ref('');

const fetchArticles = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/articles?page=${pagination.currentPage}&limit=${pagination.pageSize}`);
    articles.value = response.data.articles;
    pagination.totalArticles = response.data.totalArticles;
  } catch (error) {
    errorState.value = true;
    errorMessage.value = 'Failed to load articles. Please try again later.';  }
};

const changePage = (page: number) => {
  console.log(`Changing to page ${page}`);
  pagination.currentPage = page;
  fetchArticles();
};

const handleFeedsUpdate = (feeds) => {
  // Logic to handle updated feeds
  console.log('Updated feeds:', feeds);
  // Example: fetchArticles({ feeds });
};

const handleKeywordsUpdate = (keywords) => {
  // Logic to handle updated keywords
  console.log('Updated keywords:', keywords);
  // Example: fetchArticles({ keywords });
};

onMounted(fetchArticles);
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h2 class="text-h4 text-center mb-4">Highlighting Crypto Updates</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-alert v-if="errorState" type="error" dismissible>
        {{ errorMessage }}
      </v-alert>
      <FilterArticles
          @update-feeds="handleFeedsUpdate"
          @update-keywords="handleKeywordsUpdate"
      />
      <v-col v-for="article in articles" :key="article.id" cols="12" sm="6" md="4">
        <a :href="article.pageUrl" target="_blank" class="text-decoration-none no-underline hover:no-underline">
          <div class="my-3">
            <v-img v-if="article.imageUrl" :src="article.imageUrl" height="300px" alt="Article image"></v-img>
            <!-- TODO: Replace with a placeholder image -->
            <v-img v-else src="https://placehold.co/600x400.png" height="300px" alt="Article image placeholder"></v-img>
            <div class="px-2">
              <div class="text-h6 my-2 text-black hover:text-black" style="line-height: 1.5;">{{ article.title }}</div>
            </div>
          </div>
        </a>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-btn v-if="pagination.currentPage > 1"
             @click="changePage(pagination.currentPage - 1)" class="my-4">
        Prev
      </v-btn>
      <v-btn v-if="pagination.currentPage * pagination.pageSize < pagination.totalArticles"
             @click="changePage(pagination.currentPage + 1)" class="my-4">
        Next
      </v-btn>
    </v-row>
  </v-container>
</template>

<style>
.no-underline {
  text-decoration: none !important;
}
.no-underline:hover {
  text-decoration: none !important;
}
</style>