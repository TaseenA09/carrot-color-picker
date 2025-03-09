import * as esbuild from 'esbuild'

let result = await esbuild.build({
    entryPoints: ['*.js', '*.css'],
    external: ['*.ttf', '*.html'],
    outdir: './',
})
console.log(result)
