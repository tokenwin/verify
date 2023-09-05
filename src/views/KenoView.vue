<script setup lang="ts">
import { calculateKenoResult } from "@/utils";
import CustomVerifier from "../components/CustomVerifier.vue";
</script>

<template>
  <main>
    <CustomVerifier
      title="Keno verify"
      :generator="calculateKenoResult"
      cellsGame="keno"
    />
  </main>
</template>
