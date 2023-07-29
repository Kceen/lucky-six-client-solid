import { For, Show, createSignal } from 'solid-js'
import { ITicketStatus } from './models'

export const TicketStatus = () => {
  const [ticketIdInput, setTicketIdInput] = createSignal('')
  const [ticketData, setTicketData] = createSignal<ITicketStatus | undefined>()
  const [responseStatusMessage, setResponseStatusMessage] = createSignal('')

  const submitTicketId = async () => {
    const response = await fetch(
      'http://localhost:3001/ticket-status/' + ticketIdInput()
    )
    if (response.status === 404) {
      setResponseStatusMessage('No ticket found with id')
      setTicketData(undefined)
    } else {
      const ticketData: ITicketStatus = await response.json()
      setTicketData(ticketData)
      setResponseStatusMessage('')
    }
  }

  return (
    <div>
      <h1 class="text-4xl"> Ticket status </h1>

      <div class="mb-10">
        <p> ticket id </p>
        <input
          class="border border-black w-full p-3"
          value={ticketIdInput()}
          oninput={(e) => {
            setTicketIdInput(e.target.value)
          }}
        />
        <button class="border border-black p-3" onclick={submitTicketId}>
          submit
        </button>
      </div>

      <p> {responseStatusMessage()} </p>
      <Show when={ticketData()}>
        <div>
          <p> id - {ticketData()?.ticketId} </p>
          <p> status - {ticketData()?.active ? 'PENDING' : 'FINISHED'} </p>
          <p>
            rounds - {ticketData()?.startingRound} -
            {ticketData()!.startingRound + (ticketData()!.numOfRounds - 1)}
          </p>
          <p> timestamp - {ticketData()?.timestamp.toString()} </p>
          <p> balls - {ticketData()?.userBalls} </p>
          <p> bet - {ticketData()!.betPerRound * ticketData()!.numOfRounds} </p>
          <p>
            sum won -
            {ticketData()?.rounds.reduce((sum, round) => {
              return sum + round.amountWon
            }, 0)}
          </p>

          <For each={ticketData()?.rounds}>
            {(round) => (
              <div class="border border-black p-6">
                <p> round - {round.number} </p>
                <p> bet - {ticketData()?.betPerRound} </p>

                <div class="grid grid-cols-8 border border-black">
                  <For each={round.balls}>
                    {(ball) => (
                      <div
                        class={`${
                          ticketData()?.userBalls.includes(ball)
                            ? 'bg-green-500 text-white'
                            : ''
                        } p-3 text-center border text-2xl`}
                      >
                        {ball}
                      </div>
                    )}
                  </For>
                </div>

                <p> amount won - {round.amountWon} </p>
                <p
                  class={
                    round.status === 'WIN' ? 'text-green-500' : 'text-red-500'
                  }
                >
                  {round.status}
                </p>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}
