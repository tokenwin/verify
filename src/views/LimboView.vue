<script setup lang="ts">
import CustomVerifier from '../components/CustomVerifier.vue'
import { generateBust } from '@/utils'
</script>

<template>
  <main>
    <CustomVerifier title="Limbo verify" :generator="generateBust" />
  </main>
</template>
