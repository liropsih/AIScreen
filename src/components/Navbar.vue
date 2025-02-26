<template>
  <v-navigation-drawer
    v-model="modelValue"
    :permanent="$vuetify.display.mdAndUp"
    :temporary="$vuetify.display.smAndDown"
    :width="$vuetify.display.mdAndUp ? 300 : undefined"
    mobile-breakpoint="sm"
  >
    <v-list lines="three" class="page-list">
      <v-list-item
        v-for="(page, index) in pages"
        :key="index"
        :title="page.title"
        :to="{ name: page.route.name, params: page.route.params }"
        :subtitle="page.subtitle"
        class="page-list__item"
        color="primary"
        link
        density="compact"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import type { RouteParamsRaw, RouteRecordName } from "vue-router";

type Page = {
  title: string;
  subtitle?: string;
  route: { name: RouteRecordName; params?: RouteParamsRaw };
};

const modelValue = defineModel<boolean>("modelValue");

const pages: Page[] = [
  { title: "Home", route: { name: "index" } },
  // { title: "About", route: { name: "about" } },
];
</script>

<style lang="scss">
.page-list {
  &__title {
    .v-list-item-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }

  &__item {
    .v-list-item__title {
      font-size: 0.9rem;
    }
  }
}
</style>
