<template>
  <v-responsive>
    <v-app>
      <VSonner position="top-right" :duration="2000" />
      <component :is="route.meta.layoutComponent">
        <RouterView v-if="!loading" />
        <div class="preloader" v-else>
          <v-progress-linear color="primary" height="6" indeterminate rounded />
        </div>
      </component>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { VSonner } from "vuetify-sonner";
import { useTemplateStore } from "./store/templateStore";
import { ref } from "vue";
import { getAuthToken } from "./service/Auth";

const route = useRoute();
const templateStore = useTemplateStore();

const isAuth = !!getAuthToken();
const loading = ref(isAuth);
if (isAuth) {
  templateStore.init().finally(() => {
    loading.value = false;
  });
}
</script>

<style lang="scss" scoped>
.preloader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
