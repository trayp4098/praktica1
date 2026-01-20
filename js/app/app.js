// Определяем все компоненты здесь
const login = {
  data() {
    return {
      img: 1,
      hs: 0,
      email: 'test@example.com',
      password: '123456'
    };
  },

  mounted() {
    this.img = Math.floor(Math.random() * 7) + 1;
  },

  methods: {
    handleLogin() {
      // Тестовый вход
      const user = {
        name: "Тестовый пользователь",
        email: this.email,
        phone: "+380001112233",
        date: new Date().toISOString(),
        auth: "test-token-" + Date.now(),
        type: "user"
      };
      localStorage.setItem('user', JSON.stringify(user));
      
      // Обновляем user в основном приложении
      if (window.mainApp) {
        window.mainApp.user = user;
        window.mainApp.$router.push('/statistics');
      }
    }
  },

  template: `
    <div class="login-page">
      <div class="login-container">
        <h2>Вход в систему</h2>
        <p>Изображение: {{ img }}</p>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="email" required>
          </div>
          <div class="form-group">
            <label>Пароль:</label>
            <input type="password" v-model="password" required>
          </div>
          <button type="submit">Войти (тестовый)</button>
        </form>
        <p style="margin-top: 20px; color: #666;">
          Для демонстрации используйте любые данные
        </p>
      </div>
    </div>
  `
};

// Остальные компоненты (упрощенные версии)
const campaigns = {
  template: `<div class="page"><h2>Кампании</h2><p>Страница в разработке</p></div>`
};
const campaign = {
  template: `<div class="page"><h2>Кампания</h2><p>ID: {{ $route.params.id }}</p></div>`
};
const users = {
  template: `<div class="page"><h2>Пользователи</h2><p>Только для администраторов</p></div>`
};
const user = {
  template: `<div class="page"><h2>Профиль</h2><p>ID пользователя: {{ $route.params.id }}</p></div>`
};
const ads = {
  template: `<div class="page"><h2>Реклама</h2><p>Рекламные материалы</p></div>`
};
const statistics = {
  template: `<div class="page"><h2>Статистика</h2><p>Ваша статистика здесь</p><button @click="logout">Выйти</button></div>`,
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/');
    }
  }
};
const payments = {
  template: `<div class="page"><h2>Платежи</h2><p>История платежей</p></div>`
};
const sites = {
  template: `<div class="page"><h2>Сайты</h2><p>Ваши сайты</p></div>`
};

// Компоненты widgets
const header = {
  template: `<header class="app-header"><h1>Affiliate Panel</h1><nav><slot></slot></nav></header>`
};
const search = {
  template: `<div class="search"><input placeholder="Поиск..."></div>`
};
const popup = {
  template: `<div class="popup" v-if="show"><slot></slot></div>`,
  props: ['show']
};
const msg = {
  template: `<div class="msg" :class="type">{{text}}</div>`,
  props: ['text', 'type']
};
const toogle = {
  template: `<label class="toggle"><input type="checkbox" :checked="value"></label>`,
  props: ['value']
};
const img = {
  template: `<img :src="src" :alt="alt">`,
  props: ['src', 'alt']
};

// Главное приложение
document.addEventListener('DOMContentLoaded', function() {
  // Обновляем компоненты в роутере
  if (window.setRouteComponents) {
    window.setRouteComponents({
      login, campaigns, campaign, users, user, ads, statistics, payments, sites
    });
  }
  
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
        },
        formData: {},
        title: "",
        date: "",
        time: ""
      };
    },

    watch: {
      '$route.path'() {
        this.init();
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        const userLS = localStorage.getItem('user');
        if (userLS) {
          this.user = JSON.parse(userLS);
        }
        
        // Простая навигация
        const path = this.$route.path;
        const isAdmin = this.user?.type === 'admin';
        
        if (!this.user?.type && path !== '/') {
          this.$router.replace('/');
        }
      },

      logout() {
        this.user = { name: "", phone: "", email: "", date: "", auth: "" };
        localStorage.removeItem('user');
        this.$router.replace('/');
      }
    }
  });

  // Используем глобальный роутер
  if (window.router) {
    app.use(window.router);
  }

  // Регистрируем компоненты
  app.component('app-header', header);
  app.component('app-search', search);
  app.component('app-popup', popup);
  app.component('app-msg', msg);
  app.component('app-toogle', toogle);
  app.component('app-img', img);

  // Делаем приложение глобальным для доступа из компонентов
  window.mainApp = app.mount('#content');
});