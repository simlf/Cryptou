<script setup lang="ts">
import CryptoIcon from "./Icons/CryptoIcon.vue";
import FeedIcon from "./Icons/FeedIcon.vue";
import HomeIcon from "./Icons/HomeIcon.vue";
import SettingIcon from "./Icons/SettingIcon.vue";
</script>
<template>
  <v-layout>
    <v-bottom-navigation
      class="bg-white"
      color="secondary"
      v-model="activeButton"
    >
      <v-btn value="home" to="/">
        <HomeIcon />
      </v-btn>
      <v-btn value="articles" to="/articles">
        <FeedIcon />
      </v-btn>
      <v-btn value="graph" to="/graph">
        <CryptoIcon />
      </v-btn>
      <v-btn value="settings" to="/settings">
        <SettingIcon />
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script lang="ts">
export default {
  data() {
    return {
      activeButton: "home", // This will make the "Home" button active by default
    };
  },
};
</script>
