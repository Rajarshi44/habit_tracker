const CACHE_NAME = 'grind-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Periodic Sync or Push Events can be handled here if web-push is implemented.
// For purely local notifications based on timers, we rely on the client or setTimeouts.
// Service Workers in standard web context without Push API rely on the client page keeping them alive, 
// OR the Push API from a backend server. 
// Since everything is fully local, we use message passing to queue scheduled alarms if supported,
// or handle immediate notification requests from the client.

let appSettings = null;
let appSchedule = [];

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'GRIND Notification', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'mark_done') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          client.postMessage({ type: 'MARK_DONE', payload: event.notification.data });
        }
      })
    );
  } else if (event.action === 'skip') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          client.postMessage({ type: 'SKIP', payload: event.notification.data });
        }
      })
    );
  } else if (event.action === 'snooze') {
    setTimeout(() => {
      self.registration.showNotification(event.notification.title, {
        body: event.notification.body,
        icon: '/icon-192x192.png'
      });
    }, 10 * 60 * 1000);
  } else {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, options, delay } = event.data.payload;
    if (delay && delay > 0) {
      setTimeout(() => {
        self.registration.showNotification(title, options);
      }, delay);
    } else {
      self.registration.showNotification(title, options);
    }
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_SETTINGS') {
    appSettings = event.data.settings;
    appSchedule = event.data.schedule;
    console.log('[SW] Settings synced', appSettings);
    
    // In a fully offline PWA without a push-server, we can establish an interval check
    // Note: Chrome limits SW background execution without active push, 
    // so this relies on the app being open or PWA background restrictions.
    scheduleLocalAlarms();
  }
});

function scheduleLocalAlarms() {
  // If the browser supports the draft Notification Triggers API (showTrigger)
  // we would schedule them directly. Otherwise, we rely on the client.
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // If the notification has an action attached
  if (event.action === 'mark_done') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            client.postMessage({ action: 'mark_done_from_sw' });
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  } else if (event.action === 'snooze') {
    // Re-trigger after 10 minutes
    setTimeout(() => {
      self.registration.showNotification('GRIND Snooze', {
        body: '10 minutes passed. Get it done.',
        icon: '/icon-192x192.png',
      });
    }, 10 * 60 * 1000);
  } else {
    // Normal click - open the app to the Today view
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});

self.addEventListener('push', (event) => {
  let data = { title: 'GRIND', body: 'Time to work.' };
  if (event.data) {
    data = event.data.json();
  }
  
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});