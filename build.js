// build.js — concatenates src/ files into bcn-importer.user.js
// Usage: node build.js
'use strict';

const fs   = require('fs');
const path = require('path');

const SRC_FILES = [
    'src/header.js',
    'src/constants.js',
    'src/utils.js',
    'src/session.js',
    'src/fill-main.js',
    'src/fill-subpages.js',
    'src/orchestration.js',
    'src/sample.js',
    'src/modal.js',
    'src/boot.js',
];

const output = SRC_FILES
    .map(f => fs.readFileSync(path.join(__dirname, f), 'utf8'))
    .join('\n');

const outFile = path.join(__dirname, 'bcn-importer.user.js');
fs.writeFileSync(outFile, output, 'utf8');
console.log(`Built ${outFile} from ${SRC_FILES.length} source files.`);
