// 節気帖 service worker -- cache-first, fully offline after first load.
// All URLs below are relative to this file's own scope so the site keeps
// working when hosted under a sub-path (e.g. https://host/sekkicho/).

var CACHE_NAME = "sekkicho-cache-v5";

var PRECACHE_URLS = [
  "./",
  "./index.html",
  "./koyomi.html",
  "./sekki.html",
  "./about.html",
  "./404.html",
  "./manifest.json",
  "./assets/css/style.css",
  "./assets/js/data.js",
  "./assets/js/koyomi.js",
  "./assets/js/i18n.js",
  "./assets/js/common.js",
  "./assets/js/wheel.js",
  "./assets/js/affiliate.js",
  "./assets/js/page-index.js",
  "./assets/js/page-koyomi.js",
  "./assets/js/page-sekki.js",
  "./assets/icons/icon.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(function () {
        // No cache hit and no network (fully offline, uncached URL): there is
        // nothing sensible to return, so let the request fail naturally.
        return caches.match("./index.html");
      });
    })
  );
});
