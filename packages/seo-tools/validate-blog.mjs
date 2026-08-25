import { readFileSync, existsSync, globSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
const FM=/^---\r?\n([\s\S]*?)\r?\n---/;
// Every non-default language of the app this runs in (cwd = app root).
const LANGUAGES_DATA=JSON.parse(readFileSync('data/languages.json','utf8'));
const LANGS=Object.values(LANGUAGES_DATA).filter((l)=>!l.isDefault).map((l)=>l.code);
const SKIP=new Set(['id','path','_schema','language','date','author','thumb_image_path','src','featured_image','canonical_url','open_graph_type','tags','relatedPosts','relatedTours']);
const bad=[], stats={};
for (const lang of LANGS){
  let done=0, todo=0;
  for (const file of globSync(`src/content/blog/${lang}/*.mdx`)){
    const src=readFileSync(file,'utf8'); const m=FM.exec(src);
    if(!m){ bad.push([file,'no closing --- (TRUNCATED)']); continue; }
    let fm; try{fm=parseYaml(m[1])??{}}catch(e){ bad.push([file,'YAML: '+e.message.split('\n')[0]]); continue; }
    if(fm.language!==lang) bad.push([file,`language=${fm.language}`]);
    const en=file.replace(`/${lang}/`,'/');
    if(existsSync(en)){
      const em=FM.exec(readFileSync(en,'utf8'));
      const enFm=em?parseYaml(em[1])??{}:{};
      if(fm.id===enFm.id) bad.push([file,'id collides with English']);
      if(fm.path!==enFm.path) bad.push([file,`path changed: ${fm.path}`]);
      // translated? compare title + body
      // The stubs were re-wrapped when the frontmatter was reserialised, so
      // compare normalised text, not bytes — otherwise a verbatim English copy
      // reads as "translated" purely because its line breaks moved.
      const norm=(t)=>t.replace(/\s+/g,' ').trim();
      const body=norm(src.slice(m[0].length));
      const enBody=norm(readFileSync(en,'utf8').slice(em[0].length));
      const same = norm(String(fm.title??''))===norm(String(enFm.title??''))
        && body.slice(0,500)===enBody.slice(0,500);
      if(same) todo++; else done++;
    }
  }
  stats[lang]={done,todo};
}
for(const l of LANGS) console.log(`  ${l}: ${stats[l].done} translated, ${stats[l].todo} still English`);
console.log(`\n${bad.length} structural problem(s)`);
for(const [f,r] of bad.slice(0,20)) console.log(`  ${f.replace('src/content/blog/','')} — ${r}`);
