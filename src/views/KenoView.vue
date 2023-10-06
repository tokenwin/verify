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
      :bytes="[8, 2]"
    />
  </main>
</template>
