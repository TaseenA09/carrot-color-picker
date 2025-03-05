importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.4.0/workbox-sw.js');

// import {build, files} from '$service-worker';

const precache_list = [
  "./",
  "./colorFunctions/common.js",
  "./colorFunctions/hsl.js",
  "./colorFunctions/hsv.js",
  "./colorFunctions/main.js",
  "./colorFunctions/okhsl.js",
  "./colorFunctions/okhsv.js",
  "./colors.css",
  "./fonts/JetBrainsMono-Italic[wght].ttf",
  "./fonts/JetBrainsMono[wght].ttf",
  "./icons/copy.svg",
  "./icons/export.svg",
  "./icons/icon.svg",
  "./icons/iconcolor.svg",
  "./icons/import.svg",
  "./icons/locked.svg",
  "./icons/palette.svg",
  "./icons/shuffle.svg",
  "./icons/unlocked.svg",
  "./icons/warn.svg",
  "./index.html",
  "./LICENSE",
  "./manifest.json",
  "./README.md",
  "./script.js",
  "./service-worker.js",
  "./styles.css",
  "./theme.css"
].map((s) => ({
  url: s,
  revision: 1
}));

workbox.precaching.precacheAndRoute(precache_list);



//workbox.setConfig({
//    modulePathPrefix: '/third_party/workbox/workbox-v7.1.0/',
//  });

//workbox.routing.registerRoute(
//    () => true,
//    new workbox.strategies.CacheFirst()
//)

// workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
