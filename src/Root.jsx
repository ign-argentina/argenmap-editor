import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'


function Root() {
  return (
    <div className="app-container">     
          <Navbar />
          <main className="content">
            <Outlet />
          </main>
          <Footer />
    </div>
  )
}

export default Root