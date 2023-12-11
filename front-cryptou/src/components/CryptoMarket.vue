<template>
  <div class="crypto-wrapper" v-if="loading">
    Loading...
  </div>
  <div class="crypto-wrapper" v-else>
    <img :src="crypto.imageUrl" class="crypto-image">
    <div class="crypto-info">
      <p style="font-weight: bold">{{crypto.cryptoName}}</p>
      <p>{{crypto.currentPrice}}
        <sup v-if="crypto.change >= 0" style="color: green;">{{crypto.change}}</sup>
        <sup v-else style="color: red;">{{crypto.change}}</sup>
      </p>
      <p>{{crypto.volume}} <sup>Vol / 24h</sup></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { CryptoData } from "@/types/cryptoInterface.ts";
import {onMounted, ref} from "vue";

let crypto: CryptoData;
let loading = ref(true);
const props = defineProps({
  cryptoId: {
    type: String,
    required: true,
  },
});

async function fetchData(): Promise<CryptoData> {
  const response = await axios.get(`http://localhost:3000/cryptos/${props.cryptoId}`)
  return response.data
}

onMounted(async () => {
  crypto = await fetchData();
  loading.value = false;
  console.log(crypto);
});
</script>

<style scoped>
  .crypto-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 250px;
    padding: 10px;
  }
  .crypto-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    padding: 0 10px;
  }
  .crypto-image {
    width: 75px;
    height: 75px;
  }
</style>
