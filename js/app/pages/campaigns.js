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
      all: true
    }
  },

  mounted() {
    this.parent = this.$parent.$parent;
    if (!this.parent.user) {
      this.parent.logout();
    }

    this.get();
    this.GetFirstAndLastDate();
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
    }
  },

  computed: {
    reversedItems() {
      if (!this.data.items) return [];
      return [...this.data.items].reverse();
    }
  },

  template: `
  <div class="campaigns-page">
    <div class="campaigns-header">
      <button class="logout-btn" @click="parent.logout()">
        <i class="fa-solid fa-right-from-bracket"></i>
        Logout
      </button>

      <div class="date-filters">
        <input type="date" v-model="date" @change="get()" />
        <span>-</span>
        <input type="date" v-model="date2" @change="get()" />
      </div>
      <h1>Campaigns</h1>
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
            <th>Title</th>
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
            
            <td class="id">{{ item.id }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty" v-else>No items</div>

  </div>
  `
};