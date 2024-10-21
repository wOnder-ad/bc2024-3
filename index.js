const { program } = require('commander');
const fs = require('fs');

program
  .option('-i, --input <path>', 'input file path')
  .option('-o, --output <path>', 'output file path')
  .option('-d, --display', 'display result');

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

let data;
try {
  data = fs.readFileSync(options.input, 'utf8');
} catch (err) {
  console.error('Error reading the input file:', err.message);
  process.exit(1);
}

let jsonData;
try {
  jsonData = JSON.parse(data);
} catch (err) {
  console.error('Invalid JSON format in input file:', err.message);
  process.exit(1);
}

if (!options.output && !options.display) {
  process.exit(0);  
}

if (options.display) {
  console.log('Data:', jsonData);
}

if (options.output) {
  try {
    fs.writeFileSync(options.output, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log('Data written to:', options.output);
  } catch (err) {
    console.error('Error writing to the output file:', err.message);
    process.exit(1);
  }
}

process.exit(0);
