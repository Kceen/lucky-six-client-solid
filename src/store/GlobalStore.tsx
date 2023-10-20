import { createRoot } from 'solid-js'
import { createStore } from 'solid-js/store'
import { GameStatus, IGameState } from '../models'

function createGlobalStore() {
  const [gameState, setGameState] = createStore<IGameState>({
    activeBalls: [],
    activePlayers: 0,
    round: 0,
    status: GameStatus.WAITING_FOR_NEXT_ROUND,
    pauseTime: 0,
    timeRemaining: 0,
    firstBallColor: '',
    firstBallEven: false,
    firstBallHigherThan24: false
  })

  return { gameState, setGameState }
}

export default createRoot(createGlobalStore)
