<template>
  <div class="market-wrapper" v-if="loading">
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

</template>

<script setup lang="ts">
import CryptoMarket from "@components/CryptoMarket.vue";
import { useCryptoStore } from "../store/cryptosStore.ts";
import {onMounted, ref} from "vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

if (mobile) {
  console.log('mobile');
} else {
  console.log('desktop');
}

const cryptoStore = useCryptoStore();
let loading = ref(true);
let cryptocurrencyNames: any = [];

onMounted(async () => {
  if (cryptoStore.cryptocurrencyNames.length === 0)
    await cryptoStore.fetchCryptos();
  cryptocurrencyNames = cryptoStore.cryptocurrencyNames;
  loading.value = false;
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