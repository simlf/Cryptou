<template>
  <div class="title-wrapper">
    <img src="../assets/logo.svg" class="logo" alt="Cryptou logo" />
    <h1 class="title">Welcome back !</h1>
  </div>
  <div class="form-wrapper">
    <custom-button message="Sign in with google" colorBackground="var(--primary-dark-green)" @onClick="console.log('sign in with google')"/>
    <hr>
    <custom-text-field placeholder="Email" colorBackground="var(--primary-light-green)" v-model="email" class="field"/>
    <custom-text-field placeholder="Password" colorBackground="var(--primary-light-green)" v-model="password" class="field"/>
    <custom-button message="sign in" colorBackground="var(--primary-dark-green)" @onClick="console.log('sign in')"/>
    <p class="register-link">No account ? <a @click="console.log('redirect register')" style="text-decoration: underline">Create it !</a></p>
  </div>
  <wave-footer v-if="mobile"/>
</template>

<script setup lang="ts">
import CustomButton from '../components/CustomButton.vue'
import CustomTextField from '../components/CustomTextField.vue'
import WaveFooter from '../components/WaveFooter.vue'
import { ref } from 'vue';
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()


let email = ref('')
let password = ref('')

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
  color: var(--primary-dark-green)
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  height: 100%;
  z-index: 1; /* Add this line */
  position: relative; /* Add this line */
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
  width: 300px;
}

</style>
