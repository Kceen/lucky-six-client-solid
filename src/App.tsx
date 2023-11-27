import { Component, For, Show, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { ballPositionInGrid, convertMessageRecieve, getAllBallsArray, getGridIndexesArray, stakes } from './helpers'
import { GameStatus, TicketStatus } from './models'
import { RoundEndScreen } from './RoundEndScreen'
import globalGameState from './store/GlobalStore'
import { Footer } from './Layout/Footer'
import { RoundInProgressScreen } from './RoundInProgressScreen'
import { TicketsList } from './components/TicketsList'
import { Transition } from 'solid-transition-group'
import { FadeAnimationWrapper } from './components/FadeAnimationWrapper'

const App: Component = () => {
  const { gameState, user } = globalGameState

  return (
    <>
      <div class="flex">
        <div class="w-3/4">
          <FadeAnimationWrapper duration={1000}>
            <Show when={gameState.status === GameStatus.ROUND_IN_PROGRESS}>
              <RoundInProgressScreen />
            </Show>
          </FadeAnimationWrapper>

          <FadeAnimationWrapper duration={1000} enterDelay={1000}>
            <Show when={gameState.status === GameStatus.WAITING_FOR_NEXT_ROUND}>
              <RoundEndScreen />
            </Show>
          </FadeAnimationWrapper>
        </div>
        <div style={{ height: 'calc(100vh - 210px)' }} class="w-1/4 overflow-y-scroll p-4">
          <FadeAnimationWrapper duration={500}>
            <Show when={user() && user()!.tickets.length > 0}>
              <TicketsList />
            </Show>
          </FadeAnimationWrapper>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App
