import { Component, For, Show, createEffect, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { convertMessageRecieve } from './helpers'
import { GameActions, GameStatus, IGameState, IPlayer, ITicket } from './models'
import Swal from 'sweetalert2'

const App: Component = () => {
  const ws = new WebSocket('ws://localhost:8080')
  const [gameState, setGameState] = createStore<IGameState>({
    activeBalls: [],
    activePlayers: 0,
    round: 0,
    status: GameStatus.WAITING_FOR_NEXT_ROUND,
    timeRemaining: 0
  })
  const [ticketQRCodeImage, setTicketQRCodeImage] = createSignal('')

  let backdropElement = document.createElement('div')

  createEffect(() => {
    console.log('effect')

    if (gameState.status === GameStatus.WAITING_FOR_NEXT_ROUND) {
      backdropElement.style.backdropFilter = 'blur(15px)'
      backdropElement.style.background = 'rgba(0,0,0,.4)'
      backdropElement.style.position = 'fixed'
      backdropElement.style.zIndex = '1060'
      backdropElement.style.inset = '0'
      backdropElement.style.height = '100%'

      backdropElement.textContent = gameState.timeRemaining.toString() || ''

      backdropElement.id = 'pause-backdrop'
      document.body.appendChild(backdropElement)
    } else {
      if (document.getElementById('pause-backdrop')) {
        backdropElement.remove()
      }
    }
  })

  const submitBet = (betPerRound: number, numOfRounds: number) => {
    ws.send(
      JSON.stringify({
        type: GameActions.BET,
        data: {
          playerId: '1',
          userBalls: [1, 2, 3, 4, 5, 6],
          betPerRound,
          numOfRounds
        } as ITicket
      })
    )
  }

  const openBetModal = () => {
    Swal.fire({
      title: 'Bet',
      html: `
        <div class="flex items-center flex-col">
          <p class="mb-3"> Bet amount per round </p>
          <input type="number" id="bet-form-bet-per-round" class="text-xl text-center p-3 mb-3 border border-black"/>
          <p class="mb-3"> Number of rounds </p>
          <input type="number" id="bet-form-number-of-rounds" class="text-xl text-center p-3 mb-8 border border-black"/>
        </div>
        `,

      confirmButtonColor: 'green',
      confirmButtonText: 'Bet',
      preConfirm: () => {
        const betPerRound = Number(
          (
            document.getElementById(
              'bet-form-bet-per-round'
            ) as HTMLInputElement
          ).value
        )
        const numOfRounds = Number(
          (
            document.getElementById(
              'bet-form-number-of-rounds'
            ) as HTMLInputElement
          ).value
        )

        submitBet(betPerRound, numOfRounds)
      }
    })
  }

  ws.onopen = () => {
    ws.onmessage = ({ data }) => {
      const message = convertMessageRecieve(data)

      if (message.type === GameActions.UPDATE_GAME_STATE) {
        setGameState(message.data)
      }
      if (message.type === GameActions.PLAYER_WIN) {
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

    ws.send(
      JSON.stringify({
        type: GameActions.PLAYER_JOINED,
        data: {
          id: '1',
          name: 'Nikola',
          money: 500
        }
      })
    )
  }

  console.log(gameState)

  return (
    <div class="relative">
      <div class="absolute right-5 top-5 text-3xl font-bold">
        round {gameState.round}
      </div>

      <div class="mx-auto my-0 grid w-1/2 grid-cols-5">
        <For each={gameState.activeBalls}>
          {(ball, index) => {
            if (index() < 5) {
              return <img src={`/src/assets/balls/${ball}.svg`} />
            }
          }}
        </For>
      </div>

      <Show when={gameState.status === GameStatus.WAITING_FOR_NEXT_ROUND}>
        <div> {gameState.timeRemaining} </div>
      </Show>

      <button
        class="fixed bottom-5 right-5 rounded-md bg-green-500 p-6 text-3xl font-bold text-white transition-colors duration-200 hover:bg-green-600"
        onclick={openBetModal}
      >
        BET
      </button>

      <img src={ticketQRCodeImage()} />

      <div class=" grid h-full max-w-2xl grid-flow-col grid-cols-5 grid-rows-6">
        <For each={gameState.activeBalls}>
          {(ball, index) => {
            if (index() > 4) {
              return (
                <img
                  src={`/src/assets/balls/${ball}.svg`}
                  class="flex h-fit items-center justify-center"
                />
              )
            }
          }}
        </For>
      </div>
    </div>
  )
}

export default App
