import fs from 'fs/promises';
import yaml from 'yaml';

function fixIcons(obj) {
  const iconMap = {
    'message': 'chat',
    'place': 'location_on',
    'text': 'article',
    'smart_button': 'radio_button_checked',
    'baseline-directions-bike': 'directions_bike',
    'columns': 'view_column',
    'video': 'smart_display'
  };
  
  if (Array.isArray(obj)) {
    for (const item of obj) fixIcons(item);
  } else if (typeof obj === 'object' && obj !== null) {
    if (obj.icon && iconMap[obj.icon]) {
      obj.icon = iconMap[obj.icon];
    }
    for (const key in obj) {
      fixIcons(obj[key]);
    }
  }
}

function fixInputs(obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'number') obj[i] = String(obj[i]); // Fix number in select values
      else fixInputs(obj[i]);
    }
  } else if (typeof obj === 'object' && obj !== null) {
    if (obj.description !== undefined) {
      if (!obj.comment) obj.comment = obj.description;
      delete obj.description;
    }
    if (obj.default !== undefined) delete obj.default;
    if (obj.example !== undefined) delete obj.example;
    if (obj.required !== undefined) delete obj.required;
    
    if (obj.type === 'boolean') obj.type = 'switch';
    
    // Fix options array becoming object issue (padding.options)
    if (obj.options && Array.isArray(obj.options)) {
      obj.options = { values: obj.options };
    }
    
    for (const key in obj) {
      fixInputs(obj[key]);
    }
  }
}

async function main() {
  const configPath = 'cloudcannon.config.yml';
  const configStr = await fs.readFile(configPath, 'utf8');
  const config = yaml.parse(configStr);
  
  // Fix editor default_path
  if (config.editor && !config.editor.default_path) {
    config.editor.default_path = '';
  }
  
  // Fix icons globally
  fixIcons(config);
  
  // Fix inputs in _structures
  if (config._structures) {
    for (const struct of Object.values(config._structures)) {
      if (struct.values && Array.isArray(struct.values)) {
        for (const val of struct.values) {
          if (val._inputs) {
            fixInputs(val._inputs);
          }
        }
      }
    }
  }
  
  await fs.writeFile(configPath, yaml.stringify(config));
  console.log('Fixed cloudcannon.config.yml validation errors');
}

main().catch(console.error);
