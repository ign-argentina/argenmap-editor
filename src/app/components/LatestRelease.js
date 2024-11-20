import { useEffect, useState } from "react";
import axios from "axios";

function LatestRelease() {
    const [latestRelease, setLatestRelease] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchLatestRelease() {
            try {
                const response = await axios.get(
                    "https://api.github.com/repos/ign-argentina/argenmap-editor/releases/latest"
                );
                setLatestRelease(response.data);
            } catch (error) {
                setError("Error obteniendo la última release");
                console.error(error);
            }
        }

        fetchLatestRelease();
    }, []); // El array vacío asegura que solo se ejecuta al montar el componente.

    if (error) {
        return <div>{error}</div>;
    }

    if (!latestRelease) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1>{latestRelease.tag_name}</h1>
        </div>
    );
}

export default LatestRelease;
