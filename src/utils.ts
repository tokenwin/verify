import CryptoJS from "crypto-js";
import Decimal from "decimal.js";

interface RandomState {
  clientSeed: string;
  clientNonce: number;
  serverSeed: string;
}

export function generateBust(seed: string, salt?: string): number {
  const nBits = 52;

  if (salt) {
    const hmac = CryptoJS.HmacSHA256(CryptoJS.enc.Hex.parse(seed), salt);
    seed = hmac.toString(CryptoJS.enc.Hex);
  }
  const r = parseInt(seed.slice(0, nBits / 4), 16);
  let X = r / Math.pow(2, nBits);
  X = parseFloat(X.toPrecision(9));
  X = 99 / (1 - X);
  return Math.max(1, Math.floor(X) / 100);
}

export function calculateLimboResult(randomState: RandomState): number {
  const bytes = generateBytes(1, randomState);
  const outcome = bytesToGameEvents(bytes[0], 0xffffffff);

  return new Decimal(0xffffffff)
    .div(outcome)
    .mul(0.99)
    .toDecimalPlaces(2, Decimal.ROUND_DOWN)
    .toNumber();
}

export function encryptWithNonce(
  serverSeed: string,
  clientSeed: string,
  nonce: number
): string {
  const result = CryptoJS.HmacSHA256(
    clientSeed + ":" + nonce,
    serverSeed
  ).toString();
  return result;
}

export function calculateGameResult(randomState: RandomState): number {
  const bytes = generateBytes(1, randomState);
  const outcome = bytesToGameEvents(bytes[0], 100 + (1 - 0.99));
  return new Decimal(outcome).toDecimalPlaces(2, Decimal.ROUND_DOWN).toNumber();
}

export function generateBytes(
  count: number,
  randomState: RandomState,
  cursor?: number
) {
  const BYTES_PER_VALUE = 4;

  const hmac = CryptoJS.HmacSHA256(
    `${randomState.clientSeed}:${randomState.clientNonce}${
      cursor ? `:${cursor}` : ""
    }`,
    randomState.serverSeed
  ).toString(CryptoJS.enc.Hex);

  const valueBytes = [];
  for (let i = 0; i < count; i++) {
    const bytes = [];
    for (let j = 0; j < BYTES_PER_VALUE; j++) {
      bytes.push(
        hmac.slice(
          i * BYTES_PER_VALUE * 2 + j * 2,
          i * BYTES_PER_VALUE * 2 + (j + 1) * 2
        )
      );
    }

    valueBytes.push(bytes);
  }
  return valueBytes.map((bytes) => bytes.map((byte) => parseInt(byte, 16)));
}

export function bytesToGameEvents(bytes: Array<number>, outcomeCount: number) {
  const float = bytes.reduce(
    (result, byte, index) => result + byte / Math.pow(256, index + 1),
    0
  );
  return float * outcomeCount;
}

export function calculateMinesResult(
  randomState: RandomState,
  count: number
): number[] {
  const outcomes: number[] = [];

  for (let i = 0; i < Math.ceil(count / 8); i++) {
    const byteValues = generateBytes(8, randomState, i);

    outcomes.push(
      ...byteValues.map((bytes, index) =>
        bytesToGameEvents(bytes, 25 - index - i * 8)
      )
    );
  }
  const numbers = new Array(25).fill(0).map((_, i) => i);

  const result = [];
  for (let i = 0; i < count; i++) {
    const outcome = outcomes[i];
    result.push(numbers.splice(outcome, 1)[0]);
  }
  return result;
}

export function calculateKenoResult(randomState: RandomState): number[] {
  const byteValues: number[][] = ([] as number[][])
    .concat(generateBytes(6, randomState, 0))
    .concat(generateBytes(4, randomState, 1));

  const outcomes = byteValues.map((bytes, index) =>
    bytesToGameEvents(bytes, 40 - index)
  );
  const numbers = new Array(40).fill(0).map((_, i) => i);

  const result = [];
  for (const outcome of outcomes) {
    result.push(numbers.splice(outcome, 1)[0]);
  }
  return result;
}

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
    [0, 0, 1.1, 1.2, 1.3, 1.8, 3.5, 13, 50, 250, 1000],
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
    [0, 0, 0, 1.4, 2.25, 4.5, 8, 17, 50, 80, 100],
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
    [0, 0, 0, 1.6, 2, 4, 7, 26, 100, 500, 1000],
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
    [0, 0, 0, 0, 3.5, 8, 13, 63, 500, 800, 1000],
  ],
};

const kenoProbabilities = [
  [75, 25],
  [55.76923, 38.46154, 5.769231],
  [41.093117, 44.02834, 13.663967, 1.2145749],
  [29.98687, 44.42499, 21.419193, 3.9391618, 0.22978444],
  [21.657185, 41.64843, 27.76562, 7.933034, 0.9574352, 0.03829741],
  [15.469417, 37.126602, 32.12879, 12.692855, 2.3799102, 0.1969581, 0.00547106],
  [
    10.919588, 31.8488, 34.3967, 17.639334, 4.5731606, 0.5879778, 0.03379183,
    0.00064365,
  ],
  [
    7.610622, 26.471727, 34.744144, 22.236254, 7.483354, 1.3303741, 0.1187834,
    0.00468112, 0.00005851,
  ],
  [
    5.2323027, 21.404875, 33.50328, 26.058107, 10.944406, 2.5256321, 0.31180644,
    0.01909019, 0.00049371, 0.00000366,
  ],
  [
    3.5444632, 16.878397, 31.07159, 28.820028, 14.710222, 4.236544, 0.6789334,
    0.05747584, 0.0023093, 0.00003539, 1.2e-9,
  ],
];
