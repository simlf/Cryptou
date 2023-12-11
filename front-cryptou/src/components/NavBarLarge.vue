<script setup lang="ts">
import CryptoIcon from "./Icons/CryptoIcon.vue";
import FeedIcon from "./Icons/FeedIcon.vue";
import HomeIcon from "./Icons/HomeIcon.vue";
import CustomSmallButton from "../components/CustomSmallButton.vue";
const connexion = () => {
  console.log("se connecter");
};
</script>
<template>
  <v-layout>
    <v-app-bar class="bg-white">
      <v-container>
        <v-row align="center" justify="space-between">
          <!-- logo -->
          <v-col class="left-section">
            <img src="../assets/logo.svg" alt="Logo" class="logo" />
          </v-col>
          <!-- links -->
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
              colorBackground="var(--primary-dark-green)"
              @onClick="connexion"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </v-layout>
</template>
<style scoped>
.logo {
  width: 70px;
  height: 70px;
  margin-top: 16px;
  margin-bottom: 8px;
}

span {
  margin-left: 8px;
  margin-right: 10px;
}

.item-center {
  display: flex;
  align-items: center;
}
</style>
