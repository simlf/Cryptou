<template>
  <v-container>
    <v-row justify="start">
      <v-col cols="6" md="3">
        <v-combobox
            clearable
            chips
            multiple
            label="Select keyword(s)"
            :items="keywords"
            item-title="keyword"
            item-value="keyword"
            variant="solo-inverted"
            @input="onKeywordsChange"
        ></v-combobox>
      </v-col>

      <v-col cols="6" md="3">
        <v-combobox
            clearable
            chips
            multiple
            label="Select feed(s)"
            :items="feeds"
            item-title="feed"
            item-value="feed"
            variant="solo-inverted"
            @input="onFeedsChange"
        ></v-combobox>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from "axios";

const emits = defineEmits(['update-feeds', 'update-keywords']);

interface Keywords {
  keyword: string;
}

interface Feeds {
  feed: string;
}

interface FeedResponse {
  name: string;
}

const selectedFeeds = ref([]);
const selectedKeywords = ref([]);

const keywords = ref<Keywords[]>([]);
const feeds = ref<Feeds[]>([]);

const onKeywordsChange = (newSelectedKeywords) => {
  console.log("newSelectedKeywords", newSelectedKeywords);
  emits('update-keywords', newSelectedKeywords);
};

const onFeedsChange = (newSelectedFeeds) => {
  console.log("newSelectedFeeds", newSelectedFeeds);
  emits('update-feeds', newSelectedFeeds);
};

const errorState = ref(false);
const errorMessage = ref('');

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

onMounted(async () => {
  keywords.value = await fetchData<Keywords, Keywords>(
      'http://localhost:3000/keywords',
      (kw) => ({ keyword: kw.keyword })
  );

  feeds.value = await fetchData<FeedResponse, Feeds>(
      'http://localhost:3000/feeds',
      (fd) => ({ feed: fd.name })
  );
});
</script>