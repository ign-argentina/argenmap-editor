/* import { NavLink } from "react-router-dom"; */
import LatestRelease from '../LatestRelease/LatestRelease';
import argenmapBanner from '../../assets/argenmap-banner.png';
import './Footer.css'

function Footer() {
  return (
    <footer>
      <nav className="footer">
        <div className="footer-left">
          <img src={argenmapBanner} alt="Argenmap Banner" className="footer-banner" />
        </div>
        <div className="foot-items">
          <LatestRelease />
        </div>

      </nav>
    </footer>
  )
}

export default Footer;