<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'

withDefaults(
  defineProps<{
    data: any
    type?: 'line' | 'bar'
  }>(),
  {
    type: 'line'
  }
)

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale
)
</script>

<template>
  <Line v-if="data && type === 'line'" type="line" :data="data" />
  <Bar v-if="data && type === 'bar'" type="bar" :data="data" />
</template>
