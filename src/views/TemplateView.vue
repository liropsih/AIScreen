<template>
  <v-card class="template-view" v-if="showTemplateItem" :loading="loading">
    <TemplateImage
      class="template-view__image"
      cover
      :src="showTemplateItem.preview_image || undefined"
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
          @update:model-value="changed = true"
        />
        <v-text-field
          v-model="showTemplateItem.height"
          label="Height"
          type="number"
          :rules="[rules.required, rules.number]"
          @update:model-value="changed = true"
        />
        <v-text-field
          v-model="showTemplateItem.width"
          label="Width"
          type="number"
          :rules="[rules.required, rules.number]"
          @update:model-value="changed = true"
        />
        <v-combobox
          v-model="showTemplateItem.tags"
          label="Tags"
          chips
          clearable
          closable-chips
          multiple
          :items="tags"
          @update:model-value="changed = true"
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
      <v-btn v-if="changed" density="compact" @click="reset">Reset</v-btn>
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
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { convertToBase64 } from "@/utils/fileUtils";
import { debounce } from "underscore";

const router = useRouter();
const route = useRoute();
const templateStore = useTemplateStore();

const rules = {
  required: (value: string) => !!value || "Field is required",
  number: (value: string) => !isNaN(Number(value)) || "Field must be a number",
};

const loading = ref(true);
const changed = ref(false);
const showTemplateItem = ref<TemplateItem | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);

const removeDialog = ref(false);
const selectedTemplateId = ref<number | string | null>(null);

const id = computed(() => route.params.id);
const tags = computed(() => templateStore.tags);

const templateItem = computed<TemplateItem | null>(() =>
  templateStore.getItemById(id.value as string | number),
);

const isTemplateValid = computed(() => {
  if (
    !showTemplateItem.value?.name ||
    !showTemplateItem.value?.height ||
    !showTemplateItem.value?.width
  ) {
    return false;
  }
  if (
    isNaN(Number(showTemplateItem.value?.height)) ||
    isNaN(Number(showTemplateItem.value?.width))
  ) {
    return false;
  }
  return true;
});

const showRemoveDialog = (id: number | string) => {
  selectedTemplateId.value = id;
  removeDialog.value = true;
};

const removeTemplate = async () => {
  if (selectedTemplateId.value) {
    await templateStore.removeItem(selectedTemplateId.value);
    selectedTemplateId.value = null;
  }
  onSuccess("Template removed");
  router.push({ name: "index" });
};

const changeImage = async (event: Event) => {
  changed.value = true;
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
  changed.value = true;
  showTemplateItem.value!.preview_image = "";
};

const getDefaultTemplate = (): TemplateItem => ({
  id: 0,
  name: "",
  height: "",
  width: "",
  objects: null,
  tags: [],
  preview_image: "",
});

const reset = () => {
  if (!id.value) {
    showTemplateItem.value = getDefaultTemplate();
  } else {
    showTemplateItem.value = JSON.parse(
      JSON.stringify({
        ...templateItem.value,
        tags: templateItem.value!.tags || [],
      }),
    );
  }
  removeDraft(id.value as string | number);
  changed.value = false;
};

const save = async () => {
  if (!isTemplateValid.value) {
    onError("Template is not valid");
    return;
  }
  if (!id.value) {
    const templateData = await templateStore.addItem(showTemplateItem.value!);
    showTemplateItem.value = JSON.parse(JSON.stringify(templateData));
    router.push({ name: "template-view", params: { id: templateData.id } });
    removeDraft();
  } else {
    const templateData = await templateStore.updateItem(
      id.value as string | number,
      showTemplateItem.value!,
    );
    showTemplateItem.value = JSON.parse(JSON.stringify(templateData));
    removeDraft(id.value as string | number);
  }
  changed.value = false;
  onSuccess("Template saved");
};

const getDrafts = (): Record<string, TemplateItem> =>
  JSON.parse(localStorage.getItem("drafts") || "{}");

const removeDraft = (id?: string | number) => {
  const drafts = getDrafts();
  delete drafts[id || "null"];
  localStorage.setItem("drafts", JSON.stringify(drafts));
};

const saveDraft = debounce((value: TemplateItem) => {
  const drafts = getDrafts();
  drafts[value.id || "null"] = value;
  localStorage.setItem("drafts", JSON.stringify(drafts));
}, 200);

const fetchTemplate = async () => {
  const drafts = getDrafts();
  if (id.value) {
    const draft = drafts[id.value as string];
    const templateData =
      draft || (await templateStore.fetchTemplate(id.value as string | number));
    showTemplateItem.value = JSON.parse(JSON.stringify(templateData));
    if (draft) {
      changed.value = true;
    }
  } else {
    const draft = drafts["null"];
    showTemplateItem.value = draft || getDefaultTemplate();
    if (draft) {
      changed.value = true;
    }
  }
  if (!showTemplateItem.value) {
    onError("Template not found");
    router.push({ name: "index" });
    return;
  }
  loading.value = false;
};

const watchers: (() => void)[] = [];

fetchTemplate().then(() => {
  watchers.push(watch(showTemplateItem, saveDraft, { deep: 3 }));
});

onBeforeUnmount(() => {
  watchers.forEach(watcher => watcher());
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
