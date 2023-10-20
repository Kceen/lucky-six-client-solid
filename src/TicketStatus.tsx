import { For, Show, createEffect, createResource, createSignal } from 'solid-js'
import { ITicketStatus } from './models'
import { useSearchParams } from '@solidjs/router'
import { stakes } from './helpers'

export const TicketStatus = () => {
  const [ticketData, setTicketData] = createSignal<ITicketStatus | undefined>()
  const [responseStatusMessage, setResponseStatusMessage] = createSignal('')

  const [queryParams] = useSearchParams()

  const submitTicketId = async () => {
    return await fetch('http://localhost:3001/ticket-status/' + queryParams.id)
  }

  const [data, { refetch }] = createResource(submitTicketId)

  createEffect(() => {
    if (data()?.status === 404) {
      setResponseStatusMessage('No ticket found with id')
    } else {
      data()
        ?.json()
        .then((ticket: ITicketStatus) => {
          ticket.timestamp = new Date(ticket.timestamp)
          setTicketData(ticket)
        })
    }
  })

  return (
    <div class="m-12">
      <h1 class="mb-6 text-4xl"> Ticket status </h1>

      <button
        class="bg-black"
        onclick={() => {
          refetch()
        }}
      >
        refresh
      </button>

      <p> {responseStatusMessage()} </p>
      <p> {data.loading ? 'Loading ticket...' : ''} </p>

      <Show when={ticketData()}>
        <div>
          <div class="mb-6">
            <p> Ticket ID - {ticketData()?.ticketId} </p>
            <p> Status - {ticketData()?.active ? 'PENDING' : 'FINISHED'} </p>
            <p>
              Rounds played - {ticketData()?.startingRound} -{' '}
              {ticketData()!.startingRound + (ticketData()!.numOfRounds - 1)}
            </p>
            <p>
              Time - {ticketData()?.timestamp.toLocaleDateString('de-DE')}{' '}
              {ticketData()?.timestamp.toLocaleTimeString()}
            </p>
            <p> Bet - {ticketData()!.betPerRound * ticketData()!.numOfRounds} </p>
            <p> Amount won - {ticketData()?.amountWon}</p>
          </div>

          <div class="flex flex-col gap-4">
            <For each={ticketData()?.rounds}>
              {(round) => (
                <div class="rounded-lg border border-black p-6">
                  <div class="mb-6">
                    <p> Round - {round.number} </p>
                    <p> Bet - {ticketData()?.betPerRound} </p>
                    <p> Amount won - {round.amountWon} </p>
                    <p class={round.status === 'WIN' ? 'text-green-500' : 'text-red-500'}>{round.status}</p>
                  </div>

                  <div class="grid grid-cols-6">
                    <For each={ticketData()?.userBalls}>
                      {(ball) => {
                        const userBallIndexInRound = round.balls.indexOf(ball)
                        let stake = ''

                        if (userBallIndexInRound === -1) {
                          stake = 'X'
                        } else if (userBallIndexInRound < 5) {
                          stake = 'DRUM'
                        } else {
                          stake = stakes[userBallIndexInRound + 1] + 'x'
                        }

                        return (
                          <div class="flex flex-col items-center gap-2">
                            <img
                              src={`/src/assets/balls/${ball}.svg`}
                              class={`mx-auto my-0 w-20 text-center text-2xl`}
                            />
                            <p style={stake === 'X' ? { color: 'red' } : ''}> {stake} </p>
                          </div>
                        )
                      }}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}
