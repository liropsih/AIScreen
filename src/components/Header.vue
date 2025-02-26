<template>
  <v-app-bar
    class="app-header px-3"
    elevation="0"
    color="primary"
    density="compact"
  >
    <template v-slot:image>
      <v-img
        gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
      />
    </template>
    <v-app-bar-nav-icon
      v-if="showNavbarButton"
      variant="text"
      @click.stop="emit('toggle-navbar')"
    />
    <v-app-bar-title @click="router.push({ name: 'index' })">
      AIScreen
    </v-app-bar-title>
    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" variant="text">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            @click="logout"
            prepend-icon="mdi-logout"
            title="Выход из аккаунта"
          />
        </v-list>
      </v-menu>
    </template>
    <!-- <template v-slot:extension>
      <div>Tabs</div>
    </template> -->
  </v-app-bar>
</template>

<script setup lang="ts">
import { logout } from "@/service/Auth";
import { useRouter } from "vue-router";

const { showNavbarButton } = defineProps<{
  showNavbarButton?: boolean;
}>();

const emit = defineEmits<{
  "toggle-navbar": [];
}>();

const router = useRouter();
</script>

<style lang="scss">
.app-header {
  .v-app-bar-title {
    cursor: pointer;
  }
}
</style>
