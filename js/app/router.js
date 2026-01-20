// Вместо импортов - используем глобальные переменные

// Если компоненты будут определены в app.js
const routes = [
  { path: '/', name: 'Sign in', component: null }, // будет заменено
  { path: '/campaigns', name: 'Campaigns', component: null },
  { path: '/campaign/:id', name: 'Campaign', component: null },
  { path: '/users', name: 'Users', component: null },
  { path: '/user/:id', name: 'User', component: null },
  { path: '/ads', name: 'Ads', component: null },
  { path: '/statistics', name: 'Statistics', component: null },
  { path: '/payments', name: 'Payments', component: null },
  { path: '/sites', name: 'Sites', component: null }
];

// Создаем роутер и делаем его глобальным
window.router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

// Функция для обновления компонентов (будет вызвана из app.js)
window.setRouteComponents = function(components) {
  window.router.removeRoute('/');
  window.router.addRoute({ path: '/', name: 'Sign in', component: components.login });
  window.router.addRoute({ path: '/campaigns', name: 'Campaigns', component: components.campaigns });
  window.router.addRoute({ path: '/campaign/:id', name: 'Campaign', component: components.campaign });
  window.router.addRoute({ path: '/users', name: 'Users', component: components.users });
  window.router.addRoute({ path: '/user/:id', name: 'User', component: components.user });
  window.router.addRoute({ path: '/ads', name: 'Ads', component: components.ads });
  window.router.addRoute({ path: '/statistics', name: 'Statistics', component: components.statistics });
  window.router.addRoute({ path: '/payments', name: 'Payments', component: components.payments });
  window.router.addRoute({ path: '/sites', name: 'Sites', component: components.sites });
};