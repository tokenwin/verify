<script setup lang="ts">
defineProps<{
  decimalByte?: number;
  result?: number;
  pow?: number;
  config?: { resultRow: boolean; result: number; suffix?: string };
}>();
</script>

<template>
  <tr v-if="!config?.resultRow">
    <td>{{ pow === 1 ? "" : "+" }}</td>
    <td class="right-td">{{ (result || 0).toFixed(12) }}</td>
    <td class="right-td">{{ `(${decimalByte} / (256 ^ ${pow}))` }}</td>
  </tr>
  <tr v-else>
    <td>=</td>
    <td class="right-td">{{ config.result.toFixed(12) }}</td>
    <td class="right-td">{{ config.suffix || "" }}</td>
  </tr>
</template>

<style scoped>
.right-td {
  text-align: right;
}
</style>
