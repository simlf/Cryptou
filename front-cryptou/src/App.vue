<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import NavBarSmall from "../src/components/NavBarSmall.vue";
import NavBarLarge from "../src/components/NavBarLarge.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const route = useRoute();
</script>

<template>
  <div>
    <NavBarSmall v-if="mobile && route.name !== 'login' && route.name !== 'register'" />
    <NavBarLarge v-else-if="route.name !== 'login' && route.name !== 'register'" />
    <router-view />
  </div>
</template>
