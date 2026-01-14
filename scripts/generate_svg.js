const fs = require('fs');
// NOTE: This script assumes 'potrace' is available. 
// User prefers global installation for one-off tools.
// If running locally without node_modules, ensures potrace is in your NODE_PATH 
// or run with a tool like npx: npx potrace assets/image.png -o assets/image.svg
const potrace = require('potrace');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: node scripts/generate_svg.js <input_png> [output_svg]');
  process.exit(1);
}

const inputPath = args[0];
const inputExt = path.extname(inputPath);
const outputArg = args[1];

let outputPath;
if (outputArg) {
  outputPath = outputArg;
} else {
  const dir = path.dirname(inputPath);
  const name = path.basename(inputPath, inputExt);
  outputPath = path.join(dir, `${name}.svg`);
}

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const params = {
  threshold: 128,
  blackOnWhite: true,
  optCurve: true,
  turdSize: 2,
  alphaMax: 1
};

potrace.trace(inputPath, params, function(err, svg) {
  if (err) {
    console.error('Error vectorizing image:', err);
    process.exit(1);
  }
  fs.writeFileSync(outputPath, svg);
  console.log(`Saved SVG to ${outputPath}`);
});
