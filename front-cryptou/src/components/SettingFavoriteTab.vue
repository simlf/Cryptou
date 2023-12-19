<script setup lang="ts">
import { ref } from "vue";

// à revoir -> ce sera une liste de string
const cryptos = ref([
  { name: "BTC", select: true },
  { name: "ETH", select: false },
  { name: "BNB", select: false },
  { name: "XRP", select: false },
  { name: "DOGE", select: false },
  { name: "SOL", select: true },
  { name: "ADA", select: true },
  { name: "TRX", select: false },
  { name: "DOT", select: false },
  { name: "LINK", select: false },
  { name: "LTC", select: false },
]);

function addKeyword() {}

function toggleSelect(crypto) {
  crypto.select = !crypto.select;
  // sauvegarder
  saveToDatabase();
}

function saveToDatabase() {
  // créer un tableau de string avec les noms des cryptos
  // chaque nouvelle selection va écraser le tableau
  console.log("save");
}
</script>
<template>
  <div class="profile-section">
    <h2>Favorite Crypto</h2>
    <p class="profile-description">
      Save the crypto you usually use. They will be arranged in the application
      in a way to facilitate ergonomics for you.
    </p>
    <p>Select your crypto</p>
    <div>
      <span
        class="crypto"
        v-for="crypto in cryptos"
        :key="crypto.name"
        :class="{ selected: crypto.select }"
        @click="toggleSelect(crypto)"
      >
        {{ crypto.name }}
      </span>
    </div>
    <h2 class="mt-10">Favorite Feeds</h2>
    <p class="profile-description">
      Track your keywords across the web without having to read everything!
    </p>
    <button @click="addKeyword">New Keyword</button>
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 50px;
}
.crypto {
  margin: 10px;
  cursor: pointer;
  padding: 8px;
  user-select: none;
}
.selected {
  background-color: #b6dddb;
  padding: 8px;
  border-radius: 30px;
}
.profile-section h2 {
  margin-bottom: 10px;
}
.profile-section p {
  margin-bottom: 20px;
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
  background-color: #48a9a6;
}
</style>
