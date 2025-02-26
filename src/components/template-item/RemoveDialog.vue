<template>
  <v-dialog v-model="dialog" max-width="290">
    <v-card>
      <v-card-title>Remove Template</v-card-title>
      <v-card-text>Are you sure you want to remove this template?</v-card-text>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-btn @click="(emit('remove'), (dialog = false))">Remove</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const dialog = defineModel<boolean>("modelValue");

const emit = defineEmits<{
  (e: "remove"): void;
}>();
</script>
