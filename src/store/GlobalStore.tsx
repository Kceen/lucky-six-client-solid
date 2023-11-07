import { createRoot, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { GameActions, GameStatus, IGameState, IUser } from '../models'
import { convertMessageRecieve } from '../helpers'
import Swal from 'sweetalert2'

function createGlobalStore() {
  const ws = new WebSocket('ws://localhost:8080')

  const [ticketQRCodeImage, setTicketQRCodeImage] = createSignal('')
  const [newBallTrigger, setNewBallTrigger] = createSignal(false)
  const [timeRemaining, setTimeRemaining] = createSignal(0)
  const [user, setUser] = createSignal<IUser | undefined>(undefined)

  ws.onopen = () => {
    ws.onmessage = ({ data }) => {
      const message = convertMessageRecieve(data)

      if (message.type === GameActions.UPDATE_GAME_STATE) {
        setGameState(message.data)
      }
      if (message.type === GameActions.NEW_BALL) {
        setNewBallTrigger(false)
        setNewBallTrigger(true)
      }
      if (message.type === GameActions.TIME_REMAINING) {
        setTimeRemaining(message.data)
      }
      if (message.type === GameActions.PLAYER_WIN) {
      }
      if (message.type === GameActions.LOGIN_FAIL) {
        Swal.fire({
          titleText: 'Login failed',
          icon: 'error'
        })
      }
      if (message.type === GameActions.LOGIN_SUCCESS) {
        setUser(message.data)
      }
      if (message.type === GameActions.BET_SUCCESS_RESPONSE) {
        Swal.fire({
          confirmButtonColor: 'green',
          html: `
            <div class="flex flex-col items-center">
              <h1 class="text-4xl font-bold mb-3"> Your bet was successful </h1>
              <p class="text-xl"> Scan the QR Code to see your ticket status </p>
              <img src=${message.data}>
            </div>
          `
        })
        setTicketQRCodeImage(message.data)
      }
    }
  }

  console.log('global store')

  const [gameState, setGameState] = createStore<IGameState>({
    activeBalls: [],
    activePlayers: 0,
    round: 0,
    status: GameStatus.WAITING_FOR_NEXT_ROUND,
    pauseTime: 0,
    firstBallColor: '',
    firstBallEven: false,
    firstBallHigherThan24: false
  })

  return {
    gameState,
    setGameState,
    newBallTrigger,
    setNewBallTrigger,
    user,
    ticketQRCodeImage,
    setTicketQRCodeImage,
    timeRemaining,
    ws
  }
}

export default createRoot(createGlobalStore)
