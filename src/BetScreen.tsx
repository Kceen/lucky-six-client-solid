import { For, createSignal } from 'solid-js'
import { getAllBallsArray } from './helpers'
import globalGameState from './store/GlobalStore'
import { GameActions, ITicketRequest } from './models'

export const BetScreen = () => {
  const { ws, user } = globalGameState

  const [selectedBalls, setSelectedBalls] = createSignal<number[]>([])
  const [betFormData, setBetFormData] = createSignal({ numberOfRounds: 0, betPerRound: 0 })

  const handleOnBallClick = (ball: number) => {
    if (selectedBalls().length === 6 && !selectedBalls().includes(ball)) {
      return
    }
    const selectedBallsTemp = [...selectedBalls()]

    if (selectedBallsTemp.includes(ball)) {
      const ballToRemoveIndex = selectedBallsTemp.indexOf(ball)
      selectedBallsTemp.splice(ballToRemoveIndex, 1)
    } else {
      selectedBallsTemp.push(ball)
    }

    selectedBallsTemp.sort((ball1, ball2) => {
      return ball1 - ball2
    })

    setSelectedBalls(selectedBallsTemp)
  }

  const selectRandomSixBalls = () => {
    const selectedBallsTemp: number[] = []

    let randomBall = null
    while (selectedBallsTemp.length !== 6) {
      randomBall = Math.floor(Math.random() * (48 - 1 + 1) + 1)
      if (!selectedBallsTemp.includes(randomBall)) {
        selectedBallsTemp.push(randomBall)
      }
    }

    selectedBallsTemp.sort((ball1, ball2) => {
      return ball1 - ball2
    })

    setSelectedBalls(selectedBallsTemp)
  }

  const submitBet = () => {
    ws.send(
      JSON.stringify({
        type: GameActions.BET,
        data: {
          userId: user()?.id,
          userBalls: selectedBalls(),
          betPerRound: betFormData().betPerRound,
          numOfRounds: betFormData().numberOfRounds
        } as ITicketRequest
      })
    )
  }

  return (
    <div class="flex gap-12 p-12">
      <div style={{ width: '60%' }} class="grid grid-cols-8 grid-rows-6 gap-4">
        <For each={getAllBallsArray()}>
          {(ball) => {
            return (
              <div
                style={
                  selectedBalls().includes(ball)
                    ? { border: '5px solid white', 'box-shadow': '0px 0px 10px 3px white' }
                    : { border: '5px solid transparent', filter: selectedBalls().length === 6 ? 'brightness(0.5)' : '' }
                }
                class={`h-min cursor-pointer rounded-full`}
                onclick={() => handleOnBallClick(ball)}
              >
                <img src={`/src/assets/balls/${ball}.svg`} />
              </div>
            )
          }}
        </For>
      </div>
      <div class="flex flex-col items-center gap-4" style={{ width: '40%' }}>
        <p class="text-center text-2xl"> Bet </p>

        <button class=" border border-white p-2" onclick={selectRandomSixBalls}>
          Random 6 balls
        </button>

        <div class="text-black">
          <p> Number of rounds </p>
          <input
            type="number"
            value={betFormData().numberOfRounds}
            oninput={(e) => {
              setBetFormData({ ...betFormData(), numberOfRounds: Number(e.target.value) })
            }}
          />
          <p> Bet per round </p>
          <input
            type="number"
            value={betFormData().betPerRound}
            oninput={(e) => {
              setBetFormData({ ...betFormData(), betPerRound: Number(e.target.value) })
            }}
          />
        </div>

        <p class="text-center text-2xl"> Selected balls </p>

        <div class="grid grid-cols-6 gap-2">
          <For each={selectedBalls()}>{(ball) => <img class="w-full" src={`/src/assets/balls/${ball}.svg`} />}</For>
        </div>

        <button onclick={submitBet} class="border-4 border-white bg-green-500 px-6 py-4 text-2xl font-bold">
          {' '}
          BET{' '}
        </button>
      </div>
    </div>
  )
}
