import { router } from '../router.js';

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
      // Простая инициализация
    },

    methods: {
      // Базовые методы
    }
  });

  app.use(router);
  app.mount('#content');
});