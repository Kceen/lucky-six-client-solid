import { JSX } from 'solid-js'
import { Transition } from 'solid-transition-group'

interface IFadeAnimationWrapperProps {
  children: JSX.Element
  duration?: number
  enterDelay?: number
  exitDelay?: number
}

export const FadeAnimationWrapper = (props: IFadeAnimationWrapperProps) => {
  return (
    <Transition
      appear={true}
      onEnter={(el, done) => {
        const a = el.animate([{ opacity: '0' }, { opacity: '1' }], {
          duration: props.duration || 500,
          delay: props.enterDelay || 0
        })
        a.finished.then(done)
      }}
      onExit={(el, done) => {
        const a = el.animate([{ opacity: '1' }, { opacity: '0' }], {
          duration: props.duration || 500,
          delay: props.exitDelay || 0
        })
        a.finished.then(done)
      }}
    >
      {props.children}
    </Transition>
  )
}
