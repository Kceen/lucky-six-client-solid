import { For, Show } from 'solid-js'
import { TicketStatus } from '../models'
import globalGameState from './../store/GlobalStore'

export const TicketsList = () => {
  const { user } = globalGameState

  return (
    <div class="flex flex-col-reverse gap-4 overflow-hidden">
      <For each={user()?.tickets}>
        {(ticket) => {
          const ticketTimestampDate = new Date(ticket.timestamp)
          const dateTimeString =
            ticketTimestampDate.toLocaleDateString('de-DE') + ' - ' + ticketTimestampDate.toLocaleTimeString('de-DE')

          let ticketStatusColor = ''
          if (ticket.status === TicketStatus.PENDING) {
            ticketStatusColor = 'orange'
          } else if (ticket.status === TicketStatus.WIN) {
            ticketStatusColor = 'green'
          } else {
            ticketStatusColor = 'red'
          }

          return (
            <div class="rounded-sm bg-white p-2 text-sm text-black">
              <div class="border-b p-2">
                <span class="font-bold">Ticket ID - </span> <span> {ticket.ticketId} </span>
              </div>
              <div style={{ 'background-color': ticketStatusColor, color: 'white' }} class="border-b p-2">
                <span class="font-bold">Status - </span>
                <span> {ticket.status} </span>
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
                        <div class="flex justify-between p-2">
                          <For each={ticket.userBalls}>
                            {(ball) => {
                              return (
                                <span style={{ color: round.balls.includes(ball) ? 'green' : 'red' }} class="font-bold">
                                  {ball}
                                </span>
                              )
                            }}
                          </For>
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
  )
}
