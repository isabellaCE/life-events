import { createRouter, createWebHistory } from 'vue-router';
import telaCapa from './src/telaCapa.vue';
import selecaoSemana from './src/selecaoSemana.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: telaCapa
  },
  {
    path: '/selecao-semana',
    name: 'SelecaoSemana',
    component: selecaoSemana
  },
  {
    path: '/exibicao',
    name: 'Exibicao',
    component: () => import('./src/exibicao.vue')
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
