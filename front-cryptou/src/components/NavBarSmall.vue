<script setup lang="ts">
import CryptoIcon from "./Icons/CryptoIcon.vue";
import FeedIcon from "./Icons/FeedIcon.vue";
import HomeIcon from "./Icons/HomeIcon.vue";
</script>
<template>
  <v-layout>
    <v-bottom-navigation active color="primary">
      <v-btn>
        <HomeIcon />
      </v-btn>
      <v-btn>
        <FeedIcon />
      </v-btn>
      <v-btn>
        <CryptoIcon />
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
