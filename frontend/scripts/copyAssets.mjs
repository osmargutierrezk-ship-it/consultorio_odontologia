import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd());
const sourceDir = path.join(root, 'src', 'assets');
const targetDir = path.join(root, 'public', 'assets');

function copyRecursive(source, target) {
  if (!fs.existsSync(source)) return;

  fs.mkdirSync(target, { recursive: true });
  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

copyRecursive(sourceDir, targetDir);
console.log('[copy:assets] Asset copy completed');
