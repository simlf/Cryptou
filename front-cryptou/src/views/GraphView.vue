<template>
  <div class="graph-wrapper" v-if="loading">
    <div class="loader"></div>
  </div>
  <div class="graph-wrapper" v-else :key="currentId">
    <div class="header-wrapper">
      <h1>{{currentCrypto}}</h1>
      <img :src="cryptoData[0].imageUrl" alt="crypto logo" class="crypto-logo">
      <CustomSelectorOne placeholder="Change crypto" color-background="var(--primary-light-green)" :arrayChoices="cryptocurrencyNames.map(crypto => crypto.name)" @update:modelValue="selectedCurrency = $event"/>
    </div>
    <div class="table-graph-wrapper">
      <v-data-table-virtual
          :headers="headers"
          :items="cryptoData"
          height="110"
          color="surface">
      </v-data-table-virtual>
      <CryptoGraph :cryptoId="parseInt(currentId)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import { useRoute } from 'vue-router';
import { useCryptoStore } from "@/store/cryptosStore.ts";
import axios from "axios";
import CryptoGraph from "@components/CryptoGraph.vue";
import CustomSelectorOne from "@components/CustomSelectorOne.vue";

import { CryptoData } from "@/types/cryptoInterface.ts";

let currentId = ref('');
let currentCrypto = ref('');
let loading = ref(true);
let cryptoData: CryptoData[] = [];
let cryptocurrencyNames: any = [];
let selectedCurrency = ref("");

const headers = [
  { title: 'Crypto Name', key: 'cryptoName' },
  { title: 'Current Price', key: 'currentPrice' },
  { title: 'Volume', key: 'volume' },
  { title: 'Change', key: 'change' },
];

const cryptoStore = useCryptoStore();

async function fetchCryptoData(): Promise<CryptoData> {
  const response = await axios.get(`http://localhost:3000/cryptos?cmids=${currentId.value}`);
  const fetchedData = response.data[0];

  console.log(fetchedData);
  fetchedData.change = fetchedData.change + ' %'
  fetchedData.cryptoName = cryptoStore.cryptocurrencyNames[currentId.value - 1].name;
  return fetchedData;
}

watch(selectedCurrency, async (newVal) => {
  loading.value = true;
  currentId.value = cryptocurrencyNames.find((crypto: any) => crypto.name === newVal).id;
  currentCrypto.value = newVal;
  cryptoData = [await fetchCryptoData()];
  loading.value = false;
});


onMounted(async () => {
  const route = useRoute();
  if (!route.params.cmid)
    currentId.value = '1';
  else
    currentId.value = route.params.cmid;
  if (cryptoStore.cryptocurrencyNames.length === 0)
    await cryptoStore.fetchCryptos();
  cryptocurrencyNames = cryptoStore.cryptocurrencyNames;
  currentCrypto.value = cryptocurrencyNames[currentId.value - 1].name;
  cryptoData.push(await fetchCryptoData());
  loading.value = false;
});


</script>

<style scoped>
  .graph-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
  }

  .table-graph-wrapper {
    width: 100%;
    height: 100%;
    max-width: 1000px;
    margin: 0 auto;
    margin-bottom: 100px;
  }

  .crypto-logo {
    width: 100px;
    height: 100px;
    margin: 0 10px;
  }

  .header-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
  }

  .loader {
    animation: spinningColor 1.5s ease-in-out infinite;
    margin: 50px auto;
    border: 5px double #f0eff5;
    border-radius: 50%;
    width: 50px;
    height: 50px;
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
