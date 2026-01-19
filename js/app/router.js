import { login } from './pages/login.js';

// Для остальных страниц создаем заглушки
const stubComponent = {
  template: `<div>Page is under construction</div>`
};

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    { path: '/', name: 'Sign in', component: login },
    { path: '/campaigns', name: 'Campaigns', component: stubComponent },
    { path: '/campaign/:id', name: 'Campaign', component: stubComponent },
    { path: '/users', name: 'Users', component: stubComponent },
    { path: '/user/:id', name: 'User', component: stubComponent },
    { path: '/ads', name: 'Ads', component: stubComponent },
    { path: '/statistics', name: 'Statistics', component: stubComponent },
    { path: '/payments', name: 'Payments', component: stubComponent },
    { path: '/sites', name: 'Sites', component: stubComponent }
  ]
}); 