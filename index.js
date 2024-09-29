const {program} = require('commander');
const fs = require('fs');

program
.requiredOption('-i, --input <path>', 'шлях до файлу для читання (json з даними сервера НБУ)')
.option('-o, --output <path>', 'шлях до файлу для запису результату')
.option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);

const ortions = program.opts();

if (!ortions.input){
    console.error('Please, specify input file');
    process.exit(1);
}

if (!fs.existsSync(ortions.input)){
    console.error('Cannot find input file');
    process.exit(1);
}

let data;
try{
    const rawData = fs.readFileSync(options.input, 'utf8');
    console.log('Raw Date:', rawData);
    data = JSON.parse(rawDate);
    console.log('Parsed Date:', data);
} catch (err){
    console.error('Error reading or parsing input file');
    console.error(err);
    process.exit(1);
}

let resultLines = [];

if(Array.isArray(data)){
    data.forEach(entry => {
        if (entry.exchangedate && entry.rate){
            resultLines.push('${entry.exchangedate}:${entry.rate}');
            process.exit(1);
        }
    });
}else{
    console.error('Unexpected JSON structure');
    process.exit(1);
}

let result = resultLines.join('\n');

const writeResult = () => {
    if (options.output){
        try {
            fs.writeFileSync(options.output, result, 'utf8');
        } catch(err){
            console.error('Error writing to output file');
            process.exit(1);
        }
    }
};

const displayResult = () => {
    if (ortions.display){
        console.log(result);
    }
};

writeResult();
displayResult();