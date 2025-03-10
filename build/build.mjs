import * as esbuild from 'esbuild'
import { minify } from "html-minifier-terser";
import fs from 'fs';

let result = await esbuild.build({
    entryPoints: ['src/*.js', 'src/*.css'],
    outdir: './dist',
    bundle: true,
    treeShaking: true,
    minify: true,
})

console.log(result)

const inputFile = "./src/index.html";
const outputFile = "./dist/index.html";

const html = fs.readFileSync(inputFile, "utf8");

const minifiedHtml = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeCommentsFromCDATA: true,
    collapseBooleanAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
});

fs.writeFileSync(outputFile, minifiedHtml);

fs.copyFileSync("./src/manifest.json", "./dist/manifest.json");
fs.cpSync("./icons/", "./dist/icons/", { recursive: true });
