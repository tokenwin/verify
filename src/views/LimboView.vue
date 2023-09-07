<script setup lang="ts">
import CustomVerifier from "../components/CustomVerifier.vue";
import { calculateLimboResult } from "@/utils";
</script>

<template>
  <main>
    <CustomVerifier title="Limbo verify" :generator="calculateLimboResult" />
  </main>
</template>
