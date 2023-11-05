/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { Router, Route, Routes } from '@solidjs/router'
import { TicketStatus } from './TicketStatus'
import { Layout } from './Layout/base'
import { BetScreen } from './BetScreen'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?'
  )
}

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" component={Layout}>
          <Route path="/" component={App} />
          <Route path="/ticket-status" component={TicketStatus} />
          <Route path="/bet" component={BetScreen} />
        </Route>
      </Routes>
    </Router>
  ),
  root!
)
