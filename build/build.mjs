import * as esbuild from 'esbuild'
console.log("Starting esbuild");

let jsresult = await esbuild.build({
    entryPoints: ['src/*.css', 'src/*.js', 'src/*.html'],
    allowOverwrite: true,
    bundle: true,
    minify: true,
    loader: { '.html': 'file', '.ttf': 'file' },
    bundle: true,
    outdir: 'dist',
})

console.log(jsresult)

