import { Component, For, Show, createSignal } from 'solid-js'
import { convertMessageRecieve } from './helpers'
import { GameActions, GameStatus, IGameState, IPlayer, ITicket } from './models'
import classNames from 'classnames'

const App: Component = () => {
  const ws = new WebSocket('ws://localhost:8080')
  const [playingBalls, setPlayingBalls] = createSignal([] as number[])
  const [gameState, setGameState] = createSignal<IGameState | undefined>(
    undefined
  )
  const [playerState, setPlayerState] = createSignal<IPlayer>({
    id: '1',
    name: 'Nikola',
    money: 500,
  })
  const [ballsHitCurrentRound, setBallsHitCurrentRound] = createSignal(0)
  const [ticket, setTicket] = createSignal<ITicket | undefined>({
    playerId: playerState().id,
    userBalls: [1, 2, 3, 4, 5, 6],
    betPerRound: 30,
    numOfRounds: 5,
  })
  const [history, setHistory] = createSignal<string[]>([])

  ws.onopen = () => {
    ws.onmessage = ({ data }) => {
      const message = convertMessageRecieve(data)

      if (message.type === GameActions.ROUND_START) {
        if (ticket()) {
          setPlayerState({
            ...playerState(),
            money: playerState().money - ticket()!.betPerRound,
          })
          setBallsHitCurrentRound(0)
          setPlayingBalls([])
          setGameState(message.data)
          setHistory([...history(), 'you lost ' + ticket()!.betPerRound])
        }
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
          money: (playerState().money += message.data),
        })
        setHistory([...history(), 'you won ' + message.data])
      }
    }

    ws.send(
      JSON.stringify({
        type: GameActions.PLAYER_JOINED,
        data: playerState(),
      })
    )

    ws.send(
      JSON.stringify({
        type: GameActions.BET,
        data: ticket(),
      })
    )
  }

  return (
    <div>
      <h1> HOME </h1>
      <div class='flex justify-between text-xl font-bold'>
        <span> ROUND - {gameState()?.round} </span>
        <span> MONEY - {playerState()?.money} </span>
        <span> PLAYERS - {gameState()?.activePlayers} </span>
      </div>
      <div>
        <span> BALLS HIT - {ballsHitCurrentRound()} </span>
      </div>
      <div>
        <For each={history()}>{(elem) => <p> {elem} </p>}</For>
      </div>
      <Show when={gameState()?.status === GameStatus.WAITING_FOR_NEXT_ROUND}>
        <h1> WAITING FOR NEXT ROUND </h1>
      </Show>
      <div class='grid grid-cols-6'>
        <For each={playingBalls()}>
          {(ball) => {
            if (ticket()?.userBalls.includes(ball)) {
              setBallsHitCurrentRound(ballsHitCurrentRound() + 1)
            }
            return (
              <span
                class={classNames({
                  'bg-green-500 text-white': ticket()?.userBalls.includes(ball),
                  'flex justify-center items-center p-3 border border-gray-900 aspect-square text-5xl':
                    true,
                })}
              >
                {ball}
              </span>
            )
          }}
        </For>
      </div>
    </div>
  )
}

export default App
