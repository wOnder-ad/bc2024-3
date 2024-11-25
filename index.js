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

function extractCurrencyRates(data) {
  const results = [];
  for (const entry of data) {
    const date = entry.exchangedate || 'Unknown Date'; // Перевірка, чи є поле exchangedate
    const rate = entry.rate || 'Unknown Rate';        // Перевірка, чи є поле rate
    results.push(`${date}:${rate}`);
  }
  return results;
}

let outputData;
try {
  if (Array.isArray(jsonData)) {
    outputData = extractCurrencyRates(jsonData);
  } else {
    console.error('JSON is not in expected format (array of objects).');
    process.exit(1);
  }
} catch (err) {
  console.error('Error processing the data:', err.message);
  process.exit(1);
}

if (!options.output && !options.display) {
  process.exit(0);  
}

if (options.display) {
  console.log(outputData.join('\n'));
}

if (options.output) {
  try {
    fs.writeFileSync(options.output, outputData.join('\n'), 'utf8');
    console.log('Data written to:', options.output);
  } catch (err) {
    console.error('Error writing to the output file:', err.message);
    process.exit(1);
  }
}

process.exit(0);
