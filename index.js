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

const data = fs.readFileSync(options.input, 'utf8');

if (!options.output && !options.display) {
  process.exit(0);  
}

if (options.display) {
  console.log('Data:', data);
}

if (options.output) {
  fs.writeFileSync(options.output, data);
  console.log('Data written to:', options.output);
}
