'use client'
import React, { useState, useEffect } from 'react';
import styles from './Components.module.css';

const Settings = () => {
    const [primaryColor, setPrimaryColor] = useState('#ffffff');
    const [secondaryColor, setSecondaryColor] = useState('#ffffff');
    const [textColor, setTextColor] = useState('#ffffff');
    const [activeColor, setActiveColor] = useState('#ffffff');

    const defaultPColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-default--color');
    const defaultSColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-default--color');
    const defaultTxtColor = getComputedStyle(document.documentElement).getPropertyValue('--text-default--color');
    const defaultActColor = getComputedStyle(document.documentElement).getPropertyValue('--active-default--color');


    useEffect(() => {// Al cargar la página, obtener el color de fondo inicial desde el localStorage
        const savedPrimaryColor = localStorage.getItem('primaryColor');
        const savedSecondaryColor = localStorage.getItem('secondaryColor');
        const savedTxtColor = localStorage.getItem('textColor');
        const savedActColor = localStorage.getItem('activeColor');

        const setCustomColor = (savedColor, defaultColor, propertyName, stateSetter) => {
            const color = savedColor || defaultColor;
            stateSetter(color);
            document.documentElement.style.setProperty(`--${propertyName}`, color);
        };   
        setCustomColor(savedPrimaryColor, defaultPColor, 'primary--color', setPrimaryColor);
        setCustomColor(savedSecondaryColor, defaultSColor, 'secondary--color', setSecondaryColor);
        setCustomColor(savedTxtColor, defaultTxtColor, 'text--color', setTextColor);
        setCustomColor(savedActColor, defaultActColor, 'active--color', setActiveColor);
    }, []);

    //primaryColor
    const handleChangePColor = (e) => {
        const newColor = e.target.value;
        setPrimaryColor(newColor);
        localStorage.setItem('primaryColor', newColor);  // Guardar en el localStorage
        document.documentElement.style.setProperty('--primary--color', newColor);
    };
    const handleDefaultPColor = () => {
        document.documentElement.style.setProperty('--primary--color', defaultPColor);
        localStorage.setItem("primaryColor", defaultPColor);
    };

    //secondaryColor
    const handleChangeSColor = (e) => {
        const newColor = e.target.value;
        setSecondaryColor(newColor);
        localStorage.setItem('secondaryColor', newColor);  // Guardar en el localStorage
        document.documentElement.style.setProperty('--secondary--color', newColor);
    };
    const handleDefaultSColor = () => {
        document.documentElement.style.setProperty('--secondary--color', defaultSColor);
        localStorage.setItem("secondaryColor", defaultSColor);
    };

    //textColor
    const handleChangeTxtColor = (e) => {
        const newColor = e.target.value;
        setTextColor(newColor);
        localStorage.setItem('textColor', newColor);
        document.documentElement.style.setProperty('--text--color', newColor);
    };
    const handleDefaultTxtColor = () => {
        document.documentElement.style.setProperty('--text--color', defaultTxtColor);
        localStorage.setItem("textColor", defaultTxtColor);
    };

    //activeColor
    const handleChangeActColor = (e) => {
        const newColor = e.target.value;
        setActiveColor(newColor);
        localStorage.setItem('activeColor', newColor);
        document.documentElement.style.setProperty('--active--color', newColor);
    };
    const handleDefaultActColor = () => {
        document.documentElement.style.setProperty('--active--color', defaultActColor);
        localStorage.setItem("activeColor", defaultActColor);
    };

    const handleDefaultAll = () => {
        handleDefaultPColor();
        handleDefaultSColor();
        handleDefaultTxtColor();
        handleDefaultActColor();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <div>CONFIGURACIÓN DE ESTILOS</div>
            <br/>
            <div className={styles.title}>Color de la Aplicación</div>
            <form className={styles.formMain} onSubmit={handleSubmit}>
                <div className={styles.settingWrapper}>
                    <div >
                        <label htmlFor="primaryColor">Primario: </label>
                        <input
                            type="color"
                            id="primaryColor"
                            value={primaryColor}
                            onChange={handleChangePColor}
                        />
                    </div>
                    <button type="button" className={styles.buttonS} onClick={handleDefaultPColor}>Por Defecto</button>
                </div>

                <div className={styles.settingWrapper}>
                    <div >
                        <label htmlFor="secondaryColor">Secundario: </label>
                        <input
                            type="color"
                            id="secondaryColor"
                            value={secondaryColor}
                            onChange={handleChangeSColor}
                        />
                    </div>
                    <button type="button" className={styles.buttonS} onClick={handleDefaultSColor}>Por Defecto</button>
                </div>

                <div className={styles.settingWrapper}>
                    <div >
                        <label htmlFor="textColor">Texto: </label>
                        <input
                            type="color"
                            id="textColor"
                            value={textColor}
                            onChange={handleChangeTxtColor}
                        />
                    </div>
                    <button type="button" className={styles.buttonS} onClick={handleDefaultTxtColor}>Por Defecto</button>
                </div>

                <div className={styles.settingWrapper}>
                    <div >
                        <label htmlFor="activeColor">Activado: </label>
                        <input
                            type="color"
                            id="activeColor"
                            value={activeColor}
                            onChange={handleChangeActColor}
                        />
                    </div>
                    <button type="button" className={styles.buttonS} onClick={handleDefaultActColor}>Por Defecto</button>
                </div>
            </form>

            <br/>
            <hr/>
            <div className={styles.title}>WIP</div>
            <form className={styles.formMain} onSubmit={handleSubmit}>
                <div className={styles.settingWrapper}>
                    <label htmlFor="textSize">WIP:</label>
                    <input type="number" id="textSize" name="textSize" min="8" max="72" required />
                </div>

                <div className={styles.settingWrapper}>
                <label htmlFor="textSize">WIP:</label>
                    <input type="number" id="textSize" name="textSize" min="8" max="72" required />
                </div>

                <div className={styles.settingWrapper}>
                <label htmlFor="textSize">WIP:</label>
                <input type="number" id="textSize" name="textSize" min="8" max="72" required />
                </div>
            </form>
            
            <br/>
            <hr/>
            <br/>

            <button type="button" className={styles.buttonS} onClick={handleDefaultAll}>Reestablecer Valores</button>
        </div>
    );

}
export default Settings;