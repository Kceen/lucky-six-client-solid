import { For, Ref, Show, createEffect, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Transition } from 'solid-transition-group'
import { getGridIndexesArray, ballPositionInGrid, stakes } from './helpers'
import globalGameState from './store/GlobalStore'
import { FadeAnimationWrapper } from './components/FadeAnimationWrapper'

export const RoundInProgressScreen = () => {
  const { gameState, setGameState, newBallTrigger, setNewBallTrigger, ticketQRCodeImage, setTicketQRCodeImage, ws } =
    globalGameState

  let gridBallsWrapperRef: HTMLDivElement | undefined
  let testRef: any | undefined

  // IF THE ROUND HAS ALREADY STARTED, PREPEND ALL ALREADY DRAWN BALLS IMMEDIATELY
  onMount(() => {
    // console.log(gridBallsWrapperRef?.children[0])

    if (gameState.activeBalls.length > 5) {
      // testRef.append(document.createElement('div'))
      for (let i = 5; i < gameState.activeBalls.length - 1; i++) {
        const ballImg = document.createElement('img')
        ballImg.src = `/src/assets/balls/${gameState.activeBalls[i]}.svg`
        ballImg.className = 'h-full rounded-full shadow-md'
        gridBallsWrapperRef?.children[i - 5].prepend(ballImg)
      }
    }
  })

  createEffect(() => {
    if (gameState.activeBalls.length > 5) {
      // INDEX STARTS AT 0 SO -1 FROM LENGTH WHICH STARTS AT 1 AND -5 TO IGNORE FIRST 5 BALLS FROM DRUM
      const currentBallIndex = gameState.activeBalls.length - 1 - 5
      const ballImg = document.createElement('img')
      ballImg.src = `/src/assets/balls/${gameState.activeBalls[currentBallIndex + 5]}.svg`
      ballImg.className = 'h-full rounded-full shadow-md'

      // gridBallsWrapperRef?.children[currentBallIndex].children[0].replaceWith(ballImg)

      gridBallsWrapperRef?.children[currentBallIndex].prepend(ballImg)
    }
  })

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

        <div
          ref={gridBallsWrapperRef}
          style={{ height: 'calc(100vh - 200px)' }}
          class="grid grid-flow-col grid-cols-6 grid-rows-9 gap-4 p-6"
        >
          <For each={getGridIndexesArray()}>
            {(gridIndex) => {
              return (
                <div
                  class="borders flex w-fit items-center justify-center gap-4 justify-self-center"
                  style={ballPositionInGrid(gridIndex)}
                >
                  {/* <img
                    class="h-full rounded-full shadow-md"
                    src={`/src/assets/balls/${gameState.activeBalls[gridIndex]}.svg`}
                  /> */}
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
