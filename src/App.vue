<script setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>

<template>
  <v-app>
    <v-main style="min-height: 100vh; background: white; padding: 0">
      <div class="content-container">
        <div style="padding: 20px">
          <h2 class="mb-4">Life Events</h2>
          <v-fab color="#137073" icon="mdi-plus" @click.stop="drawer = !drawer"></v-fab>
        </div>
      </div>

      <v-navigation-drawer
        v-model="drawer"
        temporary
        location="right"
        width="300"
      >
        <div>TESTE</div>
      </v-navigation-drawer>
    </v-main>
  </v-app>
</template>

<style scoped>
.content-container {
  position: relative;
  height: 100%;
  width: 100vw;
  overflow-x: hidden;
  background: white;
}
.v-navigation-drawer {
  transition: transform 0.3s ease !important;
}
.v-application {
  background: white !important;
}
</style>
