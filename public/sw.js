const cacheName = "unbox-static-v1";
const filesToCache = [
	"./",
	"./index.html",
	"manifest.json",
	"https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
	"./css/style.css",
	"./js/app.js",
	"./images/unbox-icon.png",
	"./images/unbox-logo.png",
	"./images/image_unavailable.jpeg",
	"./images/icons/icon-72x72.png",
	"./images/icons/icon-96x96.png",
	"./images/icons/icon-128x128.png",
	"./images/icons/icon-144x144.png",
	"./images/icons/icon-152x152.png",
	"./images/icons/icon-192x192.png",
	"./images/icons/icon-384x384.png",
	"./images/icons/icon-512x512.png",
	"./images/cartoon.jpeg",
	"./fallback.json"
];


self.addEventListener('install', async e => {
	//console.log("[sw installed]", e);
	e.waitUntil(
		caches.open(cacheName)
		.then(cache => {
			cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('activate', e => {
	//console.log("[sw activated]", e);
});

self.addEventListener('fetch', e => {
	const request = e.request;
	const url = new URL(request.url);
	if(url.origin === location.origin){
		e.respondWith(cacheFirst(request)); 
	}else{
		e.respondWith(networkFirst(request));
	}
});

async function cacheFirst(request) {
	const cachedResponse = await caches.match(request);
	return cachedResponse || fetch(request);
}

async function networkFirst(request) {
	const mycache = await caches.open('unbox-dynamic-v1');

	try {
		const response = await fetch(request);
		mycache.put(request, response.clone());
		return response;
	} catch (error) {
		const cachedResponsetwo  = await caches.match(request);
		return cachedResponsetwo || await caches.match("./fallback.json")
	}
}
/*

const workboxSW = new WorkboxSW();
workboxSW.precache(filesToCache);

workboxSW.router.registerRoute('https://newsapi.org/(.*)', workboxSW.strategies.networkFirst());
workboxSW.router.registerRoute(/.*\.(jpeg|png|jpg|gif)/, workboxSW.strategies.cacheFirst({
	cacheName: "unbox-static-images",
	cacheExpiration: {maxEntries: 100},
	cacheableResponse: {statuses: [0, 200] } 
}));
*/
