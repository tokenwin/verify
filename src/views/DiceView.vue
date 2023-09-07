<script setup lang="ts">
import CustomVerifier from "../components/CustomVerifier.vue";
import { calculateDiceResult } from "@/utils";
</script>

<template>
  <main>
    <CustomVerifier title="Dice verify" :generator="calculateDiceResult" />
  </main>
</template>
