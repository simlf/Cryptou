<template>
  <div class="title-wrapper">
    <img src="../assets/logo.svg" class="logo" alt="Cryptou logo" />
    <h1 class="title">Welcome back !</h1>
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
    <custom-button
      message="sign in"
      colorBackground="var(--primary-dark-green)"
      @onClick="callLogin"
    />
    <p class="register-link">
      No account ?
      <a
        @click="this.$router.push('/register')"
        style="text-decoration: underline"
        >Create it !</a
      >
    </p>
  </div>
  <wave-footer v-if="mobile" />
</template>

<script setup lang="ts">
import CustomButton from "../components/CustomButton.vue";
import CustomTextField from "../components/CustomTextField.vue";
import WaveFooter from "../components/WaveFooter.vue";

import axios from "axios";
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "../store/useCryptoStore.ts";
import router from "@/router";

const { mobile } = useDisplay();
const cryptouStore = useStore();

let email = ref("");
let password = ref("");

function callLogin() {
  axios
      .post("http://localhost:3000/users/login", {
        email: email.value,
        password: password.value,
      })
      .then((response) => {
        console.log("response : ", response.data);
        cryptouStore.saveUser(response.data.email, response.data.role, response.data.crypto, response.data.keywords, response.currency, response.data.token);
        console.log(cryptouStore.user)
        if (response.status === 200) {
          router.push("/");
        }
      })
      .catch((error) => {
        console.log("error : ", error);
      });
}
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
  column-gap: 10px;
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
  margin: 10px 0;
  display: flex;
}

.register-link {
  color: var(--grey);
  font-size: 12px;
  text-align: left;
  margin-top: 10px;
  width: 350px;
}
</style>
