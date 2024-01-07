<script setup lang="ts">
import {onMounted, ref} from "vue";
import { useStore } from "@/store/useCryptouStore.js";
import customSelectorMulti from "@/components/CustomSelectorMulti.vue";
import axios from "axios";

const storage = useStore();
let userCryptos = ref([]);
let cryptoNameList = ref([]);
let keywords = ref(storage.user.keywordArray || []);
let newKeyword = ref("");
let keywordList = ref([]);

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

async function getKeywords() {
  const response = await axios.get("http://localhost:3000/keywords");
  keywordList.value = response.data.map((keyword) => keyword.keyword);
  console.log("fetchedData", keywordList.value);
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

async function saveUserData() {
  axios.patch("http://localhost:3000/users/profile", {
    userId: storage.user.id,
    keywords: keywords.value.join(","),
  }, {
    headers: {
      Authorization: `Bearer ${storage.user.token}`,
    },
  });

  storage.user.keywordArray = keywords.value;
}

function isSelected(crypto) {
  return userCryptos.value.includes(crypto);
}

onMounted(() => {
  getKeywords();
});
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
    <h2 class="mt-10">Favorite Keyword</h2>
    <p class="profile-description">
      Track your keywords across the web without having to read everything!
    </p>
    <p>Your keywords</p>
    <br />
    <br />
    <custom-selector-multi :array-choices="keywordList" color-background="var(--primary-light-green)" placeholder="select favorite keyword"/>
    <button @click="saveUserData">Save Keyword</button>
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
