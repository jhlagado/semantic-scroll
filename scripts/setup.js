#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = process.cwd();
const EXAMPLE_CONFIG_PATH = path.join(ROOT, 'site-config.example.json');
const CONFIG_PATH = path.join(ROOT, 'site-config.json');
const CONTENT_ROOT = path.join(ROOT, 'content');
const EXAMPLE_INSTANCE = path.join(CONTENT_ROOT, 'example');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyDir(source, dest) {
  const entries = fs.readdirSync(source, { withFileTypes: true });
  ensureDir(dest);
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function prompt(question, fallback) {
  const suffix = fallback ? ` [${fallback}]` : '';
  return new Promise((resolve) => {
    rl.question(`${question}${suffix}: `, (answer) => {
      const value = answer.trim();
      resolve(value || fallback || '');
    });
  });
}

function assertExampleInstance() {
  if (!fs.existsSync(EXAMPLE_INSTANCE)) {
    throw new Error('Missing content/example. The engine ships with an example instance.');
  }
}

function assertInstanceDir(name) {
  if (!name || name.includes('/') || name.includes('\\')) {
    throw new Error('contentDir must be a single folder name.');
  }
}

function hasFiles(dirPath) {
  return fs.existsSync(dirPath) && fs.readdirSync(dirPath).length > 0;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  assertExampleInstance();

  const defaults = fs.existsSync(EXAMPLE_CONFIG_PATH)
    ? readJson(EXAMPLE_CONFIG_PATH)
    : {
        siteName: 'My Blog',
        siteDescription: 'Short description used in feeds and meta tags.',
        siteUrl: 'https://example.com',
        customDomain: '',
        author: 'Your Name',
        language: 'en-AU',
        contentDir: 'my-blog'
      };

  const siteName = await prompt('Site name', defaults.siteName);
  const siteDescription = await prompt('Site description', defaults.siteDescription);
  const siteUrl = await prompt('Site URL', defaults.siteUrl);
  const customDomain = await prompt('Custom domain (optional)', defaults.customDomain);
  const author = await prompt('Author name', defaults.author);
  const language = await prompt('Language tag', defaults.language);
  const contentDir = await prompt('Instance folder name', defaults.contentDir);

  assertInstanceDir(contentDir);

  const instanceDir = path.join(CONTENT_ROOT, contentDir);
  if (hasFiles(instanceDir)) {
    throw new Error(`content/${contentDir} already exists and is not empty.`);
  }

  copyDir(EXAMPLE_INSTANCE, instanceDir);

  const siteConfig = {
    siteName,
    siteDescription,
    siteUrl,
    customDomain,
    author,
    language,
    contentDir
  };

  writeJson(CONFIG_PATH, siteConfig);

  const siteJsonPath = path.join(instanceDir, 'site.json');
  if (fs.existsSync(siteJsonPath)) {
    const siteJson = readJson(siteJsonPath);
    siteJson.siteName = siteName;
    siteJson.siteDescription = siteDescription;
    siteJson.siteUrl = siteUrl;
    siteJson.customDomain = customDomain;
    siteJson.author = author;
    siteJson.language = language;
    writeJson(siteJsonPath, siteJson);
  }

  console.log('\nSetup complete.');
  console.log(`- Instance folder: content/${contentDir}`);
  console.log('- Config: site-config.json');
  console.log('Next: npm install, then npm start.');
}

main()
  .catch((error) => {
    console.error(`\n[setup] ${error.message}`);
    process.exit(1);
  })
  .finally(() => {
    rl.close();
  });
