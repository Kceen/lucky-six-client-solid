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

export function convertMessageSend(data: IMessage): string {
  return JSON.stringify(data)
}

export function convertMessageRecieve(data: any): IMessage {
  return JSON.parse(data.toString())
}
