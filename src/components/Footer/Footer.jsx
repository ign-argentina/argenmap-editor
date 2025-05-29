/* import { NavLink } from "react-router-dom"; */
import LatestRelease from '../LatestRelease/LatestRelease';
import './Footer.css'

function Footer() {
  return (
    <footer>
      <nav className="footer">
        <div className="To-Do">
          {/*                     <img src="https://static.ign.gob.ar/img/logo/ign/logo_IGN_blanco_sinTexto.svg" alt="Logo IGN" /> */}
        </div>
        <div className="foot-items">
          <LatestRelease />
        </div>

      </nav>
    </footer>
  )
}

export default Footer;