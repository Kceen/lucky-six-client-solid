import { For } from 'solid-js'
import { convertColorToTailwind, getAllBallsArray, getColorOfBall, stakes } from './helpers'
import globalGameState from './store/GlobalStore'

export const RoundEndScreen = () => {
  const { gameState } = globalGameState

  return (
    <div class="flex">
      <div style={{ height: 'calc(100vh - 196px)', width: '60%' }} class="grid grid-cols-8 grid-rows-6 gap-12 p-12">
        <For each={getAllBallsArray()}>
          {(ball) => {
            const shadowColorString = convertColorToTailwind(getColorOfBall(ball))

            return (
              <div
                class={`h-min rounded-full ${
                  gameState.activeBalls.includes(ball)
                    ? `shadow-rounded ${shadowColorString} brightness-110`
                    : 'brightness-40'
                }`}
              >
                <img src={`/src/assets/balls/${ball}.svg`} />
              </div>
            )
          }}
        </For>
      </div>
      <div style={{ width: '40%' }} class="flex flex-col justify-around gap-2 p-12">
        <div>
          <p>First ball high or low (-24.5+)</p>
          <p class="text-2xl font-bold">{gameState.firstBallHigherThan24 ? 'HIGH' : 'LOW'}</p>
        </div>

        <div>
          <p>First ball color</p>
          <p class="text-2xl font-bold" style={{ color: gameState.firstBallColor }}>
            {gameState.firstBallColor.toUpperCase()}
          </p>
        </div>

        <div>
          <p>First ball even or odd </p>
          <p class="text-2xl font-bold">{gameState.firstBallEven ? 'EVEN' : 'ODD'}</p>
        </div>

        <div>
          <p>First 5 balls</p>
          <div class="flex gap-4">
            <For each={gameState.activeBalls}>
              {(ball, index) => {
                if (index() < 5) {
                  return <img class="w-14" src={`/src/assets/balls/${ball}.svg`} />
                }
              }}
            </For>
          </div>
        </div>
      </div>
    </div>
  )
}
