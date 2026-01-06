/* import { NavLink } from "react-router-dom"; */
import LatestRelease from '../LatestRelease/LatestRelease';
import argenmapBanner from '../../assets/argenmap-banner.png';
import './Footer.css'

function Footer() {
  return (
    <footer>
      <nav className="footer">
        <div className="footer-left">
          <a href="https://github.com/ign-argentina/argenmap" target="_blank" rel="noopener noreferrer">
            <img src={argenmapBanner} alt="Argenmap Banner" className="footer-banner" />
          </a>
        </div>
        <div className="foot-items">
          <LatestRelease />
        </div>

      </nav>
    </footer>
  )
}

export default Footer;