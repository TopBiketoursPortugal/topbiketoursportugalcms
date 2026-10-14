import fs from 'fs/promises';
import yaml from 'yaml';

async function main() {
  const configPath = 'cloudcannon.config.yml';
  const settingsPath = '.cloudcannon/initial-site-settings.json';

  // Fix cloudcannon.config.yml
  const configStr = await fs.readFile(configPath, 'utf8');
  const config = yaml.parse(configStr);

  if (config._snippets?.astro_image?.preview?.view) {
    delete config._snippets.astro_image.preview.view;
  }

  await fs.writeFile(configPath, yaml.stringify(config));

  // Fix initial-site-settings.json
  try {
    const settingsStr = await fs.readFile(settingsPath, 'utf8');
    const settings = JSON.parse(settingsStr);

    if (settings.build) {
      if (settings.build.preserveOutput !== undefined)
        delete settings.build.preserveOutput;
      if (settings.build.includeGit !== undefined)
        delete settings.build.includeGit;
    }

    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error('Could not fix initial-site-settings.json', err.message);
  }

  console.log('Fixed final validation errors');
}

main().catch(console.error);
