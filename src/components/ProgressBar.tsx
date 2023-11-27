import { Show } from 'solid-js'

interface IProgressBarProps {
  currentValue: number
  beforeText?: string
  afterText?: string
}

export const ProgressBar = (props: IProgressBarProps) => {
  return (
    <div class="relative flex items-center gap-4">
      <Show when={props.beforeText}>
        <div class="absolute -left-4 -translate-x-full">
          <p> {props.beforeText} </p>
        </div>
      </Show>
      <div class="relative h-5 w-full bg-gray-400">
        <div
          class="absolute h-5 bg-green-500 transition-all duration-1000 ease-linear"
          style={{
            width: props.currentValue + '%'
          }}
        ></div>
      </div>
      <Show when={props.afterText}>
        <div class="absolute -right-4 translate-x-full">
          <p> {props.afterText} </p>
        </div>
      </Show>
    </div>
  )
}
