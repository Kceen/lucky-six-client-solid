import { Show, createEffect, createSignal } from 'solid-js'
import { ProgressBar } from '../components/ProgressBar'
import { getBallsEvenToOddRatio, getFirstFiveBallsSum } from '../helpers'
import globalGameState from './../store/GlobalStore'
import { GameStatus } from '../models'

export const Footer = () => {
  const { timeRemaining, gameState } = globalGameState
  const [evenAndOddBalls, setEvenAndOddBalls] = createSignal({ evenBalls: 0, oddBalls: 0 })
  const [firstFiveBallsSum, setFirstFiveBallsSum] = createSignal(0)

  createEffect(() => {
    setEvenAndOddBalls(getBallsEvenToOddRatio(gameState.activeBalls))

    if (gameState.activeBalls.length < 6) {
      setFirstFiveBallsSum(getFirstFiveBallsSum(gameState.activeBalls))
    }
  })

  return (
    <div class="fixed bottom-0 left-0 flex w-full justify-center bg-gray-800 p-6">
      <Show when={gameState.status === GameStatus.WAITING_FOR_NEXT_ROUND}>
        <div class="w-1/2">
          <ProgressBar
            currentValue={(timeRemaining() / gameState.pauseTime) * 100}
            beforeText="Next round in"
            afterText={timeRemaining().toString()}
          />
        </div>
      </Show>

      <Show when={gameState.status === GameStatus.ROUND_IN_PROGRESS}>
        <div class="flex w-full gap-6">
          <div class="w-1/2">
            <ProgressBar
              beforeText="Even"
              currentValue={(evenAndOddBalls().evenBalls / 24) * 100}
              afterText={evenAndOddBalls().evenBalls.toString()}
            />
            <ProgressBar
              beforeText="Odd"
              currentValue={(evenAndOddBalls().oddBalls / 24) * 100}
              afterText={evenAndOddBalls().oddBalls.toString()}
            />
          </div>
          <div class="w-1/2">
            <ProgressBar
              beforeText="First 5 sum"
              currentValue={(firstFiveBallsSum() / 230) * 100}
              afterText={firstFiveBallsSum().toString()}
            />
          </div>
        </div>
      </Show>
    </div>
  )
}
