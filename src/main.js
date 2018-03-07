import App from './App.html';
import { Store } from 'svelte/store.js';

const store = new Store({
  info: {},
  name: 'H801',
  PWM: {
    duration: 1.0,
    autoPost: true,
  },
  Color: {
    duration: 1.0,
    autoPost: true,
  }
});

/*const app = */ new App({
  target: document.body,
  store
});

window.store = store;
