import type { TemplateItem } from "@/api/services/templatesApi";
import { convertBase64ToFile } from "./fileUtils";

export const getFile = (file?: string | null): File | null | undefined => {
  if (!file) {
    return null;
  }
  const isUrl = file.startsWith("http");
  if (isUrl) {
    return undefined;
  }
  return convertBase64ToFile(file);
};

export const getFormData = (
  data: Partial<
    Omit<TemplateItem, "preview_image"> & {
      preview_image: File | null;
      _method?: string;
    }
  >,
): FormData => {
  const formData = new FormData();
  const keys = [
    "name",
    "description",
    "height",
    "width",
    "preview_image",
    "tags",
    "_method",
  ] as (keyof TemplateItem)[];
  keys.forEach(key => {
    if (data[key] !== undefined) {
      if (Array.isArray(data[key])) {
        if (data[key].length === 0) {
          formData.append(key, "");
        } else {
          data[key].forEach(item => {
            formData.append(`${key}[]`, item);
          });
        }
      } else {
        formData.append(key, (data[key] as string | File) || "");
      }
    }
  });
  return formData;
};
