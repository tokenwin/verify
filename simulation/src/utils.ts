import CryptoJS from 'crypto-js'

// interface Player {
//   id: number
//   data: PlayerData
// }

// interface PlayerData {
//   balance: number
//   multipliers: number[]
//   bets: number[]
//   wins: number[]
//   busts: number[]
//   betsAmount: number
//   winsAmount: number
//   rtp: number
// }

interface Player {
  balance: number
  multipliers: number[]
  bets: number[]
  wins: number[]
  betsAmount: number
  winsAmount: number
  rtp: number
}

export interface DataGraph {
  playersCount: number
  betInterval: [number, number]
  multiplierInterval: [number, number]
  players: Player[]
  bank: number
  betsAmount: number
  winsAmount: number
  rtp: number
  rtps: number[]
  ggr: number
  ggrs: number[]
  busts: number[]
}

const randomFromTo = (interval: [number, number]): number =>
  interval[0] + Math.random() * (interval[1] - interval[0])

function weightedRandom<T>(items: T[], weights: number[]) {
  // for (i = 1; i < weights.length; i++) weights[i] += weights[i - 1]
  const cumulativeWeights = weights.map(
    (
      (sum) => (value: number) =>
        (sum += value)
    )(0)
  )

  const random = Math.random() * cumulativeWeights[cumulativeWeights.length - 1]

  let i
  for (i = 0; i < cumulativeWeights.length; i++) if (cumulativeWeights[i] > random) break

  return items[i]
}

const gameResult = (seed: string, salt: string): number => {
  const nBits = 52

  if (salt) {
    const hmac = CryptoJS.HmacSHA256(seed, salt)
    seed = hmac.toString(CryptoJS.enc.Hex)
  }

  const r = parseInt(seed.slice(0, nBits / 4), 16)

  let X = r / Math.pow(2, nBits)
  X = parseFloat(X.toPrecision(9))

  X = 99 / (1 - X)

  return Math.max(1, Math.floor(X) / 100)
}

export const generateBusts = (config: {
  startHash: string
  salt: string
  rounds: number
  playersCount: number
  playersOnlineInterval?: [number, number]
  oftenPlayersOnline?: number
  betInterval: [number, number]
  oftenBet?: number
  balanceInterval: [number, number]
  multiplierInterval: [number, number]
  bank: number
  step?: number
}): {
  data: DataGraph
  numbersBets: number[]
  rtpsChart: number[]
  ggrsChart: number[]
  betsDistribution: [number[], number[]]
  onlineDistribution: [number[], number[]]
} => {
  const {
    startHash,
    salt,
    rounds,
    playersCount,
    playersOnlineInterval = [0, playersCount],
    oftenPlayersOnline = (playersOnlineInterval[0] + playersOnlineInterval[1]) / 2,
    betInterval,
    oftenBet = (betInterval[0] + betInterval[1]) / 2,
    balanceInterval,
    multiplierInterval,
    bank,
    step
  } = config

  const [bets, betsWeights] = generateWeights({
    max: oftenBet,
    from: betInterval[0],
    to: betInterval[1]
  })
  const [playersOnline, playersOnlineWeights] = generateWeights({
    max: oftenPlayersOnline,
    from: playersOnlineInterval[0],
    to: playersOnlineInterval[1]
  })

  let prevHash = null
  const data: DataGraph = {
    playersCount,
    betInterval,
    multiplierInterval,
    players: [],
    bank,
    betsAmount: 0,
    winsAmount: 0,
    rtp: 0,
    rtps: [],
    ggr: 0,
    ggrs: [],
    busts: []
  }
  // let availablePlayers = data.players
  for (let i = 0; i < playersCount; i++) {
    data.players[i] = {
      // id: i,
      // data: {
      balance: Math.floor(randomFromTo(balanceInterval)),
      multipliers: [],
      bets: [],
      wins: [],
      betsAmount: 0,
      winsAmount: 0,
      rtp: 0
      // }
    }
  }
  for (let i = 0; i < rounds; i++) {
    const hash: string = prevHash ? CryptoJS.SHA256(prevHash).toString() : startHash
    const bust = gameResult(hash, salt)
    data.busts.push(bust)
    const playersBet = weightedRandom(playersOnline, playersOnlineWeights)
    // while (playersBet > availablePlayers.length)
    //   playersBet = weightedRandom(playersOnline, [...playersOnlineWeights])
    let playersNumbers: number[] | null = null
    if (playersBet > 0) {
      playersNumbers = []
      if (playersBet < playersCount) {
        while (playersNumbers.length < playersBet) {
          const playerNumber = Math.floor(randomFromTo([0, playersCount - 1]))

          if (!playersNumbers.includes(playerNumber)) {
            playersNumbers.push(playerNumber)
            // try{
            // playersNumbers.push(availablePlayers[playerNumber].id)
            // } catch {
            //   console.log("availablePlayers:", availablePlayers)
            //   break
            // }
          }
        }
      }
    }
    for (let w = 0; w < playersCount; w++) {
      // const player = data.players[w].data
      const player = data.players[w]
      let multiplier = 0
      if (playersNumbers?.includes(w)) {
        multiplier = randomFromTo(multiplierInterval) // auto cashout
        const bet = weightedRandom(bets, betsWeights)
        player.bets.push(bet)
        player.balance -= bet
        data.bank += bet
        player.betsAmount += bet
        data.betsAmount += bet
        if (bust >= multiplier) {
          const win = bet * multiplier
          player.balance += win
          player.wins.push(win)
          data.bank -= win
          player.winsAmount += win
          data.winsAmount += win
        } else {
          player.wins.push(bet * -1)
        }
      } else {
        player.bets.push(0)
        player.wins.push(0)
      }
      player.multipliers.push(multiplier)
    }
    data.rtps.push(!data.betsAmount ? 0 : (data.winsAmount / data.betsAmount) * 100)
    data.ggrs.push(data.betsAmount - data.winsAmount)
    // availablePlayers = data.players.filter((player) => player.data.balance > 0)
    prevHash = hash
    // if (!availablePlayers.length) break
  }
  data.players.forEach(
    // (player) => (player.data.rtp = (player.data.winsAmount / player.data.betsAmount) * 100)
    (player) => (player.rtp = (player.winsAmount / player.betsAmount) * 100)
  )
  data.rtp = (data.winsAmount / data.betsAmount) * 100
  data.ggr = data.betsAmount - data.winsAmount

  const numbersBets: number[] = []
  const rtpsChart: number[] = []
  const ggrsChart: number[] = []
  for (let i = 0; i < data.rtps.length; i += step ? step : rounds / 100) {
    numbersBets.push(i)
    rtpsChart.push(data.rtps[i])
    ggrsChart.push(data.ggrs[i])
  }
  rtpsChart.shift()

  // data.players.sort((first, second) => second.data.balance - first.data.balance)

  return {
    data,
    numbersBets,
    rtpsChart,
    ggrsChart,
    betsDistribution: [bets, betsWeights],
    onlineDistribution: [playersOnline, playersOnlineWeights]
  }
}

const normalDistribution = ({
  x,
  max = 0,
  from = 0,
  to
}: {
  x: number
  max?: number
  from?: number
  to: number
}) => {
  const koef = (to - from) / 3
  return (
    (1 / (koef * Math.sqrt(2 * Math.PI))) *
    Math.exp((-1 / (2 * Math.pow(koef, 2))) * Math.pow(x - max, 2))
  )
}

const generateWeights = ({
  max = 0,
  from = 0,
  to,
  step = 1
}: {
  max?: number
  from?: number
  to: number
  step?: number
}): [number[], number[]] => {
  const numbers: number[] = []
  const weights: number[] = []
  const interval = (to - from) / step
  const end = to * interval
  let i = from
  while (i < end) {
    const mi = i / interval
    numbers.push(mi)
    weights.push(normalDistribution({ x: mi, max, from, to }))
    i += end / interval
  }
  return [numbers, weights]
}
