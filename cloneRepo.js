const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

const repoUrl = 'https://github.com/ign-argentina/argenmap.git';
const publicDir = path.join(__dirname, 'public');
const repoName = path.basename(repoUrl, '.git'); // Obtiene el nombre del repositorio
const repoDir = path.join(publicDir, repoName); // El directorio destino será public/repoName

// Verifica si la carpeta public existe, si no, la crea
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log('Carpeta public creada.');
}

// Verifica si el repositorio ya ha sido clonado
if (!fs.existsSync(repoDir)) {
    console.log(`Clonando el repositorio en ${repoDir}...`);
    simpleGit().clone(repoUrl, repoDir)
        .then(() => console.log('Repositorio clonado exitosamente.'))
        .catch(err => console.error('Error al clonar el repositorio:', err));
} else {
    console.log('El repositorio ya ha sido clonado.');
}
