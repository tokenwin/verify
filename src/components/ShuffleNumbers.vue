<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  width: number;
  result: number[];
}>();

const tableData = computed(() => {
  const defaultRow = new Array(props.width).fill(0).map((_, i) => i);
  return props.result.map((_, i, arr) => {
    if (i) {
      return defaultRow.filter((el) => !arr.slice(0, i).includes(el));
    }
    return defaultRow;
  });
});
</script>

<template>
  <div class="wrapper">
    <table>
      <tbody>
        <tr
          v-for="(row, rowIndex) in tableData"
          :key="'shuffle-numbers-row' + rowIndex"
        >
          <td
            v-for="(cell, cellIndex) in rowIndex
              ? [...result.slice(0, rowIndex), ...row]
              : row"
            :key="'shuffle-numbers-cell' + rowIndex + cellIndex"
            :class="{ 'result-cell': cell === result[rowIndex] }"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.wrapper {
  overflow-x: auto;
}
td {
  min-width: 27px;
  text-align: center;
}
.result-cell {
  background-color: chartreuse;
}
</style>
