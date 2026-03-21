const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceColors(content) {
  // Replace purple with emerald
  content = content.replace(/purple-/g, 'emerald-');
  // Replace pink with teal
  content = content.replace(/pink-/g, 'teal-');
  // Replace indigo with emerald
  content = content.replace(/indigo-/g, 'emerald-');
  return content;
}

const targetDir = path.join(__dirname, 'frontend', 'src');
walkDir(targetDir, (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = replaceColors(content);
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});
