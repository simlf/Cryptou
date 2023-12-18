<template>
  <router-link :to="`/graph/${props.cryptoId}`" class="text-decoration-none text-black">
    <div class="crypto-wrapper" v-if="loading">
      <div class="loader"></div>
    </div>
    <div class="crypto-wrapper" v-else>
      <img :src="crypto.imageUrl" alt="crypto logo" class="crypto-image">
      <div class="crypto-info">
        <p style="font-weight: bold">{{crypto.cryptoName}}</p>
        <p>{{crypto.currentPrice}}
          <sup v-if="crypto.change >= 0" style="color: green;">+{{crypto.change}} %</sup>
          <sup v-else style="color: red;">{{crypto.change}} %</sup>
        </p>
        <p>{{crypto.volume}} <sup>Vol / 24h</sup></p>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import axios from "axios";
import { CryptoData } from "@/types/cryptoInterface.ts";
import {onMounted, ref} from "vue";

let crypto: CryptoData;
let loading = ref(true);
const props = defineProps({
  cryptoId: {
    type: Number,
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
});
</script>

<style scoped>
  .crypto-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: auto;
    min-width: 300px;
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
