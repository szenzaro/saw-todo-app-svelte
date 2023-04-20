import './app.css'
import App from './App.svelte'
import { todos } from './todoStore';

Notification.requestPermission(permission => {
  if (permission === 'granted') {

  }
  else console.error("Permission was not granted.")
})

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(serviceWorker => {
      console.log("Service Worker registered: ", serviceWorker);
    })
    .catch(error => {
      console.error("Error registering the Service Worker: ", error);
    });

  navigator.serviceWorker.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message && message.type.includes('/api/v1/todos')) {
      console.log("Updated todos from web worker", message.data)
      todos.set(message.data)
    }

    if (message && message.type === 'notification test') {
      sendNotification(message.data);
    }
  }
}

function sendNotification(message: string) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    const notification = new Notification(message);
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification(message);
        // …
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}

const app = new App({
  target: document.getElementById('app'),
})

export default app

sendNotification('hi')
