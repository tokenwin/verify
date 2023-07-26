<script setup lang="ts">
import CustomVerifier from '../components/CustomVerifier.vue'
import { diceBust } from '@/utils'
</script>

<template>
  <main>
    <CustomVerifier title="Dice verify" :generator="diceBust" />
  </main>
</template>
