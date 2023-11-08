import { A, useNavigate } from '@solidjs/router'
import { Show, createSignal } from 'solid-js'
import globalGameState from '../store/GlobalStore'
import Swal from 'sweetalert2'
import { GameActions } from '../models'

export const Header = () => {
  const { gameState, user, ws } = globalGameState

  const [currentTime, setCurrentTime] = createSignal<Date>(new Date())

  setInterval(() => {
    setCurrentTime(new Date())
  }, 1000)

  const navigate = useNavigate()

  const handleLogin = () => {
    Swal.fire({
      title: 'Login',
      html: `
        <div class="flex items-center flex-col">
          <p class="mb-3"> Username </p>
          <input id="username" class="text-xl text-center p-3 mb-3 border border-black"/>
          <p class="mb-3"> Password </p>
          <input type="password" id="password" class="text-xl text-center p-3 mb-8 border border-black"/>
        </div>
        `,
      confirmButtonColor: 'green',
      confirmButtonText: 'Submit',
      preConfirm: () => {
        const username = (document.getElementById('username') as HTMLInputElement).value
        const password = (document.getElementById('password') as HTMLInputElement).value

        ws.send(
          JSON.stringify({
            type: GameActions.LOGIN,
            data: {
              username,
              password
            }
          })
        )
      }
    })
  }

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
        <Show when={user()}>
          <div class="flex flex-col">
            <p>User</p>
            <p class="text-lg font-bold">{user()?.username}</p>
          </div>
          <div class="flex flex-col">
            <p>Money</p>
            <p class="text-lg font-bold">{user()?.money}</p>
          </div>
          <button onclick={() => navigate('/bet')} class="bg-white px-6 py-2 text-2xl font-bold text-black">
            BET
          </button>
        </Show>
        <Show when={!user()}>
          <button onclick={handleLogin} class="bg-white px-6 py-2 text-xl text-black">
            login
          </button>
        </Show>
      </div>
    </div>
  )
}
