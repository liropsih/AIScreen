import { toast } from "vuetify-sonner";

export const onError = (message: string) => {
  const id = toast.error(message, {
    action: {
      label: "Close",
      onClick: () => dismissToast(id),
    },
  });
  return id;
};

export const onSuccess = (message: string) => {
  const id = toast.success(message, {
    action: {
      label: "Close",
      onClick: () => dismissToast(id),
    },
  });
  return id;
};

export const onInfo = (message: string) => {
  const id = toast.info(message, {
    action: {
      label: "Close",
      onClick: () => dismissToast(id),
    },
  });
  return id;
};

export const onWarning = (message: string) => {
  const id = toast.warning(message, {
    action: {
      label: "Close",
      onClick: () => dismissToast(id),
    },
  });
  return id;
};

export const showToast = (message: string) => {
  const id = toast(message, {
    action: {
      label: "Close",
      onClick: () => dismissToast(id),
    },
  });
  return id;
};

/**
 * Удаляет конкретное уведомление по идентификатору
 * @param id Идентификатор уведомления для удаления
 */
export const dismissToast = (id: string | number) => toast.dismiss(id);

/**
 * Удаляет все активные уведомления
 */
export const dismissAllToasts = () => toast.dismiss();
