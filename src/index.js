// import {createApp} from 'vue/dist/vue.esm-bundler.js';
import {createApp} from 'vue';
import App from './App.vue';
// import PrimeVue from 'primevue/config';
// import Dialog from 'primevue/dialog';
const app = createApp(App);

// app.use(PrimeVue);
// app.component('Dialog', Dialog);
app.mount('#app')