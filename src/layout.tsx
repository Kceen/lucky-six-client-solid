import { A, Outlet } from '@solidjs/router'
import { Header } from './Header'

export const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
