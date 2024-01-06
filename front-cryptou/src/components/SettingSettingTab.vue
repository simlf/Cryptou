<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/store/useCryptouStore.js";

const storage = useStore();
let cryptoNameList = ref([]);
cryptoNameList = storage.cryptoNameList;
console.log("cryptoNameList", cryptoNameList);
let newCryptoNameList = ref("");

function addCrypto() {
  if (
    newCryptoNameList.value &&
    !cryptoNameList.value.includes(newCryptoNameList.value)
  ) {
    cryptoNameList.value.push(newCryptoNameList.value);
    newCryptoNameList.value = "";
    saveCryptoData();
  }
}

function saveCryptoData() {}
</script>
<template>
  <div class="profile-section">
    <h2>Setting</h2>
    <p class="profile-description">
      Here are the cryptos that you have administered in your application
    </p>
    <p>Manage Crypto</p>
    <span
      class="crypto"
      v-for="crypto in cryptoNameList"
      :key="crypto"
      :class="crypto"
    >
      {{ crypto }}
    </span>
    <br />
    <br />
    <input
      type="text"
      v-model="newCryptoNameList"
      placeholder="Add a new crypto"
    />
    <button @click="addCrypto">New Crypto</button>
  </div>
</template>

<style scoped>
.profile-section {
  padding: 20px;
}
.profile-description {
  border-bottom: 2px solid #ccc;
  padding-bottom: 20px;
}
.profile-section h2 {
  margin-bottom: 10px;
}
.profile-section p {
  margin-bottom: 20px;
}

.crypto {
  margin: 10px;
  padding: 8px;
}

button {
  background-color: #48a9a6;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 2px;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #68b7b4;
}

input {
  padding: 0px 5px;
  background-color: #f5f5f5;
  margin-right: 20px;
}
</style>
