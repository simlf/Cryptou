<template>
  <div class="market-wrapper" v-if="loadingMarket">
    <div class="loader"></div>
  </div>
  <div class="market-wrapper" :class="{'mobile': mobile, 'desktop': !mobile}" v-else>
    <div class="market-item"
         v-for="crypto in cryptocurrencyNames"
         :key="crypto.id">
      <CryptoMarket :cryptoId="crypto.id" />
    </div>
  </div>
  <hr class="separator">
  <h1 class="title-section">Highlighting Crypto Updates</h1>
  <div class="article-wrapper" v-if="loadingArticle">
    <div class="loader"></div>
  </div>
  <div v-else>
    <div v-if="mobile" class="article-wrapper">
      <v-carousel cycle height="450" hide-delimiters progress="primary" prev-icon="mdi-arrow-left" next-icon="mdi-arrow-right">
        <v-carousel-item
            v-for="(article, i) in lastArticle"
            :key="i">
          <Articles :article="article" />
        </v-carousel-item>
      </v-carousel>
      <custom-button color-background="var(--primary-dark-green)" message="See all"/>
    </div>
    <div class="article-wrapper" v-else>
      <div class="article-item"
           v-for="article in lastArticle"
           :key="article.id">
        <Articles :article="article" />
      </div>
      <custom-button color-background="var(--primary-dark-green)" message="See all" @click="this.$router.push('/articles')"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import CryptoMarket from "@components/CryptoMarket.vue";
import Articles from "@/components/ArticleComponent.vue";
import CustomButton from "@components/CustomButton.vue";
import axios from "axios";
import { useCryptoStore } from "../store/cryptosStore.ts";
import {onMounted, ref} from "vue";
import { useDisplay } from "vuetify";

import { Article } from "../types/ArticleInterface.ts";

const { mobile } = useDisplay();

const cryptoStore = useCryptoStore();
let loadingMarket = ref(true);
let loadingArticle = ref(true);
let cryptocurrencyNames: any = [];
let lastArticle: Article[] = [];

async function fetchLastArticle(): Promise<Article[]> {
  let response;
  if (mobile)
    response = await axios.get(`http://localhost:3000/articles?page=1&pageSize=6`)
  else
    response = await axios.get(`http://localhost:3000/articles?page=1&pageSize=6`)
  return response.data.articles
}

onMounted(async () => {
  if (cryptoStore.cryptocurrencyNames.length === 0)
    await cryptoStore.fetchCryptos();
  cryptocurrencyNames = cryptoStore.cryptocurrencyNames;
  loadingMarket.value = false;
  lastArticle = await fetchLastArticle();
  loadingArticle.value = false;
});
</script>

<style scoped>
.market-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: 100vw;
  padding: 10px;
}

.market-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-width: 250px; /* Ensures a minimum width */
  padding: 10px;
}

.mobile {
  justify-content: flex-start;
  padding-left: 20px;
}

.desktop {
  justify-content: space-around;
}

.title-section {
  text-align: left;
  font-size: 1.6rem;
  font-weight: 500;
  margin-left: 10px;
}

.article-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100vw;
  padding: 10px;
}

.article-item {
  flex: 1 0 30%;
  max-width: 30%;
  margin: 1%;
}

.loader {
    animation: spinningColor 1.5s ease-in-out infinite;
    margin: 50px auto;
    border: 5px double #f0eff5;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }

  .separator {
    width: 70%;
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: auto;
    margin-right: auto;
    border-color: var(--primary-yellow-light);
  }

  @keyframes spinningColor {
    0% {
      transform: rotate(360deg);
      border-top: 5px dashed rgb(182, 221, 219);
      border-bottom: 5px dashed rgb(72, 169, 166);
    }
    25% {
      border-top: 5px dashed rgb(182, 221, 219);
      border-bottom: 5px dashed rgb(72, 169, 166);
    }
    50% {
      border-top: 5px dashed rgb(72, 169, 166);
      border-bottom: 5px dashed rgb(182, 221, 219);
    }
    75% {
      border-top: 5px dashed rgb(72, 169, 166);
      border-bottom: 5px dashed rgb(182, 221, 219);
    }
    100% {
      border-top: 5px dashed rgb(182, 221, 219);
      border-bottom: 5px dashed rgb(72, 169, 166);
    }
  }
</style>