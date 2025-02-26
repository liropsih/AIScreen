import { createPinia } from "pinia";
import { createPiniaLocalStoragePlugin } from "@/store/piniaLocalStoragePlugin";

const pinia = createPinia();

pinia.use(
  createPiniaLocalStoragePlugin({
    prefix: "aiscreen-",
    stores: ["template-store"],
  }),
);

export default pinia;
