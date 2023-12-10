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
    <NavBarLarge v-else />
    <div class="mt-16 w-80vw mx-auto">
      <router-view />
    </div>
  </div>
</template>
