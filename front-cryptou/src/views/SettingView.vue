<script setup lang="ts">
import { ref } from "vue";
import SettingGeneralTab from "../components/SettingGeneralTab.vue";
import SettingFavoriteTab from "../components/SettingFavoriteTab.vue";
import SettingSettingTab from "../components/SettingSettingTab.vue";

import { useStore } from "@/store/useCryptouStore.js";
const storage = useStore();

const tabs = ref([
  { name: "General", content: "Contenu de General" },
  { name: "Favorite", content: "Contenu de Favorite cryptos" },
  ...(storage.user.role === 1
    ? [{ name: "Setting", content: "Contenu de Setting" }]
    : []),
]);

const selectedTab = ref(tabs.value[0]);
function selectTab(tab) {
  selectedTab.value = tab;
}
</script>

<template>
  <div class="tab-container">
    <ul class="tab-titles">
      <li
        v-for="tab in tabs"
        :key="tab.name"
        @click="selectTab(tab)"
        :class="{ active: tab === selectedTab }"
      >
        {{ tab.name }}
      </li>
    </ul>
    <div class="tab-content">
      <!-- Onglet General -->
      <div v-if="selectedTab.name === 'General'"><SettingGeneralTab /></div>
      <!-- Onglet Favorite -->
      <div v-if="selectedTab.name === 'Favorite'"><SettingFavoriteTab /></div>
      <!-- Onglet Setting -->
      <div v-if="storage.user.role === 1">
        <div v-if="selectedTab.name === 'Setting'">
          <SettingSettingTab />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-container {
  max-width: 1200px;
  margin: 20px auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.tab-titles {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  background: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

.tab-titles li {
  padding: 10px 20px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-bottom: none;
  background: #e9e9e9;
}

.tab-titles li.active {
  background: #fff;
  border-top: 3px solid #48a9a6;
  position: relative;
  top: 1px;
}

.tab-content {
  padding: 20px;
  border: 1px solid #ddd;
}

button {
  background-color: #48a9a6;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 2px;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #48a9a6;
}
</style>
