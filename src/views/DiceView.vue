<script setup lang="ts">
import CustomVerifier from "../components/CustomVerifier.vue";
import { calculateGameResult } from "@/utils";
</script>

<template>
  <main>
    <CustomVerifier title="Dice verify" :generator="calculateGameResult" />
  </main>
</template>
