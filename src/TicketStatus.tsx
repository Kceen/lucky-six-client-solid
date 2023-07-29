import { createSignal } from 'solid-js'

export const TicketStatus = () => {
  const [ticketIdInput, setTicketIdInput] = createSignal('')
  const [ticketData, setTicketData] = createSignal('')

  const submitTicketId = async () => {
    const response = await fetch(
      'http://localhost:3001/ticket-status/' + ticketIdInput()
    )
    const ticketDataJson = await response.json()
    console.log(ticketDataJson)
    setTicketData(JSON.stringify(ticketDataJson))
  }

  return (
    <div>
      <h1 class="text-4xl"> Ticket status </h1>

      <p> ticket id </p>
      <input
        class="border border-black"
        value={ticketIdInput()}
        oninput={(e) => {
          setTicketIdInput(e.target.value)
        }}
      />
      <button onclick={submitTicketId}> submit </button>

      <div> {ticketData()} </div>
    </div>
  )
}
