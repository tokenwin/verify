<script setup lang="ts">
import { generateBytes } from "@/utils";

withDefaults(
  defineProps<{
    serverSeed: string;
    clientSeed: string;
    nonce: number;
    highlight?: number;
    cursor?: number;
  }>(),
  { highlight: 0 }
);
</script>

<template>
  <div class="wrapper">
    <div class="hmac">
      HMAC_SHA256({{ clientSeed }}:{{ nonce
      }}{{ typeof cursor === "number" ? `:${cursor}` : "" }}, {{ serverSeed }})
    </div>
    <table>
      <tr
        v-for="arrays in generateBytes(
          8,
          { clientNonce: nonce, clientSeed, serverSeed },
          { withHex: true, cursor }
        )"
      >
        <td
          v-for="(number, index) in arrays.flat()"
          :style="index < highlight ? { fontWeight: 'bold' } : {}"
        >
          {{ number }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.wrapper {
  overflow-x: auto;
  margin-bottom: 24px;
}
.hmac {
  white-space: nowrap;
}
td {
  text-align: center;
  min-width: 25px;
}
</style>
