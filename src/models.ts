export interface IPlayer {
  id: string
  name: string
  money: number
}

export interface ITicket {
  playerId: string
  betPerRound: number
  userBalls: number[]
  numOfRounds: number
}

export interface ITicketStatus {
  ticketId: string
  betPerRound: number
  rounds: ITicketRound[]
  userBalls: number[]
  startingRound: number
  numOfRounds: number
  timestamp: Date
  active: boolean
}

export interface ITicketRound {
  number: number
  balls: number[]
  status: 'WIN' | 'LOSE'
  amountWon: number
}

export interface IMessage {
  type: GameActions
  data?: any
}

export interface IGameState {
  round: number
  activePlayers: number
  status: GameStatus
  activeBalls: number[]
  timeRemaining: number
}

export enum GameActions {
  PLAYER_JOINED = 'PLAYER_JOINED',
  NEW_BALL = 'NEW_BALL',
  NEW_DRUM_BALL = 'NEW_DRUM_BALL',
  ROUND_START = 'ROUND_START',
  ROUND_END = 'ROUND_END',
  UPDATE_GAME_STATE = 'UPDATE_GAME_STATE',
  PLAYER_WIN = 'PLAYER_WIN',
  BET = 'BET',
  BET_SUCCESS_RESPONSE = 'BET_SUCCESS_RESPONSE',
  UPDATE_BALLS = 'UPDATE_BALLS',
  TIME_REMAINING = 'TIME_REMAINING'
}

export enum GameStatus {
  ROUND_IN_PROGRESS = 'ROUND_IN_PROGRESS',
  WAITING_FOR_NEXT_ROUND = 'WAITING_FOR_NEXT_ROUND'
}
