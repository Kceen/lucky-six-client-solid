import { Component, For, Show, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { ballPositionInGrid, convertMessageRecieve, getAllBallsArray, getGridIndexesArray, stakes } from './helpers'
import { GameStatus, TicketStatus } from './models'
import { RoundEndScreen } from './RoundEndScreen'
import globalGameState from './store/GlobalStore'
import { Footer } from './Layout/Footer'
import { RoundInProgressScreen } from './RoundInProgressScreen'
import { TicketsList } from './components/TicketsList'

const App: Component = () => {
  const { gameState, user } = globalGameState

  return (
    <>
      <div class="flex">
        <div class="w-3/4">
          <Show when={gameState.status === GameStatus.ROUND_IN_PROGRESS}>
            <RoundInProgressScreen />
          </Show>

          <Show when={gameState.status === GameStatus.WAITING_FOR_NEXT_ROUND}>
            <RoundEndScreen />
          </Show>
        </div>
        <div style={{ height: 'calc(100vh - 210px)' }} class="w-1/4 overflow-y-scroll p-4">
          <TicketsList />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App
