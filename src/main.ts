import './app.css'
import App from './App.svelte'
import { todos } from './todoStore';

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
  }
}

const app = new App({
  target: document.getElementById('app'),
})

export default app
