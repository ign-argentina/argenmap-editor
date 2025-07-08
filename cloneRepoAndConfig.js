import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoUrl = 'https://github.com/ign-argentina/argenmap.git';
const publicDir = path.join(__dirname, 'public');
const configDir = path.join(publicDir, 'config');   // File public/config
const assetsDir = path.join(__dirname, 'assets');   // File assets proyect root

// 🚫 Antes: const repoDir = path.join(publicDir, repoName);
// ✅ Ahora: clonar Argenmap dentro de visor-server/public/argenmap
const repoName = path.basename(repoUrl, '.git');    // Gets the name of the repository
const repoDir = path.join(__dirname, 'visor-server', 'public', repoName);  // visor-server/public/argenmap

// Files you want to move
const filesToCopy = ['config.json', 'language.json'];

// Check if the public folder exists, if not, create it
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log('Carpeta public creada.');
}

// Check if the config folder inside public exists, if not, create it
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
    console.log('Carpeta config creada dentro de public.');
}

// Check if the repository has already been cloned
if (!fs.existsSync(repoDir)) {
    console.log(`Clonando el repositorio en ${repoDir}...`);
    simpleGit().clone(repoUrl, repoDir)
        .then(() => console.log('Repositorio clonado exitosamente.'))
        .catch(err => console.error('Error al clonar el repositorio:', err));
} else {
    console.log('El repositorio ya ha sido clonado!');
}

// Copy the files from the assets folder to the public/config folder
filesToCopy.forEach(file => {
    const sourcePath = path.join(assetsDir, file);  // Source path in assets
    const destPath = path.join(configDir, file);    // Destination path in public/config

    if (fs.existsSync(destPath)) {
        console.log(`Archivo ${file} ya existe en ${configDir}, no se copiará nuevamente.`);
    } else if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Archivo ${file} copiado a ${configDir}.`);
    } else {
        console.warn(`Archivo ${file} no encontrado en la carpeta assets.`);
    }
});
