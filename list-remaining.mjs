import { readFileSync, existsSync, globSync, writeFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
const FM=/^---\r?\n([\s\S]*?)\r?\n---/;
const norm=(t)=>t.replace(/\s+/g,' ').trim();
const out={};
for (const lang of ['de','es','fr','nl']){
  const todo=[];
  for (const file of globSync(`src/content/blog/${lang}/*.mdx`)){
    const src=readFileSync(file,'utf8'); const m=FM.exec(src); if(!m) continue;
    let fm; try{fm=parseYaml(m[1])??{}}catch{continue}
    const en=file.replace(`/${lang}/`,'/'); if(!existsSync(en))continue;
    const enSrc=readFileSync(en,'utf8'); const em=FM.exec(enSrc);
    const enFm=em?parseYaml(em[1])??{}:{};
    const body=norm(src.slice(m[0].length)), enBody=norm(enSrc.slice(em[0].length));
    if(norm(String(fm.title??''))===norm(String(enFm.title??'')) && body.slice(0,500)===enBody.slice(0,500))
      todo.push(file.split('/').pop());
  }
  out[lang]=todo.sort();
  console.log(`${lang}: ${todo.length} remaining`);
}
writeFileSync('/tmp/remaining.json', JSON.stringify(out,null,1));
