<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBarSmall from "../src/components/NavBarSmall.vue";
import NavBarLarge from "../src/components/NavBarLarge.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
</script>

<template>
  <div>
    <NavBarSmall v-if="mobile" />
    <NavBarLarge/>
    <router-view />
  </div>
</template>
