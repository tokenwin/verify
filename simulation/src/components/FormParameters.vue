<script setup lang="ts">
import { ref } from 'vue'
import InputStyled from './InputStyled.vue'
import { generateBusts } from '@/utils'
import { useChartStore } from '@/stores/chart'
import ChartLoader from './ChartLoader.vue'

const chart = useChartStore()

const config = ref({
  playersCount: '100',
  balanceFrom: '1000',
  balanceTo: '100000',
  playersOnlineFrom: '0',
  playersOnlineTo: '50',
  oftenOnline: '33',
  betFrom: '0',
  betTo: '200',
  oftenBet: '75',
  rounds: '100000'
})

const loading = ref(false)

const handleClick = () => {
  loading.value = true

  setTimeout(() => {
    const result = generateBusts({
      startHash: 'e520fbfe5d4c66ff8fb308de437fdb18659620661da3c6f0d906d8c9318f764d',
      salt: '0000000000000000000301e2801a9a9598bfb114e574a91a887f2132f33047e6',
      rounds: +config.value.rounds,
      playersCount: +config.value.playersCount,
      playersOnlineInterval: [+config.value.playersOnlineFrom, +config.value.playersOnlineTo],
      oftenPlayersOnline: +config.value.oftenOnline,
      betInterval: [+config.value.betFrom, +config.value.betTo],
      oftenBet: +config.value.oftenBet,
      balanceInterval: [+config.value.balanceFrom, +config.value.balanceTo],
      multiplierInterval: [1.01, 100],
      bank: 100000
    })
    const resultBusts = result.data.busts
    const chartBusts: {x: number, y: number}[] = []

    for (let i = 0; i < resultBusts.length; i++) {
      if (!chartBusts.find((bust) => bust.x === resultBusts[i])) {
        chartBusts.push({x: resultBusts[i], y: resultBusts.filter((bust) => bust === resultBusts[i]).length})
      }
    }

    chart.setChartRtpData({
      labels: result.numbersBets,
      datasets: [
        { label: 'RTP / bets', data: result.rtpsChart },
        {
          label: '98%',
          data: result.numbersBets.map(() => 98),
          borderColor: 'rgb(75, 192, 192)',
          pointRadius: 0,
          borderWidth: 1
        }
      ]
    })

    chart.setChartBustData({
      labels: chartBusts.map(bust => bust.x).sort((first, second) => first - second),
      datasets: [{ label: 'Busts', data: chartBusts, backgroundColor: 'rgb(75, 0, 0)' }]
    })

    chart.setChartBetsDistribution({
      labels: result.betsDistribution[0],
      datasets: [{ label: 'Bets Distribution', data: result.betsDistribution[1] }]
    })

    chart.setChartPlayersOnlineDistribution({
      labels: result.onlineDistribution[0],
      datasets: [{ label: 'Online Distribution', data: result.onlineDistribution[1] }]
    })

    console.log(result.data)
    loading.value = false
  }, 0)
}
</script>

<template>
  <div class="wrapper">
    <div class="line-wrapper">
      <InputStyled v-model="config.playersCount" label="Players" />
    </div>
    <div class="line-wrapper">
      <InputStyled v-model="config.balanceFrom" label="Balance" />
      <p>-</p>
      <InputStyled v-model="config.balanceTo" />
    </div>
    <div class="line-wrapper">
      <InputStyled v-model="config.playersOnlineFrom" label="Players Online" />
      <p>-</p>
      <InputStyled v-model="config.playersOnlineTo" />
    </div>
    <div class="line-wrapper">
      <InputStyled v-model="config.oftenOnline" label="Often Online" />
    </div>
    <div class="line-wrapper">
      <InputStyled v-model="config.betFrom" label="Bet" />
      <p>-</p>
      <InputStyled v-model="config.betTo" />
    </div>
    <div class="line-wrapper">
      <InputStyled v-model="config.oftenBet" label="Often Bet" />
    </div>
    <div class="line-wrapper">
      <InputStyled v-model="config.rounds" label="Rounds" />
    </div>
    <div class="line-wrapper" :style="{ marginBottom: 0 }">
      <button @click="handleClick">Generate</button>
      <ChartLoader v-if="loading" />
    </div>
  </div>
</template>

<style scoped>
.line-wrapper {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.wrapper {
  border: 1px solid black;
  padding: 10px;
  width: 600px;
}
button {
  color: white;
  background-color: #405cf5;
  border-width: 0;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  padding: 10px 25px;
}
</style>
