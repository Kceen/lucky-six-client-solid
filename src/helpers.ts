import { JSX } from 'solid-js'
import { IMessage } from './models'

export const stakes: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 10000,
  7: 7500,
  8: 5000,
  9: 2500,
  10: 1000,
  11: 500,
  12: 300,
  13: 200,
  14: 150,
  15: 100,
  16: 90,
  17: 80,
  18: 70,
  19: 60,
  20: 50,
  21: 40,
  22: 30,
  23: 25,
  24: 20,
  25: 15,
  26: 10,
  27: 9,
  28: 8,
  29: 7,
  30: 6,
  31: 5,
  32: 4,
  33: 3,
  34: 2,
  35: 1
}

export const getAllBallsArray = (): number[] => {
  const allBallsArray: number[] = []
  for (let i = 0; i < 48; i++) {
    allBallsArray.push(i + 1)
  }

  return allBallsArray
}

export const getGridIndexesArray = (): number[] => {
  const gridIndexesArray: number[] = []
  for (let i = 5; i < 35; i++) {
    gridIndexesArray.push(i)
  }

  return gridIndexesArray
}

export const getBallsEvenToOddRatio = (balls: number[]): { evenBalls: number; oddBalls: number } => {
  let evenBalls = 0
  let oddBalls = 0

  for (const ball of balls) {
    if (ball % 2 === 0) {
      evenBalls++
    } else {
      oddBalls++
    }
  }

  return { evenBalls, oddBalls }
}

export const getFirstFiveBallsSum = (balls: number[]) => {
  let sum = 0

  for (let i = 0; i < balls.length; i++) {
    if (i < 5) {
      sum += balls[i]
    } else {
      break
    }
  }

  return sum
}

export const ballPositionInGrid = (ballIndex: number): JSX.CSSProperties => {
  if (ballIndex === 5) {
    return { 'grid-area': '1 / 1' }
  }
  if (ballIndex === 6) {
    return { 'grid-area': '2 / 1' }
  }
  if (ballIndex === 7) {
    return { 'grid-area': '3 / 1' }
  }
  if (ballIndex === 8) {
    return { 'grid-area': '4 / 1' }
  }
  if (ballIndex === 9) {
    return { 'grid-area': '5 / 1' }
  }
  if (ballIndex === 10) {
    return { 'grid-area': '6 / 1' }
  }
  if (ballIndex === 11) {
    return { 'grid-area': '7 / 1' }
  }
  if (ballIndex === 12) {
    return { 'grid-area': '8 / 1' }
  }
  if (ballIndex === 13) {
    return { 'grid-area': '9 / 1' }
  }
  if (ballIndex === 14) {
    return { 'grid-area': '7 / 2' }
  }
  if (ballIndex === 15) {
    return { 'grid-area': '8 / 2' }
  }
  if (ballIndex === 16) {
    return { 'grid-area': '9 / 2' }
  }
  if (ballIndex === 17) {
    return { 'grid-area': '7 / 3' }
  }
  if (ballIndex === 18) {
    return { 'grid-area': '8 / 3' }
  }
  if (ballIndex === 19) {
    return { 'grid-area': '9 / 3' }
  }
  if (ballIndex === 20) {
    return { 'grid-area': '7 / 4' }
  }
  if (ballIndex === 21) {
    return { 'grid-area': '8 / 4' }
  }
  if (ballIndex === 22) {
    return { 'grid-area': '9 / 4' }
  }
  if (ballIndex === 23) {
    return { 'grid-area': '7 / 5' }
  }
  if (ballIndex === 24) {
    return { 'grid-area': '8 / 5' }
  }
  if (ballIndex === 25) {
    return { 'grid-area': '9 / 5' }
  }
  if (ballIndex === 26) {
    return { 'grid-area': '1 / 6' }
  }
  if (ballIndex === 27) {
    return { 'grid-area': '2 / 6' }
  }
  if (ballIndex === 28) {
    return { 'grid-area': '3 / 6' }
  }
  if (ballIndex === 29) {
    return { 'grid-area': '4 / 6' }
  }
  if (ballIndex === 30) {
    return { 'grid-area': '5 / 6' }
  }
  if (ballIndex === 31) {
    return { 'grid-area': '6 / 6' }
  }
  if (ballIndex === 32) {
    return { 'grid-area': '7 / 6' }
  }
  if (ballIndex === 33) {
    return { 'grid-area': '8 / 6' }
  }
  if (ballIndex === 34) {
    return { 'grid-area': '9 / 6' }
  }

  return {}
}

export const getColorOfBall = (ball: number): string => {
  if ([1, 9, 17, 25, 33, 41].includes(ball)) {
    return 'red'
  }
  if ([2, 10, 18, 26, 34, 42].includes(ball)) {
    return 'green'
  }
  if ([3, 11, 19, 27, 35, 43].includes(ball)) {
    return 'blue'
  }
  if ([4, 12, 20, 28, 36, 44].includes(ball)) {
    return 'purple'
  }
  if ([5, 13, 21, 29, 37, 45].includes(ball)) {
    return 'brown'
  }
  if ([6, 14, 22, 30, 38, 46].includes(ball)) {
    return 'yellow'
  }
  if ([7, 15, 23, 31, 39, 47].includes(ball)) {
    return 'orange'
  }
  if ([8, 16, 24, 32, 40, 48].includes(ball)) {
    return 'black'
  }

  return ''
}

export const convertColorToTailwind = (color: string) => {
  if (color === 'red') {
    return 'shadow-red-500'
  }
  if (color === 'green') {
    return 'shadow-green-500'
  }
  if (color === 'blue') {
    return 'shadow-blue-500'
  }
  if (color === 'purple') {
    return 'shadow-purple-500'
  }
  if (color === 'brown') {
    return 'shadow-amber-500'
  }
  if (color === 'yellow') {
    return 'shadow-yellow-500'
  }
  if (color === 'orange') {
    return 'shadow-orange-500'
  }
  if (color === 'black') {
    return 'shadow-gray-500'
  }
}

export function convertMessageSend(data: IMessage): string {
  return JSON.stringify(data)
}

export function convertMessageRecieve(data: any): IMessage {
  return JSON.parse(data.toString())
}
