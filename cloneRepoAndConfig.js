import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoUrl = 'https://github.com/ign-argentina/argenmap.git';
const publicDir = path.join(__dirname, 'public');
const configDir = path.join(publicDir, 'config');         // public/config folder
const assetsDir = path.join(__dirname, 'assets');         // assets folder in project root

const repoName = path.basename(repoUrl, '.git');          // gets the repo name from URL
const repoDir = path.join(__dirname, 'visor-server', 'public', repoName);  // destination: visor-server/public/argenmap

// Only copy language.json
const filesToCopy = ['language.json'];

// Create public folder if it doesn't exist
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log('Created public folder.');
}

// Create public/config folder if it doesn't exist
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
    console.log('Created config folder inside public.');
}

// Clone the repo if not already cloned
if (!fs.existsSync(repoDir)) {
    console.log(`Cloning repository into ${repoDir}...`);
    simpleGit().clone(repoUrl, repoDir)
        .then(() => console.log('Repository cloned successfully.'))
        .catch(err => console.error('Error cloning repository:', err));
} else {
    console.log('Repository already cloned.');
}

// Copy language.json from assets to public/config
filesToCopy.forEach(file => {
    const sourcePath = path.join(assetsDir, file);    // source file in assets/
    const destPath = path.join(configDir, file);      // destination in public/config

    if (fs.existsSync(destPath)) {
        console.log(`File ${file} already exists in ${configDir}, skipping copy.`);
    } else if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`File ${file} copied to ${configDir}.`);
    } else {
        console.warn(`File ${file} not found in assets folder.`);
    }
});
