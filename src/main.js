import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/router'; // Assuming you have default export in your router.js
import store from './store/store'; // Assuming you have default export in your store.js

// In main.js
const app = createApp(App);

app.use(router);
app.use(store);

// Initialize the store's token
store.commit('INIT_TOKEN');

app.mount('#app');
