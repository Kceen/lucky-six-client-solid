import { Component, For, Show, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { ballPositionInGrid, convertMessageRecieve, stakes } from './helpers'
import { GameActions, GameStatus, IGameState, IPlayer, ITicket } from './models'
import Swal from 'sweetalert2'
import { Transition } from 'solid-transition-group'
import { Portal } from 'solid-js/web'
import { RoundEndScreen } from './RoundEndScreen'

const App: Component = () => {
  const ws = new WebSocket('ws://localhost:8080')
  const [gameState, setGameState] = createStore<IGameState>({
    activeBalls: [],
    activePlayers: 0,
    round: 0,
    status: GameStatus.WAITING_FOR_NEXT_ROUND,
    timeRemaining: 0,
    firstBallColor: '',
    firstBallEven: false,
    firstBallHigherThan24: false
  })
  const [ticketQRCodeImage, setTicketQRCodeImage] = createSignal('')
  const [newBallTrigger, setNewBallTrigger] = createSignal(false)

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
      if (message.type === GameActions.NEW_BALL) {
        setNewBallTrigger(false)
        setNewBallTrigger(true)
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
    <>
      <Show when={gameState.status === GameStatus.ROUND_IN_PROGRESS}>
        <div class="relative">
          <div class="absolute right-5 top-5 text-3xl font-bold">
            round {gameState.round}
          </div>

          <div class="mx-auto my-0 mt-4 grid w-1/2 grid-cols-5 gap-4">
            <For each={gameState.activeBalls}>
              {(ball, index) => {
                if (index() < 5) {
                  return (
                    <div class="flex justify-center">
                      <img class="w-24" src={`/src/assets/balls/${ball}.svg`} />
                    </div>
                  )
                }
              }}
            </For>
          </div>

          <button
            class="fixed bottom-5 right-5 rounded-md bg-green-500 p-6 text-3xl font-bold text-white transition-colors duration-200 hover:bg-green-600"
            onclick={openBetModal}
          >
            BET
          </button>

          <img src={ticketQRCodeImage()} />

          <div class="flex">
            <div
              style={{ height: 'calc(100vh - 208px)' }}
              class=" grid w-3/4 grid-flow-col grid-cols-6 grid-rows-9 gap-4 p-6"
            >
              <For each={gameState.activeBalls}>
                {(ball, index) => {
                  if (index() > 4) {
                    return (
                      <Transition
                        appear={true}
                        onEnter={(el, done) => {
                          const a = el.animate(
                            [
                              { opacity: 0, transform: 'scale(0)' },
                              { opacity: 1, transform: 'scale(1)' }
                            ],
                            {
                              duration: 600
                            }
                          )
                          a.finished.then(done)
                        }}
                        onExit={(el, done) => {
                          const a = el.animate(
                            [{ opacity: 1 }, { opacity: 0 }],
                            {
                              duration: 600
                            }
                          )
                          a.finished.then(done)
                        }}
                      >
                        <div
                          style={ballPositionInGrid(index())}
                          class="flex w-full items-center justify-center gap-4"
                        >
                          <img
                            class="h-full rounded-full shadow-md"
                            src={`/src/assets/balls/${ball}.svg`}
                          />
                          <span> {stakes[index() + 1]} </span>
                        </div>
                      </Transition>
                    )
                  }
                }}
              </For>
            </div>
            <div class="flex w-1/4 flex-col items-center">
              <p>First ball high or low (-24.5+)</p>
              <p>{gameState.firstBallHigherThan24 ? 'HIGH' : 'LOW'}</p>
              <p>First ball color</p>
              <p class="font-bold" style={{ color: gameState.firstBallColor }}>
                {gameState.firstBallColor.toUpperCase()}
              </p>
              <p>First ball even or odd </p>
              <p>{gameState.firstBallEven ? 'EVEN' : 'ODD'}</p>
            </div>
          </div>
        </div>
        <Portal>
          <div class="fixed left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2">
            <Transition
              appear={true}
              onEnter={(el, done) => {
                const a = el.animate(
                  [
                    { opacity: 0, transform: 'scale(0)' },
                    { opacity: 1, transform: 'scale(1)' }
                  ],
                  {
                    duration: 1000
                  }
                )
                a.finished.then(done)
              }}
              onExit={(el, done) => {
                const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
                  duration: 0
                })
                a.finished.then(done)
              }}
            >
              <Show when={newBallTrigger() && gameState.activeBalls.length > 0}>
                <img
                  src={`/src/assets/balls/${
                    gameState.activeBalls[gameState.activeBalls.length - 1]
                  }.svg`}
                />
              </Show>
            </Transition>
          </div>
        </Portal>
      </Show>

      <Show when={gameState.status === GameStatus.WAITING_FOR_NEXT_ROUND}>
        <RoundEndScreen gameState={gameState} />
      </Show>
    </>
  )
}

export default App
