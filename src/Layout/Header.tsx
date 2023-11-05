import { A, useNavigate } from '@solidjs/router'
import { createSignal } from 'solid-js'
import globalGameState from '../store/GlobalStore'
import Swal from 'sweetalert2'
import { GameActions, ITicket } from '../models'

export const Header = () => {
  const { gameState, ws } = globalGameState

  const [currentTime, setCurrentTime] = createSignal<Date>(new Date())

  setInterval(() => {
    setCurrentTime(new Date())
  }, 1000)

  const navigate = useNavigate()

  return (
    <div class="flex items-center justify-between bg-gradient-to-r from-green-500 to-green-700 p-6 text-white">
      <div class="flex gap-6">
        <A href="" class="text-5xl font-bold italic">
          LuckySIX
        </A>
        <div class="flex flex-col">
          <p>Location</p>
          <p class="text-lg font-bold">Online baby</p>
        </div>
      </div>
      <div class="flex items-center gap-6">
        <div class="flex flex-col">
          <p>Round</p>
          <p class="text-lg font-bold">{gameState.round}</p>
        </div>
        <div class="flex flex-col">
          <p>Date</p>
          <p class="text-lg font-bold">{new Date().toLocaleDateString('de-DE')}</p>
        </div>
        <div class="flex flex-col">
          <p>Time</p>
          <p class="text-lg font-bold">{currentTime().toLocaleTimeString('de-DE')}</p>
        </div>
        <button onclick={() => navigate('/bet')} class="bg-white px-6 py-2 text-2xl font-bold text-black">
          BET
        </button>
      </div>
    </div>
  )
}
