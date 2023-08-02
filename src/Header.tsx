import { A } from '@solidjs/router'

export const Header = () => {
  return (
    <div class="flex items-center justify-between bg-gradient-to-r from-green-500 to-green-700 p-6 text-white">
      <A href="" class="text-5xl font-bold italic">
        LuckySIX
      </A>
      <A
        href="/ticket-status"
        class="border border-white p-2 text-xl transition-colors duration-200 hover:bg-white hover:text-black"
      >
        ticket status
      </A>
    </div>
  )
}
