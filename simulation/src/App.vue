<script setup lang="ts">
import FormParameters from './components/FormParameters.vue'
import ChartDist from './components/ChartDist.vue'
import { useChartStore } from './stores/chart'
import { ref } from 'vue'

const chart = useChartStore()
// const kenoMultipliers = {
//   low: [
//     [0.7, 1.85],
//     [0, 2, 3.8],
//     [0, 1.1, 1.38, 26],
//     [0, 0, 2.2, 7.9, 90],
//     [0, 0, 1.5, 4.2, 13, 300],
//     [0, 0, 1.1, 2, 6.2, 100, 700],
//     [0, 0, 1.1, 1.6, 3.5, 15, 225, 700],
//     [0, 0, 1.1, 1.5, 2, 5.5, 39, 100, 800],
//     [0, 0, 1.1, 1.3, 1.7, 2.5, 7.5, 50, 250, 1000],
//     [0, 0, 1.1, 1.2, 1.3, 1.8, 3.5, 13, 50, 250, 1000]
//   ],
//   classic: [
//     [0, 3.96],
//     [0, 1.9, 4.5],
//     [0, 1, 3.1, 10.4],
//     [0, 0.8, 1.8, 5, 22.5],
//     [0, 0.25, 1.4, 4.1, 16.5, 36],
//     [0, 0, 1, 3.68, 7, 16.5, 40],
//     [0, 0, 0.47, 3, 4.5, 14, 31, 60],
//     [0, 0, 0, 2.2, 4, 13, 22, 55, 70],
//     [0, 0, 0, 1.55, 3, 8, 15, 44, 60, 85],
//     [0, 0, 0, 1.4, 2.25, 4.5, 8, 17, 50, 80, 100]
//   ],
//   medium: [
//     [0.4, 2.75],
//     [0, 1.8, 5.1],
//     [0, 0, 2.8, 50],
//     [0, 0, 1.7, 10, 100],
//     [0, 0, 1.4, 4, 14, 390],
//     [0, 0, 0, 3, 9, 180, 710],
//     [0, 0, 0, 2, 7, 30, 400, 800],
//     [0, 0, 0, 2, 4, 11, 67, 400, 900],
//     [0, 0, 0, 2, 2.5, 5, 15, 100, 500, 1000],
//     [0, 0, 0, 1.6, 2, 4, 7, 26, 100, 500, 1000]
//   ],
//   high: [
//     [0, 3.96],
//     [0, 0, 17.1],
//     [0, 0, 0, 81.5],
//     [0, 0, 0, 10, 259],
//     [0, 0, 0, 4.5, 48, 450],
//     [0, 0, 0, 0, 11, 350, 710],
//     [0, 0, 0, 0, 7, 90, 400, 800],
//     [0, 0, 0, 0, 5, 20, 270, 600, 900],
//     [0, 0, 0, 0, 4, 11, 56, 500, 800, 1000],
//     [0, 0, 0, 0, 3.5, 8, 13, 63, 500, 800, 1000]
//   ]
// }

// const kenoProbabilities = [
//   [75, 25],
//   [55.76923, 38.46154, 5.769231],
//   [41.093117, 44.02834, 13.663967, 1.2145749],
//   [29.98687, 44.42499, 21.419193, 3.9391618, 0.22978444],
//   [21.657185, 41.64843, 27.76562, 7.933034, 0.9574352, 0.03829741],
//   [15.469417, 37.126602, 32.12879, 12.692855, 2.3799102, 0.1969581, 0.00547106],
//   [10.919588, 31.8488, 34.3967, 17.639334, 4.5731606, 0.5879778, 0.03379183, 0.00064365],
//   [
//     7.610622, 26.471727, 34.744144, 22.236254, 7.483354, 1.3303741, 0.1187834, 0.00468112,
//     0.00005851
//   ],
//   [
//     5.2323027, 21.404875, 33.50328, 26.058107, 10.944406, 2.5256321, 0.31180644, 0.01909019,
//     0.00049371, 0.00000366
//   ],
//   [
//     3.5444632, 16.878397, 31.07159, 28.820028, 14.710222, 4.236544, 0.6789334, 0.05747584,
//     0.0023093, 0.00003539, 1.2e-9
//   ]
// ]

// let i = 0

// const rtp = kenoMultipliers.classic.reduce(
//   (acc, mult, multiesIndex) =>
//     acc.concat(
//       mult.reduce((acc2, m, multiIndex) => {
//         i++
//         return (acc2 += m * (kenoProbabilities[multiesIndex][multiIndex] / 100))
//       }, 0)
//     ),
//   []
// )

// console.log(rtp, i, rtp)

// const chartsKeno = ref()

// chartsKeno.value = kenoProbabilities.map((probabilities, i) => ({
//   labels: probabilities,
//   datasets: [{ label: `Probabilities / multipliers ${i + 1}`, data: kenoMultipliers['classic'][i] }]
// }))
// chartsKeno.value = [
//   ...chartsKeno.value,
//   {
//     labels: kenoProbabilities[9],
//     datasets: [
//       {
//         label: `exp(probabilities)`,
//         data: kenoProbabilities[9].map((probability) => Math.exp(probability))
//       }
//     ]
//   }
// ]
</script>

<template>
  <div class="content-wrapper">
    <FormParameters />
    <div class="chart"><ChartDist :data="chart.chartRtp" /></div>
    <div class="chart"><ChartDist type="bar" :data="chart.chartBust" /></div>
    <div class="chart"><ChartDist :data="chart.chartBetsDistribution" /></div>
    <div class="chart"><ChartDist :data="chart.chartPlayersOnlineDistribution" /></div>
    <!-- <div v-for="(chartData, index) in chartsKeno" class="chart" :key="index">
      <ChartDist type="bar" :data="chartData" />
    </div> -->
  </div>
</template>

<style scoped>
.chart {
  width: 900px;
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
