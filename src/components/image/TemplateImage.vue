<template>
  <div class="item-image">
    <v-img :cover="cover" :src="src" :width="width" :height="height">
      <template v-slot:error>
        <TemplateDefaultImage />
      </template>
      <template v-slot:placeholder>
        <TemplateDefaultImage />
      </template>
      <slot />
    </v-img>
  </div>
</template>

<script setup lang="ts">
import TemplateDefaultImage from "./TemplateDefaultImage.vue";

defineProps<{
  src?: string;
  cover?: boolean;
  width?: string | number;
  height?: string | number;
}>();
</script>

<style lang="scss" scoped>
.item-image {
  position: relative;
  min-height: 200px;
  display: flex;
  justify-content: center;
}
</style>
