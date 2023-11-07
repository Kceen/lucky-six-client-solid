import { For, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Transition } from 'solid-transition-group'
import { getGridIndexesArray, ballPositionInGrid, stakes } from './helpers'
import globalGameState from './store/GlobalStore'

export const RoundInProgressScreen = () => {
  const { gameState, setGameState, newBallTrigger, setNewBallTrigger, ticketQRCodeImage, setTicketQRCodeImage, ws } =
    globalGameState

  return (
    <>
      <div class="relative">
        <div class="absolute left-1/2 top-3 grid -translate-x-1/2 grid-cols-5 gap-4">
          <For each={gameState.activeBalls}>
            {(ball, index) => {
              if (index() < 5) {
                return (
                  <div class="flex justify-center">
                    <img class="w-24" src={`/src/assets/balls/${ball}.svg`} />
                  </div>
                )
              }
            }}
          </For>
        </div>

        <img src={ticketQRCodeImage()} />

        <div style={{ height: 'calc(100vh - 200px)' }} class="grid grid-flow-col grid-cols-6 grid-rows-9 gap-4 p-6">
          <For each={getGridIndexesArray()}>
            {(gridIndex) => {
              return (
                <div
                  class="borders flex w-fit items-center justify-center gap-4 justify-self-center"
                  style={ballPositionInGrid(gridIndex)}
                >
                  <img
                    class="h-full rounded-full shadow-md"
                    src={`/src/assets/balls/${gameState.activeBalls[gridIndex]}.svg`}
                  />
                  <span> {stakes[gridIndex + 1]} </span>
                </div>
              )
            }}
          </For>

          {/* <For each={gameState.activeBalls}>
              {(ball, index) => {
                if (index() > 4) {
                  return (
                    <Transition
                      appear={true}
                      onEnter={(el, done) => {
                        const a = el.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], {
                          duration: 600
                        })
                        a.finished.then(done)
                      }}
                      onExit={(el, done) => {
                        const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
                          duration: 600
                        })
                        a.finished.then(done)
                      }}
                    >
                      <div style={ballPositionInGrid(index())} class="flex w-full items-center justify-center gap-4">
                        <img class="h-full rounded-full shadow-md" src={`/src/assets/balls/${ball}.svg`} />
                        <span> {stakes[index() + 1]} </span>
                      </div>
                    </Transition>
                  )
                }
              }}
            </For> */}
        </div>
      </div>
      <Portal>
        <div class="fixed left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2">
          <Transition
            appear={true}
            onEnter={(el, done) => {
              const a = el.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], {
                duration: 1000
              })
              a.finished.then(done)
            }}
            onExit={(el, done) => {
              const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 0
              })
              a.finished.then(done)
            }}
          >
            <Show when={newBallTrigger() && gameState.activeBalls.length > 0}>
              <img src={`/src/assets/balls/${gameState.activeBalls[gameState.activeBalls.length - 1]}.svg`} />
            </Show>
          </Transition>
        </div>
      </Portal>
    </>
  )
}
