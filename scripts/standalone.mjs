import {readFileSync,writeFileSync} from 'node:fs';import {resolve,dirname} from 'node:path';
let html=readFileSync('dist/index.html','utf8');const js=html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/)[1];const css=html.match(/<link[^>]*href="([^"]+\.css)"[^>]*>/)[1];const jsPath=resolve('dist',js),cssPath=resolve('dist',css);const data=p=>'data:image/png;base64,'+readFileSync(p).toString('base64');
let style=readFileSync(cssPath,'utf8').replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(all,q,u)=>u.startsWith('data:')?all:`url("${data(resolve(dirname(cssPath),u))}")`);
let script=readFileSync(jsPath,'utf8');
// Vite rewrites new URL asset references to the image basename in this bundle.
script=script.replace(/(["'`])([^"'`]+\.png)\1/g,(all,q,u)=>{try{return JSON.stringify(data(resolve(dirname(jsPath),u)))}catch{return all}});
html=html.replace(/<script[^>]*src="[^"]+"[^>]*><\/script>/,'').replace(/<link[^>]*href="[^"]+\.css"[^>]*>/,()=>`<style>${style}</style>`).replace('</body>',()=>`<script type="module">${script.replaceAll('</script','<\\/script')}</script></body>`);
writeFileSync('PLAY-VIGHNAHARTA-FESTIVAL.html',html);console.log('Standalone HTML created:',Buffer.byteLength(html),'bytes');
