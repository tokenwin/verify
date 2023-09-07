<script setup lang="ts">
import CryptoJS from "crypto-js";
import { ref } from "vue";
import { generateBust } from "../utils";
import { useRoute } from "vue-router";

const route = useRoute();

let isVerifying = false;
const config = ref({
  amount: 10,
  hash: route.query.hash || "",
  salt:
    route.query.salt ||
    "0000000000000000000301e2801a9a9598bfb114e574a91a887f2132f33047e6",
});

const tableRows = ref<{ hash: string; bust: number }[]>([]);

const handleClick = () => {
  if (isVerifying) return;
  tableRows.value = [];
  isVerifying = true;
  let prevHash = null;
  for (let i = 0; i < config.value.amount; i++) {
    let hash: string = String(
      prevHash ? CryptoJS.SHA256(String(prevHash)) : config.value.hash
    );
    let bust = generateBust(hash, config.value.salt as string);
    setTimeout(function () {
      tableRows.value = [...tableRows.value, { hash, bust }];
    }, i * 1);
    prevHash = hash;
  }
  isVerifying = false;
};
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Crash - Game Verification Script</h1>
      <h2 class="subtitle">
        Third party script used to verify games on crash game.
      </h2>
    </div>
    <hr />
    <div class="container">
      <div class="field">
        <label class="label">Game's hash</label>
        <p class="control has-icons-left">
          <input
            class="input"
            v-model="config.hash"
            type="text"
            id="game_hash_input"
            placeholder="Game's hash (SHA256)"
          />
        </p>
      </div>
      <div class="field">
        <label class="label">Salt</label>
        <p class="control has-icons-left">
          <input
            class="input"
            v-model="config.salt"
            type="text"
            id="game_salt_input"
            placeholder="Salt"
          />
        </p>
      </div>
      <div class="field">
        <label class="label">Amount of games</label>
        <p class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model.number="config.amount"
            id="game_amount_input"
            min="1"
            max="100000"
            step="1"
            placeholder="Amount of games"
          />
        </p>
      </div>
      <div class="field is-grouped">
        <p class="control">
          <a
            class="button is-primary"
            id="game_verify_submit"
            @click="handleClick"
            >Verify</a
          >
          <span v-if="config.amount >= 10000" class="amount-warning">
            Verifying a huge amount of games may consume more ressources from
            your CPU
          </span>
        </p>
      </div>
    </div>
    <hr />
    <div class="container">
      <table
        v-if="tableRows?.length"
        class="table is-striped is-fullwidth is-hoverable is-narrow"
        style="display: table"
      >
        <thead>
          <tr>
            <th><b>Game's hash</b></th>
            <th><b>Bust</b></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(tableRow, index) in tableRows"
            :style="index === 0 ? { backgroundColor: '#f3e2d1' } : {}"
            :key="index"
          >
            <td>{{ tableRow.hash }}</td>
            <td
              :style="
                tableRow.bust < 1.98
                  ? { color: '#BF4A67' }
                  : { color: '#44B39D' }
              "
            >
              {{ tableRow.bust }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 3rem 1.5rem;
}
.container {
  margin: 0 auto;
  position: relative;
}
.title {
  color: #363636;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
}
.subtitle {
  color: #4a4a4a;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.25;
}
.subtitle:not(:last-child),
.title:not(:last-child) {
  margin-bottom: 1.5rem;
}
hr {
  background-color: #dbdbdb;
  border: none;
  display: block;
  height: 1px;
  margin: 1.5rem 0;
}
.field:not(:last-child) {
  margin-bottom: 0.75rem;
}
.label {
  color: #363636;
  display: block;
  font-size: 1rem;
  font-weight: 700;
}
.label:not(:last-child) {
  margin-bottom: 0.5em;
}
.control {
  font-size: 1rem;
  position: relative;
  text-align: left;
}
.input {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: "none";
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 3px;
  -webkit-box-shadow: none;
  box-shadow: none;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  font-size: 1rem;
  height: 2.25em;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  line-height: 1.5;
  padding-bottom: calc(0.375em - 1px);
  padding-left: calc(0.625em - 1px);
  padding-right: calc(0.625em - 1px);
  padding-top: calc(0.375em - 1px);
  position: relative;
  vertical-align: top;
  background-color: #fff;
  border-color: #dbdbdb;
  color: #363636;
  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  max-width: 100%;
  width: 100%;
}
.control.has-icons-left .icon.is-left {
  left: 0;
}
.control.has-icons-left .icon {
  color: #dbdbdb;
  height: 2.25em;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 2.25em;
  z-index: 4;
}
.button.is-primary {
  background-color: #00d1b2;
  border-color: transparent;
  color: #fff;
}
.button {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: "none";
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 3px;
  -webkit-box-shadow: none;
  box-shadow: none;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  font-size: 1rem;
  height: 2.25em;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  line-height: 1.5;
  padding-bottom: calc(0.375em - 1px);
  padding-left: calc(0.625em - 1px);
  padding-right: calc(0.625em - 1px);
  padding-top: calc(0.375em - 1px);
  position: relative;
  vertical-align: top;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: #fff;
  border-color: #dbdbdb;
  color: #363636;
  cursor: pointer;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding-left: 0.75em;
  padding-right: 0.75em;
  text-align: center;
  white-space: nowrap;
}
.amount-warning {
  background-color: #ffdd57;
  margin-left: 0.5em;
  font-size: 0.75em;
  padding: 0.25em 0.75em;
}
table {
  table-layout: fixed;
}
table thead tr th:first-child {
  width: 80%;
}
table tbody tr td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
div,
input,
textarea,
p,
blockquote,
th,
td {
  margin: 0;
  padding: 0;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
caption,
th {
  text-align: left;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
  font-weight: normal;
}
.table {
  background-color: #fff;
  color: #363636;
  margin-bottom: 1.5rem;
}

.table.is-narrow td,
.table.is-narrow th {
  padding: 0.25em 0.5em;
}

.table td,
.table th {
  border: 1px solid #dbdbdb;
  border-width: 0 0 1px;
  padding: 0.5em 0.75em;
  vertical-align: top;
}
table tbody tr td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.table.is-fullwidth {
  width: 100%;
}
@media (min-width: 1216px) {
  .container {
    max-width: 1152px;
    width: 1152px;
  }
}
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
    width: 960px;
  }
}
</style>
