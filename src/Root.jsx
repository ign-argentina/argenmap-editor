import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

import { UserProvider } from './context/UserContext'

function Root() {

  return (
    <div className="app-container">
      <UserProvider>
        <Navbar />
          <main className="content">

        <Outlet />
          </main>
        <Footer />
      </UserProvider>
    </div>
  )
}

export default Root