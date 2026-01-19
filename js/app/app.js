import { router } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = Vue.createApp({
    data() {
      return {
        url: "http://affiliate.kolchin.com",
        user: {
          name: "",
          phone: "",
          email: "",
          date: "",
          auth: ""
        }
      };
    },

    mounted() {
      // Просто инициализация без сложной логики
    },

    methods: {
      // Базовые методы
    }
  });

  // Используем только роутер
  app.use(router);

  // Монтируем приложение
  app.mount('#content');
});