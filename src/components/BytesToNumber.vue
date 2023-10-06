<script setup lang="ts">
import { computed, ref } from "vue";
import ArithmeticalRow from "./ArithmeticalRow.vue";

const props = defineProps<{
  decimalBytesResult: number[];
  maxResult: number;
  finalResult?: number;
  withEdged?: boolean;
  multiplierResult?: number;
  floored?: boolean;
}>();

const generateResult = (number: number, pow: number) => {
  const result = number / Math.pow(256, pow);
  return result;
};

const result = computed(() => {
  let total = 0;
  const rows = [];

  for (let i = 0; i < props.decimalBytesResult.length; i++) {
    const byte = props.decimalBytesResult[i];
    const result = generateResult(byte, i + 1);
    rows.push({ result, byte });
    total += result;
  }

  return { total, rows };
});
const roundMethod = ref(props.floored ? Math.floor : Math.round);
</script>

<template>
  <div class="wrapper">
    <span>
      ({{ decimalBytesResult.join(", ") }}) -> [0, ..., {{ maxResult }}] =
      {{
        roundMethod(
          (finalResult ?? result.total) *
            (maxResult + 1) *
            (multiplierResult ?? 100)
        )
      }}</span
    >
    <table>
      <tbody>
        <ArithmeticalRow
          v-for="(row, index) in result.rows"
          :decimalByte="row.byte"
          :result="row.result"
          :pow="index + 1"
        />
        <ArithmeticalRow
          :config="{
            resultRow: true,
            result: result.total,
            suffix: `(* ${maxResult + 1})`,
          }"
        />
        <ArithmeticalRow
          :config="{ resultRow: true, result: result.total * (maxResult + 1) }"
        />
      </tbody>
    </table>
    <div v-if="withEdged">
      <h5>Raw to Edged</h5>
      <span>{{
        `${maxResult + 1} / (${Math.floor(
          result.total * (maxResult + 1)
        )} + 1) * (1 - 0.01) = ${
          ((maxResult + 1) / (Math.floor(result.total * (maxResult + 1)) + 1)) *
          0.99
        }`
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  margin-right: 24px;
  width: fit-content;
}
table {
  width: 100%;
}
h5 {
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
  margin-top: 24px;
  font-size: 1.25rem;
}
</style>
