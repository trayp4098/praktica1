export const campaigns = {
  data() {
    return {
      parent: "",
      data: {},
      details: {},
      date: "",
      date2: "",
      q: "",
      sort: "",
      loader: 1,
      id: 0,
      type: 0,
      all: true,
      toggleStates: {}
    }
  },

  mounted() {
    this.parent = this.$parent.$parent;
    if (!this.parent.user) {
      this.parent.logout();
    }

    this.get();
    this.GetFirstAndLastDate();
    this.loadToggleStates();
  },

  methods: {
    GetFirstAndLastDate() {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();

      const firstDay = new Date(year, month, 2);
      const lastDay = new Date(year, month + 1, 1);

      this.date = firstDay.toISOString().substring(0, 10);
      this.date2 = lastDay.toISOString().substring(0, 10);
    },

    get() {
      const data = this.parent.toFormData(this.parent.formData);

      if (this.date) data.append("date", this.date);
      if (this.date2) data.append("date2", this.date2);

      this.loader = 1;

      axios
        .post(
          this.parent.url + "/site/getCampaigns?auth=" + this.parent.user.auth,
          data
        )
        .then(res => {
          this.data = res.data;
          this.loader = 0;
          
          if (this.data.items) {
            this.data.items.forEach(item => {
              if (!this.toggleStates[item.id]) {
                const savedState = this.getSavedToggleState(item.id);
                this.toggleStates[item.id] = savedState || "0";
              }
            });
          }
        })
        .catch(() => {
          this.parent.logout();
        });
    },

    del: async function () {
      if (
        await this.$root.$refs.msg.confirmFun(
          "Do you want to delete this campaign?"
        )
      ) {
        var self = this;
        var data = self.parent.toFormData(self.parent.formData);

        axios.post(this.parent.url + "/site/deleteCampaign?auth=" + this.parent.user.auth, data)
          .then(function(response) {
            self.$root.$refs.msg.successFun("Successfully deleted campaign!");
            self.get();
          })
          .catch(function(error) {
            console.log('errors : ', error);
          });
      }
    },

    getDetails(id, type) {
      this.id = id;
      this.type = type;
      console.log("getDetails:", id, type);
    },
    
    // ФУНКЦИЯ ДЛЯ СОЗДАНИЯ/РЕДАКТИРОВАНИЯ КАМПАНИИ
    action: function () {
      var self = this;

      self.parent.formData.copy = ""; // Очищаем поле copy если есть
      var data = self.parent.toFormData(self.parent.formData);

      axios
        .post(
          this.parent.url + "/site/actionCampaign?auth=" + this.parent.user.auth,
          data
        )
        .then(function (response) {
          self.$refs.new.active = 0;

          if (self.parent.formData.id) {
            self.$root.$refs.msg.successFun(
              "Successfully updated campaign!"
            );
          } else {
            self.$root.$refs.msg.successFun(
              "Successfully added new campaign!"
            );
          }

          self.parent.formData = {}; // Очищаем форму после успешного действия
          self.get(); // Обновляем список кампаний
        })
        .catch(function (error) {
          console.log("errors :", error);
          self.$root.$refs.msg.alertFun("Error saving campaign");
        });
    },
    
    // Функция для открытия формы редактирования
    editCampaign(item) {
      this.parent.formData = { ...item }; // Копируем данные кампании в форму
      this.$refs.new.active = 1;
    },
    
    // Функция для открытия формы создания новой кампании
    createNewCampaign() {
      this.parent.formData = {}; // Очищаем форму
      this.$refs.new.active = 1;
    },
    
    onToggleChange(campaignId, value) {
      this.toggleStates[campaignId] = value;
      this.saveToggleState(campaignId, value);
      
      // Вызываем toggleAction для сохранения статуса на сервере
      this.toggleAction(campaignId, value);
    },
    
    // ОТДЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ПЕРЕКЛЮЧЕНИЯ СТАТУСА
    toggleAction: function (campaignId, value) {
      var self = this;
      
      // Создаем formData с ID кампании и новым статусом
      var data = self.parent.toFormData({
        id: campaignId,
        status: value // "1" или "0"
      });

      axios
        .post(
          this.parent.url + "/site/actionCampaign?auth=" + this.parent.user.auth,
          data
        )
        .then(function (response) {
          // Успешное обновление
          console.log("Campaign status updated:", campaignId, value);
        })
        .catch(function (error) {
          console.log("errors :", error);
          
          // В случае ошибки отменяем изменение в UI
          const previousValue = value === "1" ? "0" : "1";
          self.toggleStates[campaignId] = previousValue;
          self.saveToggleState(campaignId, previousValue);
          
          // Показываем ошибку пользователю
          self.$root.$refs.msg.alertFun("Failed to update campaign status");
        });
    },
    
    saveToggleState(campaignId, value) {
      try {
        const key = `toggle_${this.parent.user?.auth}_${campaignId}`;
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error saving toggle state:', error);
      }
    },
    
    getSavedToggleState(campaignId) {
      try {
        const key = `toggle_${this.parent.user?.auth}_${campaignId}`;
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error loading toggle state:', error);
        return null;
      }
    },
    
    loadToggleStates() {
      try {
        if (!this.parent.user?.auth) return;
        
        const prefix = `toggle_${this.parent.user.auth}_`;
        const savedStates = {};
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith(prefix)) {
            const campaignId = key.replace(prefix, '');
            savedStates[campaignId] = localStorage.getItem(key);
          }
        }
        
        this.toggleStates = { ...this.toggleStates, ...savedStates };
      } catch (error) {
        console.error('Error loading toggle states:', error);
      }
    }
  },

  computed: {
    reversedItems() {
      if (!this.data.items) return [];
      return [...this.data.items].reverse();
    }
  },

  template: `
  <div class="inside-content">
    <!-- Хедер -->
    <header-component></header-component>

    <!-- Основной контент -->
    <div class="campaigns-content">
      <!-- Контейнер для кнопки New, заголовка и дат -->
      <div class="header-and-dates-container">
        <!-- Кнопка New слева -->
        <div class="campaigns-header-left">
          <button class="new-btn" @click="createNewCampaign()">
            <i class="fas fa-plus"></i> New
          </button>
        </div>
        
        <!-- Фильтры дат по центру -->
        <div class="date-filters-wrapper">
          <input type="date" v-model="date" @change="get()" />
          <span class="date-separator">-</span>
          <input type="date" v-model="date2" @change="get()" />
        </div>
        
        <!-- Заголовок Campaigns справа -->
        <div class="campaigns-header-right">
          <h1>Campaigns</h1>
        </div>
      </div>

      <div v-if="loader" id="spinner"></div>

      <div class="table" v-if="data.items && data.items.length">
        <table>
          <thead>
            <tr>
              <th class="actions">Actions</th>
              <th class="id">Fraud Clicks</th>
              <th class="id">Leads</th>
              <th class="id">Clicks</th>
              <th class="id">Views</th>
              <th class="title">Title</th>
              <th class="toggle">Status</th>
              <th class="id">#</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in reversedItems" :key="item.id">
              <td class="actions">
                <a href="#" @click.prevent="parent.formData = item; del();">
                  <i class="fa-solid fa-trash-can"></i>
                </a>
              </td>
              
              <td class="id">
                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 4)">
                  <span :class="{ bold: item.fclicks > 0 }">{{ item.fclicks || 0 }}</span>
                </a>
              </td>
              
              <td class="id">
                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 3)">
                  <span :class="{ bold: item.leads > 0 }">{{ item.leads || 0 }}</span>
                </a>
              </td>
              
              <td class="id">
                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 2)">
                  <span :class="{ bold: item.clicks > 0 }">{{ item.clicks || 0 }}</span>
                </a>
              </td>
              
              <td class="id">
                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 1)">
                  <span :class="{ bold: item.views > 0 }">{{ item.views || 0 }}</span>
                </a>
              </td>
              
              <td class="title">
                <router-link :to="'/campaign/' + item.id">
                  {{ item.title }}
                </router-link>
              </td>
              
              <td class="toggle">
                <toogle 
                  v-model="toggleStates[item.id]"
                  @update:modelValue="(val) => onToggleChange(item.id, val)"
                ></toogle>
              </td>
              
              <td class="id">{{ item.id }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty" v-else>No items</div>
    </div>

    <!-- Попап для создания/редактирования кампании -->
    <popup
      ref="new"
      :title="(parent.formData && parent.formData.id) ? 'Edit Campaign' : 'New Campaign'"
    >
      <div class="form inner-form">
        <form @submit.prevent="action()" v-if="parent.formData">
          <div class="row">
            <label>Name</label>
            <input
              type="text"
              v-model="parent.formData.title"
              required
              placeholder="Enter campaign name"
            >
          </div>

          <div class="row">
            <button
              class="btn"
              v-if="parent.formData && parent.formData.id"
            >
              Edit
            </button>
            <button
              class="btn"
              v-if="parent.formData && !parent.formData.id"
            >
              Add
            </button>
            
            <button 
              type="button" 
              class="btn" 
              style="background-color: #ccc; margin-left: 10px;"
              @click.prevent="$refs.new.active = 0"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </popup>
  </div>
  `
};