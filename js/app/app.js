import { router } from './router.js';
import { header } from './widgets/header.js';
import { search } from './widgets/search.js';
import { popup } from './widgets/popup.js';
import { msg } from './widgets/msg.js';
import { toogle } from './widgets/toogle.js';
import { img } from './widgets/img.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = Vue.createApp({
    data() {
      return {
        url: "https://affiliate.yanbasok.com",
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

        router.isReady().then(() => {
          const path = this.$route.path;
          const isAdmin = this.user?.type === 'admin';

          const adminPages = ['/campaigns', '/campaign', '/users', '/user'];
          const userPages = ['/statistics', '/payments', '/sites'];
          const allPages = [...adminPages, ...userPages];

          // не залогінений
          if (!this.user?.type) {
            if (path !== '/') this.$router.replace('/');
            return;
          }

          // admin → /
          if (path === '/' && isAdmin) {
            this.$router.replace('/campaigns');
            return;
          }

          // user → admin pages
          if (adminPages.includes(path) && !isAdmin) {
            this.$router.replace('/statistics');
            return;
          }

          // admin → user pages
          if (userPages.includes(path) && isAdmin) {
            this.$router.replace('/campaigns');
            return;
          }

          // дозволені сторінки
          if (allPages.includes(path)) return;

          // все інше
          this.$router.replace('/');
        });
      },

      page(path = '') {
        if (path && this.$route.path !== path) {
          this.$router.replace(path);
        }

        this.title = this.$route.name || '';
        document.title = this.title;
      },

      logout() {
        this.user = {
          name: "",
          phone: "",
          email: "",
          date: "",
          auth: ""
        };

        localStorage.removeItem('user');
        this.page('/');
      },

      scrollTop() {
        setTimeout(() => {
          window.scroll({
            top: 0,
            behavior: 'smooth'
          });
        }, 50);
      },

      scrollBottom() {
        setTimeout(() => {
          window.scroll({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }, 50);
      },

      toFormData(obj) {
        const fd = new FormData();

        for (const x in obj) {
          if (typeof obj[x] === 'object' && x !== 'img' && x !== 'copy') {
            for (const y in obj[x]) {
              if (typeof obj[x][y] === 'object') {
                for (const z in obj[x][y]) {
                  fd.append(`${x}[${y}][${z}]`, obj[x][y][z]);
                }
              } else {
                fd.append(`${x}[${y}]`, obj[x][y]);
              }
            }
          } else if (x !== 'copy') {
            fd.append(x, obj[x]);
          }
        }

        return fd;
      }
    }
  });

  app.use(router);

  app.component('app-header', header);
  app.component('app-search', search);
  app.component('app-popup', popup);
  app.component('app-msg', msg);
  app.component('app-toogle', toogle);
  app.component('app-img', img);

  app.mount('#content');
});

