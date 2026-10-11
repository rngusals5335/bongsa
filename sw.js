const C="bongsa-v4";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET") return;
  if(new URL(r.url).origin!==location.origin) return; // Google sheet calls and fonts go straight to the network
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(C).then(c=>c.put("./index.html",copy));return res;}).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(C).then(c=>c.put(r,copy));}return res;})));
});
