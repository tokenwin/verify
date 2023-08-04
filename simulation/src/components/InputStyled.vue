<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <p v-if="label">{{ label }}:</p>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value || '')"
  />
</template>

<style scoped>
input {
  margin: 0 10px 0;
  border: 1px solid rgba(60, 60, 60, 0.3);
  border-radius: 4px;
  padding: 1em;
}
input:focus {
  outline: 1px solid blue;
}
p {
  width: 120px;
}
</style>
