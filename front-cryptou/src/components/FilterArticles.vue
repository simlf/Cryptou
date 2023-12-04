<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-btn color="teal" dark class="mr-4">All</v-btn>
        <v-select class="mr-4" :items="cryptos" label="Select crypto" outlined dense></v-select>
        <v-select class="mr-4" :items="keywords" label="Select keyword" outlined dense></v-select>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="date" label="Choose date" prepend-icon="event" readonly v-bind="attrs" v-on="on" outlined dense></v-text-field>
          </template>
          <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const cryptos = ref(['Bitcoin', 'Ethereum', 'Ripple', 'Litecoin']); // Example crypto options
const keywords = ref(['Blockchain', 'Mining', 'Wallet', 'Exchange']); // Example keyword options
const date = ref('');
const menu = ref(false);

// Add methods to handle the selection changes and apply filters to the articles.
</script>
