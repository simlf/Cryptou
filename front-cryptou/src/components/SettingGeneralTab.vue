<script setup lang="ts">
import { ref } from "vue";

const profile = ref({
  firstName: "Lauren",
  email: "lauren.ipsum@cryptou.com",
  username: "Ipsum",
});
</script>
<template>
  <div class="profile-section">
    <h2>Profile</h2>
    <p class="profile-description">Manage your profile informations</p>
    <form class="form-flex">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input type="text" id="firstName" v-model="profile.firstName" />
      </div>
      <div class="form-group">
        <label for="email">Mail</label>
        <input type="email" id="email" v-model="profile.email" />
      </div>
      <div class="form-group">
        <label for="username">Pseudo</label>
        <input type="text" id="username" v-model="profile.username" />
      </div>
    </form>
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
.form-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.form-group {
  display: flex;
  flex: 1 1 calc(50% - 50px);
  flex-direction: column;
  max-width: calc(50% - 50px);
  margin-bottom: 15px;
}
.form-group label {
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 10px;
  margin: 10px;
  border-radius: 4px;
}
.profile-section h2 {
  margin-bottom: 10px;
}
.profile-section p {
  margin-bottom: 20px;
}
</style>
