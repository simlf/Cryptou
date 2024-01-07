<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useStore } from "@/store/useCryptouStore.js";

const storage = useStore();

let emailModel = ref(storage.user.email);
const updateUserEmail = async () => {
  try {
    await axios.patch("http://localhost:3000/users/profile", {
      userId: storage.user.id,
      email: emailModel.value,
      }, {
      headers: {
        Authorization: `Bearer ${storage.user.token}`,
      },
    });

    storage.user.email = emailModel;

    alert("mail updated successfully!");
  } catch (error) {
    console.error("Error updating email", error);
  }
};
</script>
<template>
  <div class="profile-section">
    <h2>Profile</h2>
    <p class="profile-description">Manage your profile informations</p>
    <div class="flex">
      <div>
        <span>Name:&nbsp;&nbsp;&nbsp;</span>
        <span>{{ storage.user.username }}</span>
      </div>
      <div>
        <span>Role:&nbsp;&nbsp;&nbsp;</span>
        <span v-if="storage.user.role === 1">ADMIN</span>
        <span v-else-if="storage.user.role === 2">USER</span>
      </div>
      <form>
        <label for="email">Mail:&nbsp;&nbsp;&nbsp;</label>
        <input type="email" id="email" v-model="emailModel" style="border: solid 2px var(--primary-dark-green)"/>
      </form>
      <button class="button" type="button" @click="updateUserEmail">
        Update email
      </button>
    </div>
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

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background-color: #68b7b4;
}

input {
  padding: 0px 5px;
  background-color: #f5f5f5;
}
</style>
