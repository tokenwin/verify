import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useChartStore = defineStore('chart', () => {
  const chartRtp = ref()
  const chartBust = ref()
  const chartBetsDistribution = ref()
  const chartPlayersOnlineDistribution = ref()

  function setChartRtpData(data: any) {
    chartRtp.value = data
  }

  function setChartBustData(data: any) {
    chartBust.value = data
  }

  function setChartBetsDistribution(data: any) {
    chartBetsDistribution.value = data
  }

  function setChartPlayersOnlineDistribution(data: any) {
    chartPlayersOnlineDistribution.value = data
  }

  return {
    chartRtp,
    chartBust,
    chartBetsDistribution,
    chartPlayersOnlineDistribution,
    setChartRtpData,
    setChartBustData,
    setChartBetsDistribution,
    setChartPlayersOnlineDistribution
  }
})
