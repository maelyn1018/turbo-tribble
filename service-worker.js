// Service Worker - 日程管理 PWA
const CACHE_VERSION = 'v20';
const CACHE_NAME = `schedule-app-${CACHE_VERSION}`;

// 需要缓存的静态资源列表（使用相对路径，兼容子目录部署）
const STATIC_ASSETS = [
  './index.html',
  './schedule_app.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

// ===== 安装阶段：预缓存所有静态资源 =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      // 使用 no-cors 避免因某些资源 CORS 问题导致安装失败
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Some assets failed to cache:', err);
        // 逐个缓存，允许部分失败
        const promises = STATIC_ASSETS.map((url) =>
          cache.add(url).catch((e) => console.warn(`[SW] Failed to cache: ${url}`, e))
        );
        return Promise.all(promises);
      });
    })
  );
  // 跳过等待，立即激活
  self.skipWaiting();
});

// ===== 激活阶段：清理旧版本缓存 =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('schedule-app-') && name !== CACHE_NAME)
          .map((name) => {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    })
  );
  // 立即接管所有客户端
  self.clients.claim();
});

// ===== 请求拦截：缓存优先策略 =====
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  // 忽略非 http/https 请求
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // 缓存命中：返回缓存，同时后台更新缓存（stale-while-revalidate）
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {});

        return cachedResponse;
      }

      // 缓存未命中：从网络获取并缓存
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // 离线回退：对于导航请求，返回缓存的 HTML 页面
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        // 其他资源返回空响应
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});

// ===== 监听消息：支持手动触发更新 =====
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('schedule-app-'))
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // 重新缓存
      caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(STATIC_ASSETS);
      });
    });
  }
});

