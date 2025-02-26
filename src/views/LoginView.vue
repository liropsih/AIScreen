<template>
  <v-container fluid class="login-view">
    <v-card class="login-view__card" title="Authorization">
      <v-form>
        <v-text-field label="Email" v-model="email" autocomplete="email" />
        <v-text-field
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          autocomplete="current-password"
        />
        <v-checkbox label="Remember me" v-model="rememberMe" />
        <v-btn :loading="loading" @click="login">Login</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { userApi } from "@/api/services";
import { onAuthSuccess } from "@/service/Auth";
import { onError } from "@/service/Toast";
import { useTemplateStore } from "@/store/templateStore";
import { ref } from "vue";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const loading = ref(false);
const showPassword = ref(false);

const login = async () => {
  try {
    loading.value = true;
    const { data } = await userApi.auth({
      email: email.value,
      password: password.value,
      remember_me: rememberMe.value,
    });
    if (!data?.token) {
      throw new Error("Invalid credentials");
    }
    onAuthSuccess(data.token, rememberMe.value);
    useTemplateStore().init();
  } catch (e) {
    onError((e as Error)?.message || "Invalid credentials");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-view {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .v-card {
    width: clamp(20rem, 50%, 30rem);
    padding: 2rem;
  }
}
</style>
