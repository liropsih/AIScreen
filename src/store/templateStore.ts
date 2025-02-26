import { defineStore } from "pinia";
import type { TemplateStoreState } from "./templateStore.types";
import type { TemplateItem } from "@/api/services/templatesApi";
import templatesApi from "@/api/services/templatesApi";

export const useTemplateStore = defineStore("template-store", {
  state: (): TemplateStoreState => ({
    items: [],
  }),
  getters: {
    getItemById:
      state =>
      (id: number | string): TemplateItem | null =>
        state.items.find(item => String(item.id) === String(id)) ?? null,
    tags: state => [
      ...new Set(
        state.items
          .map(item => item.tags)
          .flat()
          .filter(Boolean),
      ),
    ],
    getItemsByTags:
      state =>
      (tags: string[]): TemplateItem[] =>
        state.items.filter(item => tags.every(tag => item.tags?.includes(tag))),
  },
  actions: {
    addItems(items: TemplateItem[]) {
      this.items = items;
    },
    addItem(item: TemplateItem) {
      const id = item.id || Date.now() + Math.round(Math.random() * 1000000);
      this.items.push({ ...item, id });
      return id;
    },
    updateItem(id: number | string, item: TemplateItem) {
      const index = this.items.findIndex(
        item => String(item.id) === String(id),
      );
      if (index !== -1) {
        this.items[index] = item;
      }
    },
    removeItem(id: number | string) {
      const index = this.items.findIndex(
        item => String(item.id) === String(id),
      );
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    clearItems() {
      this.items = [];
    },
    async fetchTemplates() {
      console.log(
        "загрузка шаблонов из api. добавление в store недостающих шаблонов",
      );
      try {
        const { data } = await templatesApi.getTemplates();
        data.forEach(item => {
          if (this.getItemById(item.id)) {
            // this.updateItem(item.id, item); // TODO: update item
          } else {
            this.addItem(item);
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    async init() {
      await this.fetchTemplates();
    },
  },
});
