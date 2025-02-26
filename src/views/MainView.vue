<template>
  <v-container fluid class="main-view">
    <v-combobox
      v-model="tagsFilter"
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
    <div class="template-grid" v-if="templates.length > 0">
      <template-item
        v-for="template in templates"
        :key="template.id"
        :template-item="template"
        @edit="() => editTemplate(template.id)"
        @remove="() => showRemoveDialog(template.id)"
      />
    </div>
    <div
      v-else
      class="empty-templates h-100 d-flex align-center justify-center"
    >
      <div class="empty-templates__text">No templates found</div>
    </div>
    <RemoveDialog v-model="removeDialog" @remove="removeTemplate" />
    <v-fab
      class="add-template-button"
      color="primary"
      icon="mdi-plus"
      @click="editTemplate()"
    />
  </v-container>
</template>

<script setup lang="ts">
import TemplateItem from "@/components/template-item/TemplateItem.vue";
import RemoveDialog from "@/components/template-item/RemoveDialog.vue";
import { useTemplateStore } from "@/store/templateStore";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { onError, onSuccess } from "@/service/Toast";
const router = useRouter();

const templateStore = useTemplateStore();

const templates = computed(() =>
  templateStore.getItemsByTags(tagsFilter.value),
);

const removeDialog = ref(false);
const selectedTemplateId = ref<number | string | null>(null);

const editTemplate = (id?: number | string) => {
  router.push({
    name: "template-view",
    params: { id },
  });
};

const tags = computed(() => templateStore.tags);
const tagsFilter = ref<string[]>([]);

const showRemoveDialog = (id: number | string) => {
  selectedTemplateId.value = id;
  removeDialog.value = true;
};

const removeTemplate = () => {
  if (selectedTemplateId.value === null) {
    onError("No template selected");
    return;
  }
  templateStore.removeItem(selectedTemplateId.value);
  selectedTemplateId.value = null;
  onSuccess("Template removed");
};
</script>

<style scoped>
.main-view {
  height: 100%;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.add-template-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  height: auto !important;
}
</style>
