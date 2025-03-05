(()=>{var Y=(k,y)=>()=>(y||k((y={exports:{}}).exports,y),y.exports);var Z=Y(()=>{define(["exports"],function(k){"use strict";try{self["workbox:core:7.2.0"]&&_()}catch{}let y=(i,...e)=>{let t=i;return e.length>0&&(t+=` :: ${JSON.stringify(e)}`),t};class l extends Error{constructor(e,t){super(y(e,t)),this.name=e,this.details=t}}try{self["workbox:routing:7.2.0"]&&_()}catch{}let U=i=>i&&typeof i=="object"?i:{handle:i};class m{constructor(e,t,s="GET"){this.handler=U(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=U(e)}}class j extends m{constructor(e,t,s){super(({url:n})=>{let r=e.exec(n.href);if(r&&(n.origin===location.origin||r.index===0))return r.slice(1)},t,s)}}class M{constructor(){this.t=new Map,this.i=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{let{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&e.data.type==="CACHE_URLS"){let{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(n=>{typeof n=="string"&&(n=[n]);let r=new Request(...n);return this.handleRequest({request:r,event:e})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){let s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;let n=s.origin===location.origin,{params:r,route:a}=this.findMatchingRoute({event:t,request:e,sameOrigin:n,url:s}),c=a&&a.handler,h=e.method;if(!c&&this.i.has(h)&&(c=this.i.get(h)),!c)return;let u;try{u=c.handle({url:s,request:e,event:t,params:r})}catch(f){u=Promise.reject(f)}let p=a&&a.catchHandler;return u instanceof Promise&&(this.o||p)&&(u=u.catch(async f=>{if(p)try{return await p.handle({url:s,request:e,event:t,params:r})}catch(w){w instanceof Error&&(f=w)}if(this.o)return this.o.handle({url:s,request:e,event:t});throw f})),u}findMatchingRoute({url:e,sameOrigin:t,request:s,event:n}){let r=this.t.get(s.method)||[];for(let a of r){let c,h=a.match({url:e,sameOrigin:t,request:s,event:n});if(h)return c=h,(Array.isArray(c)&&c.length===0||h.constructor===Object&&Object.keys(h).length===0||typeof h=="boolean")&&(c=void 0),{route:a,params:c}}return{}}setDefaultHandler(e,t="GET"){this.i.set(t,U(e))}setCatchHandler(e){this.o=U(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new l("unregister-route-but-not-found-with-method",{method:e.method});let t=this.t.get(e.method).indexOf(e);if(!(t>-1))throw new l("unregister-route-route-not-registered");this.t.get(e.method).splice(t,1)}}let R,C={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:typeof registration<"u"?registration.scope:""},x=i=>[C.prefix,i,C.suffix].filter(e=>e&&e.length>0).join("-"),O=i=>i||x(C.precache),F=i=>i||x(C.runtime);function N(i,e){let t=e();return i.waitUntil(t),t}try{self["workbox:precaching:7.2.0"]&&_()}catch{}function S(i){if(!i)throw new l("add-to-cache-list-unexpected-type",{entry:i});if(typeof i=="string"){let r=new URL(i,location.href);return{cacheKey:r.href,url:r.href}}let{revision:e,url:t}=i;if(!t)throw new l("add-to-cache-list-unexpected-type",{entry:i});if(!e){let r=new URL(t,location.href);return{cacheKey:r.href,url:r.href}}let s=new URL(t,location.href),n=new URL(t,location.href);return s.searchParams.set("__WB_REVISION__",e),{cacheKey:s.href,url:n.href}}class A{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if(e.type==="install"&&t&&t.originalRequest&&t.originalRequest instanceof Request){let n=t.originalRequest.url;s?this.notUpdatedURLs.push(n):this.updatedURLs.push(n)}return s}}}class D{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:t,params:s})=>{let n=s?.cacheKey||this.h.getCacheKeyForURL(t.url);return n?new Request(n,{headers:t.headers}):t},this.h=e}}let v;async function H(i,e){let t=null;if(i.url&&(t=new URL(i.url).origin),t!==self.location.origin)throw new l("cross-origin-copy-response",{origin:t});let s=i.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},r=e?e(n):n,a=function(){if(v===void 0){let c=new Response("");if("body"in c)try{new Response(c.body),v=!0}catch{v=!1}v=!1}return v}()?s.body:await s.blob();return new Response(a,r)}function E(i,e){let t=new URL(i);for(let s of e)t.searchParams.delete(s);return t.href}class B{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}let I=new Set;try{self["workbox:strategies:7.2.0"]&&_()}catch{}function L(i){return typeof i=="string"?new Request(i):i}class ${constructor(e,t){this.u={},Object.assign(this,t),this.event=t.event,this.l=e,this.p=new B,this.R=[],this.m=[...e.plugins],this.v=new Map;for(let s of this.m)this.v.set(s,{});this.event.waitUntil(this.p.promise)}async fetch(e){let{event:t}=this,s=L(e);if(s.mode==="navigate"&&t instanceof FetchEvent&&t.preloadResponse){let a=await t.preloadResponse;if(a)return a}let n=this.hasCallback("fetchDidFail")?s.clone():null;try{for(let a of this.iterateCallbacks("requestWillFetch"))s=await a({request:s.clone(),event:t})}catch(a){if(a instanceof Error)throw new l("plugin-error-request-will-fetch",{thrownErrorMessage:a.message})}let r=s.clone();try{let a;a=await fetch(s,s.mode==="navigate"?void 0:this.l.fetchOptions);for(let c of this.iterateCallbacks("fetchDidSucceed"))a=await c({event:t,request:r,response:a});return a}catch(a){throw n&&await this.runCallbacks("fetchDidFail",{error:a,event:t,originalRequest:n.clone(),request:r.clone()}),a}}async fetchAndCachePut(e){let t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){let t=L(e),s,{cacheName:n,matchOptions:r}=this.l,a=await this.getCacheKey(t,"read"),c=Object.assign(Object.assign({},r),{cacheName:n});s=await caches.match(a,c);for(let h of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await h({cacheName:n,matchOptions:r,cachedResponse:s,request:a,event:this.event})||void 0;return s}async cachePut(e,t){let s=L(e);var n;await(n=0,new Promise(o=>setTimeout(o,n)));let r=await this.getCacheKey(s,"write");if(!t)throw new l("cache-put-with-no-response",{url:(a=r.url,new URL(String(a),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var a;let c=await this.q(t);if(!c)return!1;let{cacheName:h,matchOptions:u}=this.l,p=await self.caches.open(h),f=this.hasCallback("cacheDidUpdate"),w=f?await async function(o,d,b,q){let W=E(d.url,b);if(d.url===W)return o.match(d,q);let z=Object.assign(Object.assign({},q),{ignoreSearch:!0}),X=await o.keys(d,z);for(let T of X)if(W===E(T.url,b))return o.match(T,q)}(p,r.clone(),["__WB_REVISION__"],u):null;try{await p.put(r,f?c.clone():c)}catch(o){if(o instanceof Error)throw o.name==="QuotaExceededError"&&await async function(){for(let d of I)await d()}(),o}for(let o of this.iterateCallbacks("cacheDidUpdate"))await o({cacheName:h,oldResponse:w,newResponse:c.clone(),request:r,event:this.event});return!0}async getCacheKey(e,t){let s=`${e.url} | ${t}`;if(!this.u[s]){let n=e;for(let r of this.iterateCallbacks("cacheKeyWillBeUsed"))n=L(await r({mode:t,request:n,event:this.event,params:this.params}));this.u[s]=n}return this.u[s]}hasCallback(e){for(let t of this.l.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(let s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(let t of this.l.plugins)if(typeof t[e]=="function"){let s=this.v.get(t);yield r=>{let a=Object.assign(Object.assign({},r),{state:s});return t[e](a)}}}waitUntil(e){return this.R.push(e),e}async doneWaiting(){let e;for(;e=this.R.shift();)await e}destroy(){this.p.resolve(null)}async q(e){let t=e,s=!1;for(let n of this.iterateCallbacks("cacheWillUpdate"))if(t=await n({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&t.status!==200&&(t=void 0),t}}class G{constructor(e={}){this.cacheName=F(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){let[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});let t=e.event,s=typeof e.request=="string"?new Request(e.request):e.request,n="params"in e?e.params:void 0,r=new $(this,{event:t,request:s,params:n}),a=this.U(r,s,t);return[a,this.L(a,r,s,t)]}async U(e,t,s){let n;await e.runCallbacks("handlerWillStart",{event:s,request:t});try{if(n=await this._(t,e),!n||n.type==="error")throw new l("no-response",{url:t.url})}catch(r){if(r instanceof Error){for(let a of e.iterateCallbacks("handlerDidError"))if(n=await a({error:r,event:s,request:t}),n)break}if(!n)throw r}for(let r of e.iterateCallbacks("handlerWillRespond"))n=await r({event:s,request:t,response:n});return n}async L(e,t,s,n){let r,a;try{r=await e}catch{}try{await t.runCallbacks("handlerDidRespond",{event:n,request:s,response:r}),await t.doneWaiting()}catch(c){c instanceof Error&&(a=c)}if(await t.runCallbacks("handlerDidComplete",{event:n,request:s,response:r,error:a}),t.destroy(),a)throw a}}class g extends G{constructor(e={}){e.cacheName=O(e.cacheName),super(e),this.C=e.fallbackToNetwork!==!1,this.plugins.push(g.copyRedirectedCacheableResponsesPlugin)}async _(e,t){return await t.cacheMatch(e)||(t.event&&t.event.type==="install"?await this.O(e,t):await this.N(e,t))}async N(e,t){let s,n=t.params||{};if(!this.C)throw new l("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{let r=n.integrity,a=e.integrity,c=!a||a===r;s=await t.fetch(new Request(e,{integrity:e.mode!=="no-cors"?a||r:void 0})),r&&c&&e.mode!=="no-cors"&&(this.k(),await t.cachePut(e,s.clone()))}return s}async O(e,t){this.k();let s=await t.fetch(e);if(!await t.cachePut(e,s.clone()))throw new l("bad-precaching-response",{url:e.url,status:s.status});return s}k(){let e=null,t=0;for(let[s,n]of this.plugins.entries())n!==g.copyRedirectedCacheableResponsesPlugin&&(n===g.defaultPrecacheCacheabilityPlugin&&(e=s),n.cacheWillUpdate&&t++);t===0?this.plugins.push(g.defaultPrecacheCacheabilityPlugin):t>1&&e!==null&&this.plugins.splice(e,1)}}g.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:i})=>!i||i.status>=400?null:i},g.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:i})=>i.redirected?await H(i):i};class V{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this.K=new Map,this.T=new Map,this.W=new Map,this.l=new g({cacheName:O(e),plugins:[...t,new D({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this.l}precache(e){this.addToCacheList(e),this.j||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this.j=!0)}addToCacheList(e){let t=[];for(let s of e){typeof s=="string"?t.push(s):s&&s.revision===void 0&&t.push(s.url);let{cacheKey:n,url:r}=S(s),a=typeof s!="string"&&s.revision?"reload":"default";if(this.K.has(r)&&this.K.get(r)!==n)throw new l("add-to-cache-list-conflicting-entries",{firstEntry:this.K.get(r),secondEntry:n});if(typeof s!="string"&&s.integrity){if(this.W.has(n)&&this.W.get(n)!==s.integrity)throw new l("add-to-cache-list-conflicting-integrities",{url:r});this.W.set(n,s.integrity)}if(this.K.set(r,n),this.T.set(r,a),t.length>0){let c=`Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(c)}}}install(e){return N(e,async()=>{let t=new A;this.strategy.plugins.push(t);for(let[r,a]of this.K){let c=this.W.get(a),h=this.T.get(r),u=new Request(r,{integrity:c,cache:h,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:a},request:u,event:e}))}let{updatedURLs:s,notUpdatedURLs:n}=t;return{updatedURLs:s,notUpdatedURLs:n}})}activate(e){return N(e,async()=>{let t=await self.caches.open(this.strategy.cacheName),s=await t.keys(),n=new Set(this.K.values()),r=[];for(let a of s)n.has(a.url)||(await t.delete(a),r.push(a.url));return{deletedURLs:r}})}getURLsToCacheKeys(){return this.K}getCachedURLs(){return[...this.K.keys()]}getCacheKeyForURL(e){let t=new URL(e,location.href);return this.K.get(t.href)}getIntegrityForCacheKey(e){return this.W.get(e)}async matchPrecache(e){let t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(e){let t=this.getCacheKeyForURL(e);if(!t)throw new l("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=Object.assign({cacheKey:t},s.params),this.strategy.handle(s))}}let K,P=()=>(K||(K=new V),K);class J extends m{constructor(e,t){super(({request:s})=>{let n=e.getURLsToCacheKeys();for(let r of function*(a,{ignoreURLParametersMatching:c=[/^utm_/,/^fbclid$/],directoryIndex:h="index.html",cleanURLs:u=!0,urlManipulation:p}={}){let f=new URL(a,location.href);f.hash="",yield f.href;let w=function(o,d=[]){for(let b of[...o.searchParams.keys()])d.some(q=>q.test(b))&&o.searchParams.delete(b);return o}(f,c);if(yield w.href,h&&w.pathname.endsWith("/")){let o=new URL(w.href);o.pathname+=h,yield o.href}if(u){let o=new URL(w.href);o.pathname+=".html",yield o.href}if(p){let o=p({url:f});for(let d of o)yield d.href}}(s.url,t)){let a=n.get(r);if(a)return{cacheKey:a,integrity:e.getIntegrityForCacheKey(a)}}},e.strategy)}}function Q(i){let e=P();(function(t,s,n){let r;if(typeof t=="string"){let a=new URL(t,location.href);r=new m(({url:c})=>c.href===a.href,s,n)}else if(t instanceof RegExp)r=new j(t,s,n);else if(typeof t=="function")r=new m(t,s,n);else{if(!(t instanceof m))throw new l("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});r=t}(R||(R=new M,R.addFetchListener(),R.addCacheListener()),R).registerRoute(r)})(new J(e,i))}k.precacheAndRoute=function(i,e){(function(t){P().precache(t)})(i),Q(e)}})});Z();})();
