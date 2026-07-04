import fs from 'fs/promises';
import yaml from 'yaml';

function removeNulls(obj) {
  if (Array.isArray(obj)) {
    return obj.map(v => (v && typeof v === 'object') ? removeNulls(v) : v).filter(v => v !== null);
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj[key] === null) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        removeNulls(obj[key]);
      }
    }
  }
  return obj;
}

async function main() {
  const configPath = 'cloudcannon.config.yml';
  
  const configStr = await fs.readFile(configPath, 'utf8');
  const config = yaml.parse(configStr);
  
  removeNulls(config);
  
  await fs.writeFile(configPath, yaml.stringify(config));
  console.log('Removed nulls from cloudcannon.config.yml');
}

main().catch(console.error);
