<template>
  <div class="pb-16">
    <div class="title-wrapper">
      <img src="../assets/logo.svg" class="logo" alt="Cryptou logo" />
      <h1 class="title">Welcome You !</h1>
    </div>
    <div class="form-wrapper">
      <custom-button
        message="Sign in with google"
        colorBackground="var(--primary-dark-green)"
        @onClick="console.log('sign in with google')"
      />
      <hr />
      <custom-text-field
        placeholder="Email"
        colorBackground="var(--primary-light-green)"
        v-model="email"
        class="field"
      />
      <custom-text-field
        placeholder="Password"
        colorBackground="var(--primary-light-green)"
        v-model="password"
        class="field"
      />
      <custom-selector-one
        placeholder="Select you curency"
        colorBackground="var(--primary-light-green)"
        :arrayChoices="currencyArray"
        @update:modelValue="selectedCurrency = $event"
      />
      <custom-selector-multi
        placeholder="Select you favorite crypto"
        colorBackground="var(--primary-light-green)"
        :arrayChoices="cryptoArray"
        @update:modelValue="selectedCrypto = $event"
      />
      <custom-button
        message="Choose your currency"
        colorBackground="var(--primary-dark-green)"
        @onClick="console.log(selectedCrypto)"
      />
    </div>
    <wave-footer v-if="mobile" />
  </div>
</template>

<script setup lang="ts">
import CustomButton from "../components/CustomButton.vue";
import CustomTextField from "../components/CustomTextField.vue";
import CustomSelectorOne from "../components/CustomSelectorOne.vue";
import CustomSelectorMulti from "../components/CustomSelectorMulti.vue";
import WaveFooter from "../components/WaveFooter.vue";
import { ref } from "vue";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const currencyArray = ["euro", "dollar", "pound", "yen"];
const cryptoArray = ["Bitcoin", "Ethereum", "Doge coin", "Stable coin"];

let email = ref("");
let password = ref("");
let selectedCurrency = ref("");
let selectedCrypto = ref([]);
</script>

<style scoped>
.title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo {
  width: 200px;
  height: 200px;
  margin-bottom: -25px;
}

.title {
  font-size: 2.5rem;
  font-weight: 300;
  margin-top: 1rem;
  color: var(--primary-dark-green);
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 1;
  position: relative;
}

hr {
  width: 240px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.field {
  margin: 16px 0;
  display: flex;
}
</style>
