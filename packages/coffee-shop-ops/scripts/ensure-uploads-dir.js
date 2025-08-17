// Ensures the public/uploads directory exists
// Usage: node scripts/ensure-uploads-dir.js
const fs = require('fs');
const path = require('path');

function ensureUploadsDir() {
  const uploadsDir = path.resolve(__dirname, '..', 'public', 'uploads');
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    // Optionally drop a .gitkeep so the directory stays in VCS
    const keepFile = path.join(uploadsDir, '.gitkeep');
    if (!fs.existsSync(keepFile)) {
      fs.writeFileSync(keepFile, '', 'utf8');
    }
    console.log(`Ensured uploads directory: ${uploadsDir}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to ensure uploads directory:', err);
    process.exit(1);
  }
}

ensureUploadsDir();