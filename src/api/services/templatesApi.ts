import api from "../index";

export interface TemplateItem {
  id: number | string;
  name: string;
  description: string;
  height: string;
  objects: null;
  tags: null | string[];
  preview_image: string | undefined;
}

const templatesApi = {
  getTemplates: () => api.get<TemplateItem[]>("/v1/canvas_templates"),
};

export default templatesApi;
