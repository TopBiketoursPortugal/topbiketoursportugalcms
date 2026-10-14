import fs from 'fs/promises';
import yaml from 'yaml';

async function main() {
  const configPath = 'cloudcannon.config.yml';
  const structuresPath = '.cloudcannon/schemas/migrated-structures.json';
  
  const configStr = await fs.readFile(configPath, 'utf8');
  const config = yaml.parse(configStr);
  
  const structuresStr = await fs.readFile(structuresPath, 'utf8');
  const migratedStructures = JSON.parse(structuresStr);
  
  if (!config._structures) {
    config._structures = {};
  }
  
  for (const [key, struct] of Object.entries(migratedStructures)) {
    // CloudCannon _structures must have `style: select` and `values: [...]`
    // We generated the structure contents directly as `struct`, so we need to wrap it.
    
    // Check if it's already wrapped (unlikely)
    if (struct.values) {
      config._structures[key] = struct;
      continue;
    }

    config._structures[key] = {
      style: 'select',
      values: [
        struct
      ]
    };
  }
  
  // Remove bookshop
  if (config.bookshop) {
    delete config.bookshop;
  }
  
  // Fix minor invalid icon references that CC complained about
  if (config.collections_config?.team?.icon === 'people') config.collections_config.team.icon = 'groups';
  if (config.collections_config?.tourRegions?.icon === 'place') config.collections_config.tourRegions.icon = 'location_on';
  
  await fs.writeFile(configPath, yaml.stringify(config));
  console.log('Updated cloudcannon.config.yml format');
}

main().catch(console.error);
