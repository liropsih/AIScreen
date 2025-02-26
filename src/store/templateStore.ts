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
    async addItem(item: TemplateItem) {
      return templatesApi.create(item).then(({ data }) => {
        this.items.push(data);
        return data;
      });
    },
    async updateItem(id: number | string, item: TemplateItem) {
      return templatesApi.update(id, item).then(({ data }) => {
        const index = this.items.findIndex(
          item => String(item.id) === String(id),
        );
        if (index !== -1) {
          this.items[index] = data;
        }
        return data;
      });
    },
    async removeItem(id: number | string) {
      return templatesApi.delete(id).then(() => {
        const index = this.items.findIndex(
          item => String(item.id) === String(id),
        );
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      });
    },
    async fetchTemplates() {
      return templatesApi.get().then(({ data }) => {
        this.items = data;
        return data;
      });
    },
    async fetchTemplate(id: number | string) {
      return templatesApi.getOne(id).then(({ data }) => {
        const index = this.items.findIndex(
          item => String(item.id) === String(id),
        );
        if (index !== -1) {
          this.items[index] = data;
        } else {
          this.items.push(data);
        }
        return data;
      });
    },
    async init() {
      await this.fetchTemplates();
    },
  },
});
