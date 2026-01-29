// vercel-build.js
const { execSync } = require('child_process');

try {
  execSync('npm install --prefix client', { stdio: 'inherit' });
  execSync('npm run build --prefix client', { stdio: 'inherit' });
  console.log('Client build completed.');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
