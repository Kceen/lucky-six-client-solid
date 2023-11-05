import { Outlet } from '@solidjs/router'
import { Header } from './Header'
import { Footer } from './Footer'

export const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
