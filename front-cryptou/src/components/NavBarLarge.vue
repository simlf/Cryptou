<script setup lang="ts">
import CustomButton from "@components/CustomButton.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
</script>

<template>
    <div class="top-bar">
      <router-link to="/" class="logo-wrapper">
        <img src="../assets/logo.svg" alt="Logo" class="logo" />
        <p :class="{'topline': mobile}">Illuminate Your Crypto Journey with<br><strong>Cryptou</strong></p>
      </router-link>
      <v-col class="top-bar-right-section">
        <router-link to="/articles" v-show="!mobile">
            <span class="top-nav-link">Articles</span>
        </router-link>
        <router-link to="/graph" v-show="!mobile">
          <span class="top-nav-border-left top-nav-link" style="padding: 16px 10px">Crypto</span>
        </router-link>
        <router-link to="/login">
          <div :class="{'top-nav-border-left': !mobile, 'top-nav-link': true}">
            <custom-button color-background="var(--primary-dark-green)" message="Login"/>
          </div>
        </router-link>
      </v-col>
    </div>
</template>

<style scoped>
.top-bar {
  background-color: var(--primary-light-green) !important;
  display: flex;
  width: 100%;
  height: 80px;
}

.topline {
  font-size: 0.8em;
  width: 150px;
}

.top-nav-border-left {
  padding: 10px;
  border-left: solid 2px var(--primary-yellow-light);
}

.top-bar-right-section {
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 20px;
  justify-content: flex-end;
  text-decoration: none;
}

.top-nav-link {
  text-decoration: none;
  color: black;
  font-size: 1.5rem;
  margin: 0 5px;
}

.logo {
  width: 75px;
  height: 75px;
}

.logo-wrapper {
  display: flex;
  justify-content: start;
  align-items: center;
  color: black;
  text-decoration: none;
}

span {
  margin-left: 8px;
  margin-right: 10px;
  text-decoration: none;
  color: black;
  font-size: 1.5rem;
}

span:hover {
  text-decoration: none;
}
</style>
