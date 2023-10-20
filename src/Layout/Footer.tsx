import { TimeLeftProgressBar } from '../TimeLeftProgressBar'

export const Footer = () => {
  return (
    <div class="fixed bottom-0 left-0 flex w-full justify-center bg-gray-800 p-6">
      <TimeLeftProgressBar />
    </div>
  )
}
