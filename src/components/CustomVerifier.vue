<script setup lang="ts">
import { generateBytes } from "@/utils";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import CellsField from "./CellsField.vue";
import HexTable from "./HexTable.vue";
import BytesToNumber from "./BytesToNumber.vue";
import ShuffleNumbers from "./ShuffleNumbers.vue";

const props = withDefaults(
  defineProps<{
    generator: (...args: any[]) => number | number[];
    bytes: number[]; //quantity of bytes for each hash
    maxResult?: number;
    withEdged?: boolean;
    title?: string;
    cellsGame?: "mines" | "keno";
  }>(),
  {
    title: "Verify",
  }
);

const route = useRoute();

const config = ref({
  clientSeed: String(route.query.clientSeed || ""),
  serverSeed: String(route.query.serverSeed || ""),
  nonce: Number(route.query.nonce || 0),
  minesCount: Number(route.query.minesCount || 1),
});

const result = computed(() =>
  props.generator(
    {
      clientSeed: config.value.clientSeed,
      serverSeed: config.value.serverSeed,
      clientNonce: Number(config.value.nonce),
    },
    24
  )
);

const decimalBytesResult = computed(() =>
  props.bytes
    .map(
      (quantBytes, index) =>
        generateBytes(
          quantBytes,
          {
            clientNonce: Number(config.value.nonce),
            clientSeed: config.value.clientSeed,
            serverSeed: config.value.serverSeed,
          },
          props.bytes.length > 1 ? { cursor: index } : {}
        ) as number[][]
    )
    .flat()
);
</script>

<template>
  <div class="main">
    <h1 class="text-center pb-5">{{ title }}</h1>
    <hr />
    <form class="py-5">
      <h2 class="text-center">Input</h2>
      <div class="form-group">
        <input
          v-model="config.serverSeed"
          class="form-control"
          placeholder="Server Seed"
        />
      </div>
      <div class="form-group">
        <input
          v-model="config.clientSeed"
          class="form-control"
          placeholder="Client Seed"
        />
      </div>
      <div class="form-group">
        <input
          type="number"
          v-model.number="config.nonce"
          class="form-control"
          placeholder="Nonce"
        />
      </div>
      <div v-if="cellsGame === 'mines'" class="form-group">
        <input
          type="number"
          v-model.number="config.minesCount"
          class="form-control"
          placeholder="Mines Count"
        />
      </div>
    </form>
    <hr />
    <h2 class="text-center pb-5">Output</h2>
    <div v-if="cellsGame" class="cell-field-wrapper">
      <CellsField
        :result="generator(
            {
              clientSeed: config.clientSeed,
              serverSeed: config.serverSeed,
              clientNonce: Number(config.nonce),
            },
            config.minesCount
          ) as number[]
        "
        :width="cellsGame === 'mines' ? 5 : 10"
        :height="cellsGame === 'mines' ? 5 : 4"
      />
    </div>
    <div>
      <h5>Final Result</h5>
      <div :style="{ marginBottom: '24px' }">
        {{ result }}
      </div>
      <h5>Casino Seeds to Bytes</h5>
      <HexTable
        v-for="(quantBytes, index) in bytes"
        :serverSeed="config.serverSeed"
        :clientSeed="config.clientSeed"
        :nonce="Number(config.nonce)"
        :highlight="quantBytes * 4"
        v-bind="bytes.length > 1 ? { cursor: index } : {}"
      />
      <h5>Bytes to Number</h5>
      <div v-if="!withEdged">
        <div class="overflow-wrapper">
          <div class="bytes-to-number-wrapper">
            <BytesToNumber
              v-for="(decimalBytes, index) in decimalBytesResult"
              :decimalBytesResult="decimalBytes"
              :maxResult="
                !cellsGame
                  ? maxResult!
                  : cellsGame === 'mines'
                  ? 24 - index
                  : 39 - index
              "
              :multiplier-result="cellsGame ? 1 : 100"
              :floored="Boolean(cellsGame)"
            />
          </div>
        </div>
        <div v-if="cellsGame">
          <h5>Numbers to Shuffle</h5>
          <ShuffleNumbers
            :width="cellsGame === 'mines' ? 25 : 40"
            :result="(result as number[])"
          />
        </div>
      </div>
      <div v-else>
        <BytesToNumber
          :decimalBytesResult="decimalBytesResult.flat()"
          :finalResult="(result as number)"
          :maxResult="maxResult!"
          :withEdged="withEdged"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  width: 800px;
  margin: 50px auto;
}
.text-center {
  text-align: center !important;
}
.pb-5,
.py-5 {
  padding-bottom: 3rem !important;
}
h1 {
  font-size: 2.5rem;
}
h5 {
  font-size: 1.25rem;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
  margin-top: 0;
}
hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
.form-group {
  margin-bottom: 1rem;
}
.form-control {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.form-control:disabled,
.form-control[readonly] {
  background-color: #e9ecef;
  opacity: 1;
}
label {
  display: inline-block;
  margin-bottom: 0.5rem;
}
.cell-field-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bytes-to-number-wrapper {
  display: flex;
  white-space: nowrap;
}
.overflow-wrapper {
  overflow-x: auto;
  margin-bottom: 24px;
}
@media (max-width: 800px) {
  .main {
    width: auto;
    margin: 50px 30px;
  }
}
</style>
