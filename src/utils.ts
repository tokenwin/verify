import CryptoJS from 'crypto-js'

interface Cells<T> {
  num: T
  hash: string
}

const cellsMines = [
  1, 11, 2, 3, 13, 4, 14, 5, 15, 6, 25, 16, 7, 24, 17, 8, 23, 18, 9, 22, 19, 10, 21, 20, 12
]

export function generateBust(seed: string, salt?: string): number {
  const nBits = 52

  if (salt) {
    const hmac = CryptoJS.HmacSHA256(CryptoJS.enc.Hex.parse(seed), salt)
    seed = hmac.toString(CryptoJS.enc.Hex)
  }
  const r = parseInt(seed.slice(0, nBits / 4), 16)
  let X = r / Math.pow(2, nBits)
  X = parseFloat(X.toPrecision(9))
  X = 99 / (1 - X)
  return Math.max(1, Math.floor(X) / 100)
}

export function encryptWithNonce(serverSeed: string, clientSeed: string, nonce: number): string {
  const result = CryptoJS.HmacSHA256(clientSeed + ':' + nonce, serverSeed).toString()
  return result
}

function generateNumbers<T>(allNumbers: Array<T>, hash: string): Array<Cells<T>> {
  const generatedNumbers: Array<Cells<T>> = []
  let h = CryptoJS.SHA256(hash).toString(CryptoJS.enc.Hex)
  allNumbers.forEach((c) => {
    generatedNumbers.push({ num: c, hash: h })
    h = h.substring(1) + h.charAt(0)
  })
  generatedNumbers.sort((first, second) => {
    if (first.hash < second.hash) {
      return -1
    } else if (first.hash === second.hash) {
      return 0
    } else {
      return 1
    }
  })
  return generatedNumbers
}

export function generateCells(hash: string, cells: number[], correctCells: number) {
  const seed = String(CryptoJS.SHA256(hash))
  const kenoNumbers = generateNumbers(generateNumbers(cells, hash), seed)
  return kenoNumbers.slice(0, correctCells).map((m) => m.num)
}

export function diceBust(serverSeed: string, clientSeed: string, nonce: number): number {
  const hash = encryptWithNonce(serverSeed, clientSeed, nonce)
  const hashBytes: number[] = []

  for (let i = 0; i < 4; i++) {
    hashBytes.push(parseInt(hash.slice(i * 2, i * 2 + 2), 16))
  }

  const result =
    hashBytes.reduce((acc, curValue, index) => (acc += curValue / Math.pow(256, index + 1)), 0) *
    100.01

  return result
}

const cellsKeno = [
  1, 30, 11, 40, 2, 29, 12, 39, 3, 28, 13, 38, 4, 27, 14, 37, 5, 26, 15, 36, 6, 25, 16, 35, 7, 24,
  17, 34, 8, 23, 18, 33, 9, 22, 19, 32, 10, 21, 20, 31
]

const kenoMultipliers = {
  low: [
    [0.7, 1.85],
    [0, 2, 3.8],
    [0, 1.1, 1.38, 26],
    [0, 0, 2.2, 7.9, 90],
    [0, 0, 1.5, 4.2, 13, 300],
    [0, 0, 1.1, 2, 6.2, 100, 700],
    [0, 0, 1.1, 1.6, 3.5, 15, 225, 700],
    [0, 0, 1.1, 1.5, 2, 5.5, 39, 100, 800],
    [0, 0, 1.1, 1.3, 1.7, 2.5, 7.5, 50, 250, 1000],
    [0, 0, 1.1, 1.2, 1.3, 1.8, 3.5, 13, 50, 250, 1000]
  ],
  classic: [
    [0, 3.96],
    [0, 1.9, 4.5],
    [0, 1, 3.1, 10.4],
    [0, 0.8, 1.8, 5, 22.5],
    [0, 0.25, 1.4, 4.1, 16.5, 36],
    [0, 0, 1, 3.68, 7, 16.5, 40],
    [0, 0, 0.47, 3, 4.5, 14, 31, 60],
    [0, 0, 0, 2.2, 4, 13, 22, 55, 70],
    [0, 0, 0, 1.55, 3, 8, 15, 44, 60, 85],
    [0, 0, 0, 1.4, 2.25, 4.5, 8, 17, 50, 80, 100]
  ],
  medium: [
    [0.4, 2.75],
    [0, 1.8, 5.1],
    [0, 0, 2.8, 50],
    [0, 0, 1.7, 10, 100],
    [0, 0, 1.4, 4, 14, 390],
    [0, 0, 0, 3, 9, 180, 710],
    [0, 0, 0, 2, 7, 30, 400, 800],
    [0, 0, 0, 2, 4, 11, 67, 400, 900],
    [0, 0, 0, 2, 2.5, 5, 15, 100, 500, 1000],
    [0, 0, 0, 1.6, 2, 4, 7, 26, 100, 500, 1000]
  ],
  high: [
    [0, 3.96],
    [0, 0, 17.1],
    [0, 0, 0, 81.5],
    [0, 0, 0, 10, 259],
    [0, 0, 0, 4.5, 48, 450],
    [0, 0, 0, 0, 11, 350, 710],
    [0, 0, 0, 0, 7, 90, 400, 800],
    [0, 0, 0, 0, 5, 20, 270, 600, 900],
    [0, 0, 0, 0, 4, 11, 56, 500, 800, 1000],
    [0, 0, 0, 0, 3.5, 8, 13, 63, 500, 800, 1000]
  ]
}

const kenoProbabilities = [
  [75, 25],
  [55.76923, 38.46154, 5.769231],
  [41.093117, 44.02834, 13.663967, 1.2145749],
  [29.98687, 44.42499, 21.419193, 3.9391618, 0.22978444],
  [21.657185, 41.64843, 27.76562, 7.933034, 0.9574352, 0.03829741],
  [15.469417, 37.126602, 32.12879, 12.692855, 2.3799102, 0.1969581, 0.00547106],
  [10.919588, 31.8488, 34.3967, 17.639334, 4.5731606, 0.5879778, 0.03379183, 0.00064365],
  [
    7.610622, 26.471727, 34.744144, 22.236254, 7.483354, 1.3303741, 0.1187834, 0.00468112,
    0.00005851
  ],
  [
    5.2323027, 21.404875, 33.50328, 26.058107, 10.944406, 2.5256321, 0.31180644, 0.01909019,
    0.00049371, 0.00000366
  ],
  [
    3.5444632, 16.878397, 31.07159, 28.820028, 14.710222, 4.236544, 0.6789334, 0.05747584,
    0.0023093, 0.00003539, 1.2e-9
  ]
]
