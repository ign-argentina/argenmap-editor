const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

const repoUrl = 'https://github.com/ign-argentina/argenmap.git';
const publicDir = path.join(__dirname, 'public');
const configDir = path.join(publicDir, 'config'); // Carpeta public/config
const assetsDir = path.join(__dirname, 'assets'); // Carpeta assets en la raíz del proyecto

const repoName = path.basename(repoUrl, '.git'); // Obtiene el nombre del repositorio
const repoDir = path.join(publicDir, repoName); // El directorio destino será public/repoName

// Archivos que deseas mover
const filesToCopy = ['config.json', 'language.json'];

// Verifica si la carpeta public existe, si no, la crea
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log('Carpeta public creada.');
}

// Verifica si la carpeta config dentro de public existe, si no, la crea
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
    console.log('Carpeta config creada dentro de public.');
}

// Verifica si el repositorio ya ha sido clonado
if (!fs.existsSync(repoDir)) {
    console.log(`Clonando el repositorio en ${repoDir}...`);
    simpleGit().clone(repoUrl, repoDir)
        .then(() => console.log('Repositorio clonado exitosamente.'))
        .catch(err => console.error('Error al clonar el repositorio:', err));
} else {
    console.log('El repositorio ya ha sido clonado!');
}

// Copia los archivos desde la carpeta assets a la carpeta public/config
filesToCopy.forEach(file => {
    const sourcePath = path.join(assetsDir, file); // Ruta de origen en assets
    const destPath = path.join(configDir, file); // Ruta de destino en public/config

    if (fs.existsSync(destPath)) {
        console.log(`Archivo ${file} ya existe en ${configDir}, no se copiará nuevamente.`);
    } else if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Archivo ${file} copiado a ${configDir}.`);
    } else {
        console.warn(`Archivo ${file} no encontrado en la carpeta assets.`);
    }
});
