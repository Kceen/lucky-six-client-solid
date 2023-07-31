import { Component, For, Show, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { convertMessageRecieve } from './helpers'
import { GameActions, GameStatus, IGameState, IPlayer, ITicket } from './models'
import classNames from 'classnames'
import { A } from '@solidjs/router'
import Swal from 'sweetalert2'

const App: Component = () => {
  const ws = new WebSocket('ws://localhost:8080')
  const [playingBalls, setPlayingBalls] = createSignal([] as number[])
  const [gameState, setGameState] = createSignal<IGameState | undefined>(
    undefined
  )
  const [playerState, setPlayerState] = createSignal<IPlayer>({
    id: '1',
    name: 'Nikola',
    money: 500
  })
  const [ballsHitCurrentRound, setBallsHitCurrentRound] = createSignal(0)
  const [ticket, setTicket] = createSignal<ITicket | undefined>({
    playerId: playerState().id,
    userBalls: [1, 2, 3, 4, 5, 6],
    betPerRound: 30,
    numOfRounds: 5
  })
  const [history, setHistory] = createSignal<string[]>([])
  const [ticketQRCodeImage, setTicketQRCodeImage] = createSignal('')
  const [timeRemaining, setTimeRemaining] = createSignal(0)

  const [betForm, setBetForm] = createStore({
    amount: 0,
    rounds: 0
  })

  const submitBet = (betPerRound: number, numOfRounds: number) => {
    ws.send(
      JSON.stringify({
        type: GameActions.BET,
        data: {
          playerId: playerState().id,
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

      if (message.type === GameActions.ROUND_START) {
        // if (ticket()) {
        //   setPlayerState({
        //     ...playerState(),
        //     money: playerState().money - ticket()!.betPerRound
        //   })
        setBallsHitCurrentRound(0)
        setPlayingBalls([])
        //   setGameState(message.data)
        //   setHistory([...history(), 'you lost ' + ticket()!.betPerRound])
        // }
      }
      if (message.type === GameActions.ROUND_END) {
      }
      if (message.type === GameActions.UPDATE_GAME_STATE) {
        setGameState(message.data)
      }
      if (message.type === GameActions.NEW_BALL) {
        setPlayingBalls([...playingBalls(), message.data])
      }
      if (message.type === GameActions.PLAYER_WIN) {
        setPlayerState({
          ...playerState(),
          money: (playerState().money += message.data)
        })
        setHistory([...history(), 'you won ' + message.data])
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
      if (message.type === GameActions.UPDATE_BALLS) {
        setPlayingBalls(message.data)
      }
      if (message.type === GameActions.TIME_REMAINING) {
        setTimeRemaining(message.data)
      }
    }

    ws.send(
      JSON.stringify({
        type: GameActions.PLAYER_JOINED,
        data: playerState()
      })
    )
  }

  console.log(ticket())
  console.log(gameState())
  console.log(playerState())

  return (
    <div>
      <A href="/ticket-check" class="pb-5">
        link for ticket checking
      </A>

      <div> {JSON.stringify(gameState())} </div>
      <div> {JSON.stringify(ticket())} </div>
      <div> {JSON.stringify(playerState())} </div>

      <Show when={gameState()?.status === GameStatus.WAITING_FOR_NEXT_ROUND}>
        <div> {timeRemaining()} </div>
      </Show>

      <button onclick={openBetModal}> BET </button>

      {/* <div class="text-center flex flex-col items-center">
        <p class="text-4xl"> BET </p>
        <p> amount </p>
        <input
          oninput={(e) => {
            setBetForm({ amount: Number(e.target.value) })
          }}
          class="border border-black w-72 p-3"
          type="number"
        />
        <p> rounds </p>
        <input
          oninput={(e) => {
            setBetForm({ rounds: Number(e.target.value) })
          }}
          class="border border-black w-72 p-3"
          type="number"
        />
        <button
          class="block border border-black text-3xl p-4 my-6"
          onclick={submitBet}
        >
          submit bet
        </button>
      </div> */}

      <img src={ticketQRCodeImage()} />

      <div class=" grid max-w-2xl grid-cols-7">
        <For each={playingBalls()}>
          {(ball) => {
            if (ticket()?.userBalls.includes(ball)) {
              setBallsHitCurrentRound(ballsHitCurrentRound() + 1)
            }
            return (
              <span
                class={classNames({
                  'bg-green-500 text-white': ticket()?.userBalls.includes(ball),
                  ' flex items-center justify-center border border-gray-900 pb-8 pt-8 text-xl':
                    true
                })}
              >
                {ball}
              </span>
            )
          }}
        </For>
      </div>
      <div>
        <For each={history()}>{(elem) => <p> {elem} </p>}</For>
      </div>
    </div>
  )
}

export default App
