import { Component, For, Show, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { ballPositionInGrid, convertMessageRecieve, getAllBallsArray, getGridIndexesArray, stakes } from './helpers'
import { GameStatus } from './models'
import { RoundEndScreen } from './RoundEndScreen'
import globalGameState from './store/GlobalStore'
import { Footer } from './Layout/Footer'
import { RoundInProgressScreen } from './RoundInProgressScreen'

const App: Component = () => {
  const { gameState, user } = globalGameState

  return (
    <div class="flex">
      <div class="w-3/4">
        <Show when={gameState.status === GameStatus.ROUND_IN_PROGRESS}>
          <RoundInProgressScreen />
        </Show>

        <Show when={gameState.status === GameStatus.WAITING_FOR_NEXT_ROUND}>
          <RoundEndScreen />
        </Show>

        <Footer />
      </div>
      <div style={{ height: 'calc(100vh - 210px)' }} class="w-1/4 overflow-y-scroll p-4">
        <div class="flex flex-col gap-4 overflow-hidden">
          <For each={user()?.tickets}>
            {(ticket) => {
              const ticketTimestampDate = new Date(ticket.timestamp)
              const dateTimeString =
                ticketTimestampDate.toLocaleDateString('de-DE') +
                ' - ' +
                ticketTimestampDate.toLocaleTimeString('de-DE')

              return (
                <div class="rounded-sm bg-white p-2 text-sm text-black">
                  <div class="border-b p-2">
                    <span class="font-bold">Ticket ID - </span> <span> {ticket.ticketId} </span>
                  </div>
                  <div class="border-b p-2">
                    <span class="font-bold">Bet - </span> <span> {ticket.betSum} </span>
                  </div>
                  <div class="border-b p-2">
                    <span class="font-bold">Rounds - </span>
                    <span>
                      {ticket.startingRound} - {ticket.startingRound + (ticket.numOfRounds - 1)} ({ticket.numOfRounds})
                    </span>
                  </div>
                  <div class="border-b p-2">
                    <span class="font-bold">Time - </span>
                    <span>{dateTimeString}</span>
                  </div>
                  <div class="border-b p-2">
                    <For each={ticket.rounds}>
                      {(round) => {
                        return (
                          <div class="border-b">
                            <div class="p-2">
                              <span class="font-bold">Round - </span> <span> {round.number} </span>
                            </div>
                            <div class="p-2">
                              <span class="font-bold">Status - </span> <span> {round.status} </span>
                            </div>
                            <div class="p-2">
                              <span> {ticket.userBalls.join(',')} </span>
                            </div>
                            <Show when={round.amountWon !== 0}>
                              <div class="p-2">
                                <span class="font-bold">Won - </span> <span> {round.amountWon} </span>
                              </div>
                            </Show>
                          </div>
                        )
                      }}
                    </For>
                  </div>
                </div>
              )
            }}
          </For>
        </div>
      </div>
    </div>
  )
}

export default App
