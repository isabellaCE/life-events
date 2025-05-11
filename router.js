import { createRouter, createWebHistory } from 'vue-router';
import telaCapa from './src/telaCapa.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: telaCapa
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router