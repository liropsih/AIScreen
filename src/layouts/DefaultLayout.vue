<template>
  <!-- <Header
    :show-navbar-button="$vuetify.display.smAndDown"
    @toggle-navbar="navbarVisible = !navbarVisible"
  /> -->
  <Header />
  <!-- <Navbar v-model="navbarVisible" /> -->
  <v-main class="default-layout">
    <slot />
  </v-main>
</template>

<script setup lang="ts">
// import { ref } from "vue";
import Header from "@/components/Header.vue";
// import Navbar from "@/components/Navbar.vue";
// import { useDisplay } from "vuetify";

// const display = useDisplay();

// const navbarVisible = ref(display.mdAndUp.value);
</script>

<style lang="scss">
.default-layout {
  width: clamp(20rem, 90%, 48rem);
  margin: 0 auto;
}
</style>
