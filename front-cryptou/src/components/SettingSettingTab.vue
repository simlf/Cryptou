<script setup lang="ts">
function addCrypto() {}
</script>
<template>
  <div class="profile-section">
    <h2>Setting</h2>
    <p class="profile-description">Manage Crypto</p>
    <div>
      <input type="text" />
    </div>
    <button @click="addCrypto">New Keyword</button>
  </div>
</template>

<style scoped>
.profile-section {
  padding: 20px;
}
.profile-description {
  border-bottom: 2px solid #ccc;
  padding-bottom: 20px;
}
.profile-section h2 {
  margin-bottom: 10px;
}
.profile-section p {
  margin-bottom: 20px;
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
