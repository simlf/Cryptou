<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/store/useCryptouStore.js";

const storage = useStore();
let userCryptos = ref([]);
let cryptoNameList = ref([]);
let keywords = ref(storage.user.keywordArray || []);
let newKeyword = ref("");

userCryptos.value = storage.user.cryptoArray[0].toString().split(", ");
cryptoNameList.value = storage.cryptoNameList;

console.log("storage", storage);
console.log("keywords", keywords);

function addKeyword() {
  if (newKeyword.value && !keywords.value.includes(newKeyword.value)) {
    keywords.value.push(newKeyword.value);
    newKeyword.value = "";
    saveUserData();
  }
}

function updateUserCryptos(crypto: string) {
  const index = userCryptos.value.indexOf(crypto);
  if (index > -1) {
    userCryptos.value.splice(index, 1);
  } else if (!userCryptos.value.includes(crypto)) {
    userCryptos.value.push(crypto);
  }
  saveUserData();
}

function saveUserData() {
  const { email, role, currency, token } = storage.user;
  const cryptoString = userCryptos.value.join(",");
  const keywords = storage.user.keywordArray.join(",");
  storage.saveUser(email, role, cryptoString, keywords, currency, token);
  console.log("Your preferences have been saved successfully");
  console.log("userCryptos", userCryptos);
}

function isSelected(crypto) {
  return userCryptos.value.includes(crypto);
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
        v-for="crypto in cryptoNameList"
        :key="crypto"
        @click="updateUserCryptos(crypto)"
        :class="{ selected: isSelected(crypto) }"
      >
        {{ crypto }}
      </span>
    </div>
  </div>
  <div class="profile-section">
    <h2 class="mt-10">Favorite Feeds</h2>
    <p class="profile-description">
      Track your keywords across the web without having to read everything!
    </p>
    <p>Your keywords</p>
    <span
      class="keyword"
      v-for="keyword in keywords"
      :key="keyword"
      :class="keyword"
    >
      {{ keyword }}
    </span>
    <br />
    <br />
    <input type="text" v-model="newKeyword" placeholder="Add a new keyword" />
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

.keyword {
  margin: 10px;
  padding: 8px;
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
  background-color: #68b7b4;
}

input {
  padding: 0px 5px;
  background-color: #f5f5f5;
  margin-right: 20px;
}
</style>
