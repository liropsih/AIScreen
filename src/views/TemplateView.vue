<template>
  <v-card class="template-view" v-if="showTemplateItem">
    <TemplateImage
      class="template-view__image"
      cover
      :src="showTemplateItem.preview_image"
      width="100%"
      height="auto"
    >
      <div class="template-view__image__actions">
        <v-btn icon="mdi-pencil" size="small" @click="imageInput?.click()" />
        <v-btn
          v-if="showTemplateItem.preview_image"
          icon="mdi-delete"
          size="small"
          @click="removeImage"
        />
        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          class="d-none"
          @change="changeImage"
        />
      </div>
    </TemplateImage>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="showTemplateItem.name"
          label="Name"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="showTemplateItem.description"
          label="Description"
        />
        <v-text-field
          v-model="showTemplateItem.height"
          label="Height"
          type="number"
          :rules="[rules.number]"
        />
        <v-combobox
          v-model="showTemplateItem.tags"
          label="Tags"
          chips
          clearable
          closable-chips
          multiple
          :items="tags"
        >
          <template v-slot:chip="{ props, item }">
            <v-chip v-bind="props">
              <strong>{{ item.raw }}</strong
              >&nbsp;
            </v-chip>
          </template>
        </v-combobox>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn density="compact" :disabled="!isTemplateValid" @click="save">
        Save
      </v-btn>
      <v-btn density="compact" @click="reset">Reset</v-btn>
      <v-spacer />
      <v-btn density="compact" @click="showRemoveDialog(showTemplateItem.id)"
        >Remove</v-btn
      >
    </v-card-actions>
    <v-fab
      class="back-button"
      color="primary"
      icon="mdi-arrow-left"
      @click="router.push({ name: 'index' })"
    />
    <RemoveDialog v-model="removeDialog" @remove="removeTemplate" />
  </v-card>
</template>

<script setup lang="ts">
import type { TemplateItem } from "@/api/services/templatesApi";
import TemplateImage from "@/components/image/TemplateImage.vue";
import RemoveDialog from "@/components/template-item/RemoveDialog.vue";
import { onError, onSuccess } from "@/service/Toast";
import { useTemplateStore } from "@/store/templateStore";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { convertToBase64 } from "@/utils/fileUtils";

const router = useRouter();
const route = useRoute();

const rules = {
  required: (value: string) => !!value || "Field is required",
  number: (value: string) => !isNaN(Number(value)) || "Field must be a number",
};

const id = computed(() => route.params.id);
const templateStore = useTemplateStore();
const tags = computed(() => templateStore.tags);

const templateItem = computed<TemplateItem | null>(() =>
  templateStore.getItemById(id.value as string | number),
);

const showTemplateItem = ref<TemplateItem | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);

const removeDialog = ref(false);
const selectedTemplateId = ref<number | string | null>(null);

const showRemoveDialog = (id: number | string) => {
  selectedTemplateId.value = id;
  removeDialog.value = true;
};

const removeTemplate = () => {
  if (selectedTemplateId.value) {
    templateStore.removeItem(selectedTemplateId.value);
    selectedTemplateId.value = null;
  }
  onSuccess("Template removed");
  router.push("/");
};

const changeImage = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    try {
      const base64String = await convertToBase64(file);
      showTemplateItem.value!.preview_image = base64String;
    } catch (error) {
      console.error("Ошибка при конвертации изображения:", error);
      onError("Ошибка при конвертации изображения");
    }
  }
};

const removeImage = () => {
  showTemplateItem.value!.preview_image = undefined;
};

const reset = () => {
  if (!id.value) {
    showTemplateItem.value = {
      id: 0,
      name: "",
      description: "",
      height: "",
      objects: null,
      tags: [],
      preview_image: undefined,
    };
    return;
  }
  showTemplateItem.value = JSON.parse(
    JSON.stringify({
      ...templateItem.value,
      tags: templateItem.value!.tags || [],
    }),
  );
};

const isTemplateValid = computed(() => {
  if (!showTemplateItem.value?.name) {
    return false;
  }
  return true;
});

const save = () => {
  if (!isTemplateValid.value) {
    onError("Template is not valid");
    return;
  }
  if (!id.value) {
    const templateId = templateStore.addItem(showTemplateItem.value!);
    router.push({ name: "template-view", params: { id: templateId } });
  } else {
    templateStore.updateItem(
      id.value as string | number,
      showTemplateItem.value!,
    );
  }
  onSuccess("Template saved");
};

reset();

onMounted(() => {
  if (!showTemplateItem.value) {
    onError("Template not found");
    router.push("/");
  }
});
</script>

<style lang="scss" scoped>
.template-view {
  &__image {
    padding: 1rem;
    border-radius: 1rem;
    position: relative;
    &__actions {
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;
      display: flex;
      gap: 0.5rem;
      > * {
        background-color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .back-button {
    position: fixed;
    top: 4rem;
    left: 1rem;
    height: auto !important;
  }
}
</style>
