'use client'
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Navbar() {
    const handleButtonClick = (page) => {
        // Lógica para manejar la navegación, por ejemplo, usando el router de Next.js
        window.location.href = page;
    };

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <button className="navbar-button fas fa-home" onClick={() => handleButtonClick('/')} />
                </li>
                <li>
                    <button className="navbar-button fas fa-palette" onClick={() => handleButtonClick('/')} />
                </li>
                <li>
                    <button className="navbar-button fas fa-database" onClick={() => handleButtonClick('/')} />
                </li>
            </ul>
        </nav>
    );
}
