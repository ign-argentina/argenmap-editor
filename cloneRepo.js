import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoUrl = 'https://github.com/ign-argentina/argenmap.git';
const publicDir = path.join(__dirname, 'public');

// Gets the name of the repository from URL
const repoName = path.basename(repoUrl, '.git');

// Destination: visor-server/public/argenmap
const repoDir = path.join(__dirname, 'visor-server', 'public', repoName);

// Check if the public folder exists, if not, create it
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
  console.log('Created public folder.');
}

// Check if the repository has already been cloned
if (!fs.existsSync(repoDir)) {
  console.log(`Cloning repository into ${repoDir}...`);
  simpleGit()
    .clone(repoUrl, repoDir)
    .then(() => console.log('Repository cloned successfully.'))
    .catch(err => console.error('Error cloning repository:', err));
} else {
  console.log('Repository already cloned.');
}