'use client'
export default function Navbar() {
    const handleButtonClick = (page) => {
        // Lógica para manejar la navegación, por ejemplo, usando el router de Next.js
        window.location.href = page;
    };

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <button className="navbar-button" onClick={() => handleButtonClick('/')}>A</button>
                </li>
                <li>
                    <button className="navbar-button" onClick={() => handleButtonClick('/about')}>B</button>
                </li>
                <li>
                    <button className="navbar-button" onClick={() => handleButtonClick('/contact')}>C</button>
                </li>
            </ul>
        </nav>
    );
}
