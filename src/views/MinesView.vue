<script setup lang="ts">
import { calculateMinesResult } from "@/utils";
import CustomVerifier from "../components/CustomVerifier.vue";
</script>

<template>
  <main>
    <CustomVerifier
      title="Mines verify"
      :generator="calculateMinesResult"
      cellsGame="mines"
      :bytes="[8, 8, 8]"
    />
  </main>
</template>
