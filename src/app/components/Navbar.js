'use client'
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Navbar() {
    const [formVisible, setFormVisible] = useState(true);

    const handleButtonClick = (page) => {
        window.location.href = page;
    };

    const toggleFormDisplay = () => {
        setFormVisible(!formVisible);
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            formContainer.style.display = formVisible ? 'none' : 'grid';
        }
    };

    return (
        <nav className="navbar">
            <img src="/path-to-your-logo.png" alt="Logo" className="logo" />
            <button
                className={`navbar-display-button ${formVisible ? 'fa-solid fa-arrow-left' : 'fa-solid fa-arrow-right'}`}
                onClick={toggleFormDisplay}
            />
            <ul>
                <li>
                    <button className="navbar-button fas fa-home" onClick={() => handleButtonClick('/')} />
                </li>
                <li>
                    <button className="navbar-button fas fa-palette" onClick={() => handleButtonClick('/about')} />
                </li>
                <li>
                    <button className="navbar-button fas fa-database" onClick={() => handleButtonClick('/contact')} />
                </li>
            </ul>
        </nav>
    );
}