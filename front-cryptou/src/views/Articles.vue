<script setup lang="ts">
import {ref, onMounted, reactive, watch} from 'vue';
import axios from 'axios';
import CustomSelectorMulti from "@components/CustomSelectorMulti.vue";

const dateRange = ref();

const disableFutureDates = (date) => {
  const today = new Date();
  return date >= today;
};

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

const changePage = (page: number) => {
  console.log(`Changing to page ${page}`);
  pagination.currentPage = page;
  fetchArticles();
};

interface Keywords {
  keyword: string;
}

interface Feeds {
  name: string;
}

type TransformFunction<T, U> = (item: T) => U;

async function fetchData<T, U>(url: string, transform: TransformFunction<T, U>): Promise<U[]> {
  try {
    const response = await axios.get<T[]>(url);
    return response.data.map(transform);
  } catch (error) {
    errorState.value = true;
    errorMessage.value = `Failed to load data from ${url}. Please try again later.`;
    return [];
  }
}

const selectedKeywords = ref<string[]>([]);
const selectedFeeds = ref<string[]>([]);

const feeds = ref<string[]>([]);
const keywords = ref<string[]>([]);

const fetchArticles = async () => {
  try {
    let url = `http://localhost:3000/articles?page=${pagination.currentPage}&pageSize=${pagination.pageSize}`;

    if (selectedKeywords.value.length > 0) {
      const keywordsParam = selectedKeywords;
      url += `&keywords=${encodeURIComponent(keywordsParam.value)}`;
    }

    if (selectedFeeds.value.length > 0) {
      const feedsParam = selectedFeeds;
      url += `&feedName=${encodeURIComponent(feedsParam.value)}`;
    }

    if (dateRange.value) {
      const [startDate, endDate] = dateRange.value;
      url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    }

    const response = await axios.get(url);
    articles.value = response.data.articles;
    pagination.totalArticles = response.data.totalArticles;
  } catch (error) {
    errorState.value = true;
    errorMessage.value = 'Failed to load articles. Please try again later.';
  }
};


watch([selectedKeywords, selectedFeeds, dateRange], () => {
  fetchArticles();
})

onMounted(async () => {
  keywords.value = await fetchData<Keywords, string>(
      'http://localhost:3000/keywords',
      (kw) => kw.keyword
  );

  feeds.value = await fetchData<Feeds, string>(
      'http://localhost:3000/feeds',
      (fd) => fd.name
  );
  fetchArticles();
});
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h2 class="text-h4 text-center mb-4">Highlighting Crypto Updates</h2>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-alert v-if="errorState" type="error" dismissible>
        {{ errorMessage }}
      </v-alert>
      <v-col cols="6" md="4">
        <CustomSelectorMulti
            v-model="selectedKeywords"
            :arrayChoices="keywords"
            placeholder="Select keyword(s)"
            colorBackground="#48A9A6"
        />
      </v-col>
      <v-col cols="6" md="4">
        <CustomSelectorMulti
            v-model="selectedFeeds"
            :arrayChoices="feeds"
            placeholder="Select feed(s)"
            colorBackground="#48A9A6"
        />
      </v-col>
      <v-col cols="2" md="2">
        <VueDatePicker v-model="dateRange" range :enable-time-picker="false" :disabled-dates="disableFutureDates"></VueDatePicker>
      </v-col>
    </v-row>

      <v-row>
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