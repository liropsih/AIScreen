import type { PiniaPluginContext } from "pinia";

export const createPiniaLocalStoragePlugin = (options: {
  prefix?: string;
  stores?: string[];
}) => {
  const prefix = options.prefix || "pinia-";
  const stores = options.stores || [];

  return ({ store }: PiniaPluginContext) => {
    if (stores.length > 0 && !stores.includes(store.$id)) {
      return;
    }

    const storageKey = `${prefix}${store.$id}`;

    const storedState = localStorage.getItem(storageKey);
    if (storedState) {
      try {
        store.$patch(JSON.parse(storedState));
      } catch (error) {
        console.error(
          `Ошибка при загрузке состояния из localStorage для ${store.$id}:`,
          error,
        );
        localStorage.removeItem(storageKey);
      }
    }
    store.$subscribe(
      (_, state) => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
          console.error(
            `Ошибка при сохранении состояния в localStorage для ${store.$id}:`,
            error,
          );
        }
      },
      { detached: true },
    );
  };
};
