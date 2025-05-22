import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

import { UserProvider } from './context/UserContext'

function Root() {

  return (
    <>
      <UserProvider>
        <Navbar />
        <Outlet />
        <Footer />
      </UserProvider>
    </>
  )
}

export default Root