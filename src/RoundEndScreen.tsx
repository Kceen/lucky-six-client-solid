import { For } from 'solid-js'
import { getAllBallsArray, stakes } from './helpers'
import { IGameState } from './models'

interface RoundEndScreenProps {
  gameState: IGameState
}

export const RoundEndScreen = (props: RoundEndScreenProps) => {
  return (
    <>
      <div class="m-10 text-3xl">
        Next round in - {props.gameState.timeRemaining}
      </div>

      <div class="grid w-1/2 grid-cols-8 grid-rows-6 gap-6">
        <For each={getAllBallsArray()}>
          {(ball) => {
            return (
              <div
                class={`rounded-full p-2 ${
                  props.gameState.activeBalls.includes(ball)
                    ? 'bg-green-500'
                    : 'bg-red-500 brightness-50'
                }`}
              >
                <img src={`/src/assets/balls/${ball}.svg`} />
              </div>
            )
          }}
        </For>
      </div>
    </>
  )
}
