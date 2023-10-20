import globalGameState from './store/GlobalStore'

export const TimeLeftProgressBar = () => {
  const { gameState } = globalGameState

  return (
    <div class="flex w-1/2 items-center gap-4">
      <div>
        <p> Next round begins in </p>
      </div>
      <div class="relative h-5 w-full bg-gray-400">
        <div
          class="absolute h-5 bg-green-500 transition-all duration-1000 ease-linear"
          style={{ width: (gameState.timeRemaining / gameState.pauseTime) * 100 + '%' }}
        ></div>
      </div>
      <div>
        <p> {gameState.timeRemaining} </p>
      </div>
    </div>
  )
}
