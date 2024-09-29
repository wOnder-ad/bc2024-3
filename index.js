const { program } = require('commander');
const fs = require('fs');

program
  .requiredOption('-i, --input <path>', 'шлях до файлу для читання (json з даними сервера НБУ)')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);

const options = program.opts();

console.log('Options:', options); 


if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

console.log('Input file exists. Proceeding to read the file.'); 

let data;
try {
  const rawData = fs.readFileSync(options.input, 'utf8');
  console.log('Raw Data:', rawData); 
  data = JSON.parse(rawData);
  console.log('Parsed Data:', data); 
} catch (err) {
  console.error('Error reading or parsing input file');
  console.error(err); 
  process.exit(1);
}

let resultLines = [];

if (Array.isArray(data)) {
  data.forEach(entry => {
    if (entry.exchangedate && entry.rate) {
      resultLines.push(`${entry.exchangedate}:${entry.rate}`);
    }
  });
} else {
  console.error('Unexpected JSON structure');
  process.exit(1);
}

let result = resultLines.join('\n');
console.log('Result:', result); 

const writeResult = () => {
  if (options.output) { 
    try {
      fs.writeFileSync(options.output, result, 'utf8');
      console.log(`Result written to ${options.output}`); 
    } catch (err) {
      console.error('Error writing to output file');
      console.error(err);
      process.exit(1);
    }
  }
};

const displayResult = () => {
  if (options.display) { 
    console.log(result);
  }
};

writeResult();
displayResult();