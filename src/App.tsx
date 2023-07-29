import { Component, For, Show, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { convertMessageRecieve } from './helpers'
import { GameActions, GameStatus, IGameState, IPlayer, ITicket } from './models'
import classNames from 'classnames'
import { A } from '@solidjs/router'

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

  const [betForm, setBetForm] = createStore({
    amount: 0,
    rounds: 0
  })

  const submitBet = () => {
    ws.send(
      JSON.stringify({
        type: GameActions.BET,
        data: {
          playerId: playerState().id,
          userBalls: [1, 2, 3, 4, 5, 6],
          betPerRound: betForm.amount,
          numOfRounds: betForm.rounds
        } as ITicket
      })
    )
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
        setTicketQRCodeImage(message.data)
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

      <div class="text-center flex flex-col items-center">
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
      </div>

      <img src={ticketQRCodeImage()} />

      <div class="grid grid-cols-6 max-w-lg">
        <For each={playingBalls()}>
          {(ball) => {
            if (ticket()?.userBalls.includes(ball)) {
              setBallsHitCurrentRound(ballsHitCurrentRound() + 1)
            }
            return (
              <span
                class={classNames({
                  'bg-green-500 text-white': ticket()?.userBalls.includes(ball),
                  'flex justify-center items-center pt-8 pb-8 border border-gray-900 text-xl':
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
