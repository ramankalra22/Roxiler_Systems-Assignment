const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');

esbuild.build({
  absWorkingDir: __dirname,
  entryPoints: ['src/index.jsx'],
  bundle: true,
  outdir: 'dist',
  loader: { '.js': 'jsx', '.jsx': 'jsx', '.css': 'css' },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.VITE_API_URL': '"http://localhost:3001"'
  }
}).then(() => {
  const cssPath = path.join(__dirname, 'src', 'tailwind.css');
  const cssOutputPath = path.join(__dirname, 'dist', 'index.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  const srcHtml = path.join(__dirname, 'public', 'index.html');
  const destHtml = path.join(__dirname, 'dist', 'index.html');

  return postcss([tailwindcss(path.join(__dirname, '..', 'tailwind.config.js'))])
    .process(css, { from: cssPath })
    .then(result => {
      fs.writeFileSync(cssOutputPath, result.css);
      fs.copyFileSync(srcHtml, destHtml);
      console.log('Frontend build complete. HTML and Tailwind CSS copied to dist.');
    });
}).catch(() => process.exit(1));
