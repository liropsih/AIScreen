import { getFile, getFormData } from "@/utils/apiUtils";
import api from "../index";

export interface TemplateItem {
  id: number | string;
  name: string;
  height: string | number;
  width: string | number;
  objects?: unknown;
  tags: null | string[];
  preview_image: string | null;
}

const url = "/v1/canvas_templates";

const templatesApi = {
  get: () => api.get<TemplateItem[]>(url),
  create: (data: Omit<TemplateItem, "id">) => {
    const file = getFile(data.preview_image);
    const formData = getFormData({
      ...data,
      preview_image: file as File | null,
    });
    return api.post<TemplateItem>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id: number | string) => api.delete(url, { data: { id } }),
  getOne: (id: string | number) => api.get<TemplateItem>(`${url}/${id}`),
  update: (id: number | string, data: Omit<TemplateItem, "id">) => {
    const file = getFile(data.preview_image);
    const formData = getFormData({
      ...data,
      preview_image: file as File | null,
      _method: "PATCH",
    });
    return api.post<TemplateItem>(`${url}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default templatesApi;
