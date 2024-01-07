<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useStore } from "@/store/useCryptouStore.js";
import CustomTextField from "@components/CustomTextField.vue";
import CustomButton from "@components/CustomButton.vue";

const storage = useStore();
let cryptoNameList = ref([]);
cryptoNameList = storage.cryptoNameList;
console.log("cryptoNameList", cryptoNameList);
let newCryptoNameList = ref("");

let newCryptoName = ref("");
let newCryptoSlug = ref("");
let newCryptoImage = ref("");

let newFluxName = ref("");
let newFluxUrl = ref("");
let newFluxLanguage = ref("");


async function saveCryptoData() {
  console.log(storage.user.role)
  await axios.post("http://localhost:3000/cryptos", {
    userRole: storage.user.role,
    fullName: newCryptoName.value,
    slugName: newCryptoSlug.value,
    imageUrl: newCryptoImage.value,
  }, {
    headers: {
      Authorization: `Bearer ${storage.user.token}`,
    },
  });
}

async function saveFluxData() {
  console.log(storage.user.role)
  await axios.post("http://localhost:3000/feeds", {
    userRole: storage.user.role,
    name: newFluxName.value,
    url: newFluxUrl.value,
    language: newFluxLanguage.value,
  }, {
    headers: {
      Authorization: `Bearer ${storage.user.token}`,
    },
  });
}

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
    <div class="form-wrapper">
      <custom-text-field color-background="var(--primary-light-green)" placeholder="Crypto name" @update:modelValue="newCryptoName = $event"/>
      <custom-text-field color-background="var(--primary-light-green)" placeholder="Crypto Slug (ex: BTC)" @update:modelValue="newCryptoSlug = $event"/>
      <custom-text-field color-background="var(--primary-light-green)" placeholder="Image url crypto" @update:modelValue="newCryptoImage = $event"/>
      <custom-button color-background="var(--primary-dark-green)" message="add new crytpo" @click="saveCryptoData"/>
    </div>
    <div class="form-wrapper">
      <custom-text-field color-background="var(--primary-light-green)" placeholder="Flux name" @update:modelValue="newFluxName = $event"/>
      <custom-text-field color-background="var(--primary-light-green)" placeholder="Flux Url" @update:modelValue="newFluxUrl = $event"/>
      <custom-text-field color-background="var(--primary-light-green)" placeholder="Flux language (ex: fr, en, etc)" @update:modelValue="newFluxLanguage = $event"/>
      <custom-button color-background="var(--primary-dark-green)" message="add new Flux" @click="saveFluxData"/>
    </div>
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
