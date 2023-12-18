<script setup lang="ts">
import DeleteIcon from "./Icons/DeleteIcon.vue";
import EditIcon from "./Icons/EditIcon.vue";
import { ref } from "vue";

const posts = ref([
  {
    id: 1,
    title: "Title 1",
    content:
      "Contrairement à une opinion répandue, le Lorem Ipsum n'est pas simplement du texte aléatoire.",
  },
  {
    id: 2,
    title: "Title 2",
    content:
      "Contrairement à une opinion répandue, le Lorem Ipsum n'est pas simplement du texte aléatoire.",
  },
  {
    id: 3,
    title: "Title 3",
    content:
      "Contrairement à une opinion répandue, le Lorem Ipsum n'est pas simplement du texte aléatoire.",
  },
]);

const editArticle = (post) => {
  console.log("modifier l'article");
};

const deleteArticle = (post: { id: number }) => {
  posts.value = posts.value.filter((a) => a.id !== post.id);
};
</script>
<template>
  <div class="profile-section">
    <h2>Publication</h2>
    <p class="profile-description">Manage Articles.</p>
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>{{ post.title }}</td>
            <td>{{ post.content }}</td>
            <td>
              <button @click="editArticle(post)"><EditIcon /></button>
              <button @click="deleteArticle(post)"><DeleteIcon /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
button {
  margin-right: 8px;
}
.profile-section {
  padding: 20px;
}
.profile-description {
  border-bottom: 2px solid #ccc;
  padding-bottom: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 50px;
}
.crypto {
  margin: 10px;
  cursor: pointer;
  padding: 8px;
}
.selected {
  background-color: #b6dddb;
  padding: 8px;
  border-radius: 30px;
}
.profile-section h2 {
  margin-bottom: 10px;
}
.profile-section p {
  margin-bottom: 20px;
}
</style>
