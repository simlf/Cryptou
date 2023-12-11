<script setup lang="ts">
import CryptoIcon from "./Icons/CryptoIcon.vue";
import FeedIcon from "./Icons/FeedIcon.vue";
import HomeIcon from "./Icons/HomeIcon.vue";
import CustomSmallButton from "../components/CustomSmallButton.vue";
import CustomButton from "@components/CustomButton.vue";
const connexion = () => {
  console.log("se connecter");
};
</script>

<template>
    <div class="top-bar">
      <v-col class="logo-wrapper">
        <img src="../assets/logo.svg" alt="Logo" class="logo" />
        <p>Illuminate Your Crypto Journey with<br><strong>Cryptou</strong></p>
      </v-col>
      <v-col class="top-bar-right-section">
        <router-link to="/">
            <span class="top-nav-link">Articles</span>
        </router-link>
        <router-link to="/">
          <span class="top-nav-border-left top-nav-link" style="padding: 16px 10px">Crypto</span>
        </router-link>
        <router-link to="/">
          <div class="top-nav-border-left top-nav-link">
            <custom-button color-background="var(--primary-dark-green)" message="Connexion"/>
          </div>
        </router-link>
      </v-col>
    </div>
</template>

<style scoped>

.top-bar {
  background-color: var(--primary-light-green)!important;
  display: flex;
  width: 100%;
  height: 80px;
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

.item-center {
  display: flex;
  align-items: center;
}
</style>

<!--
<v-row align="center" justify="space-between">
&lt;!&ndash; logo &ndash;&gt;
<v-col class="left-section">
  <img src="../assets/logo.svg" alt="Logo" class="logo" />
</v-col>
&lt;!&ndash; links &ndash;&gt;
<v-col align="center">
  <router-link to="/">
    <home-icon />
    <span>Home</span>
  </router-link>
  <router-link to="/">
    <feed-icon />
    <span>Feeds</span>
  </router-link>
  <router-link to="/">
    <crypto-icon />
    <span>Crypto</span>
  </router-link>
</v-col>

<v-col align="right">
  <custom-small-button
      message="Connexion"
      colorBackground="var(&#45;&#45;primary-dark-green)"
      @onClick="connexion"
  />
</v-col>
</v-row>-->
