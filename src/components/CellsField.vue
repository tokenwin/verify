<script setup lang="ts">
defineProps<{
  result: number[];
  width: number;
  height: number;
}>();

const generateArray = (size: number) =>
  new Array(size).fill(0).map((_, i) => i);
</script>

<template>
  <table>
    <tbody>
      <tr v-for="indexRow in generateArray(height)">
        <td
          v-for="indexCol in generateArray(width)"
          :style="
            result.includes(indexRow * width + indexCol)
              ? { backgroundColor: 'red' }
              : {}
          "
        ></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
td {
  width: 80px;
  height: 80px;
  border: 1px solid #000;
}
</style>
