<template>
  <v-card class="template-item" @click="emit('edit')">
    <TemplateImage
      cover
      :src="templateItem.preview_image"
      width="100%"
      :height="200"
    >
      <div class="image__actions">
        <v-btn
          icon="mdi-delete"
          size="small"
          @click.stop.prevent="emit('remove')"
        />
      </div>
    </TemplateImage>
    <v-card-title>{{ templateItem.name }}</v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import type { TemplateItem } from "@/api/services/templatesApi";
import TemplateImage from "../image/TemplateImage.vue";

const { templateItem } = defineProps<{
  templateItem: TemplateItem;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "remove"): void;
}>();
</script>

<style lang="scss" scoped>
.template-item {
  position: relative;
  &__image {
    position: relative;
    min-height: 200px;
    display: flex;
    justify-content: center;
  }
  .image__actions {
    position: absolute;
    padding: 0.3rem;
    top: 0;
    right: 0;
    display: flex;
    gap: 0.5rem;
    > * {
      background-color: rgba(255, 255, 255, 0.9);
    }
  }
  &:not(:hover) {
    .image__actions {
      display: none;
    }
  }
}
</style>
