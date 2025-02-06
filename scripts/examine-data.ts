import fs from 'fs';
import { parse } from 'csv-parse/sync';

function examineCSVFile() {
  const fileContent = fs.readFileSync('data/shiller_data.csv', 'utf-8');
  const records = parse(fileContent, {
    skip_empty_lines: true,
    trim: true
  });

  console.log('First 20 Rows:');
  for(let i = 0; i < Math.min(20, records.length); i++) {
    console.log(`Row ${i+1}:`, records[i].slice(0, 5));
  }
}

examineCSVFile();
