export const statistics = {
  data: function() {
    return {
      parent: "",
      data: {},
      date: "",
      date2: "",
      loader: 1,
      type: 0
    }
  },
  
  mounted: function() {
    this.parent = this.$parent.$parent;
    
    if (!this.parent.user) {
      this.parent.logout();
    } else {
      this.get();
      this.GetFirstAndLastDate();
    }
  },
  
  methods: {
    GetFirstAndLastDate: function() {
      var year = new Date().getFullYear();
      var month = new Date().getMonth();
      var firstDayOfMonth = new Date(year, month, 2);
      var lastDayOfMonth = new Date(year, month + 1, 1);
      
      this.date = firstDayOfMonth.toISOString().substring(0, 10);
      this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
    },
    
    get: function() {
      var self = this;
      var data = self.parent.toFormData(self.parent.formData);
      
      data.append('id', this.parent.user.id);
      data.append('type', 'user');
      if (this.date != "") data.append('date', this.date);
      if (this.date2 != "") data.append('date2', this.date2);
      if (this.type != "") data.append('type', this.type);
      
      self.loader = 1;
      axios.post(this.parent.url + "/site/getStatistics?auth=" + this.parent.user.auth, data)
        .then(function(response) {
          self.loader = 0;
          self.data = response.data;
          if (response.data.types && response.data.types[0] && !self.type) 
            self.type = response.data.types[0].id;
          self.parent.formData.copy = self.data.multi;
        })
        .catch(function(error) {
          self.parent.logout();
        });
    },
    
    actionStatistic: function() {
      var self = this;
      var data = self.parent.toFormData(self.parent.formData);
      data.append('uid', this.parent.user.id);
      
      axios.post(this.parent.url + "/site/actionStatistic?auth=" + this.parent.user.auth, data)
        .then(function(response) {
          if (response.data.error) {
            self.$refs.header.$refs.msg.alertFun(response.data.error);
            return false;
          } else {
            if (self.parent.formData.id) {
              self.$refs.header.$refs.msg.successFun("Successfully updated banner!");
            } else {
              self.$refs.header.$refs.msg.successFun("Successfully added new banner!");
            }
            self.get();
          }
        })
        .catch(function(error) {
          console.log('errors : ', error);
        });
    },
    
    copy: async function(text) {
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        this.$refs.header.$refs.msg.successFun("Successfully copied!");
        this.$refs.copy.active = 0;
        this.parent.formData = {};
      } else {
        this.$refs.header.$refs.msg.alertFun("Use https!");
      }
    }
  },
  
  template: `
    <div class="inside-content">
      <Header ref="header" />
      <div id="spinner" v-if="loader"></div>
      <div class="wrapper">
        <div class="flex panel">
          <div class="w40">
            <h2>Statistics</h2>
          </div>
          
          <div class="w60 ac">
            <div class="date-range">
              <input type="date" v-model="date" @change="get()" />
              <span class="dash">–</span>
              <input type="date" v-model="date2" @change="get()" />
            </div>
          </div>
        </div>
        
        <div class="ac" v-if="!loader">
          <a href="#" class="btnS" @click.prevent="parent.formData.copy = data.multi; $refs.copy.active=1;">
            <i class="fas fa-images"></i> Multi banners
          </a>
        </div>
        
        <popup ref="img" title="Banner">
          <div class="ac">
            <img :src="parent.url + '/' + parent.formData.img" v-if="parent.formData.img" />
          </div>
        </popup>
        
        <popup ref="copy" :title="'Copy banner'" style="width: 800px; max-height: 700px;">
          <div class="form inner-form" style="padding: 30px;">
            <form v-if="parent.formData">
              <div class="row">
                <label>Code</label>
                <textarea 
                  v-model="parent.formData.copy" 
                  style="height: 300px; width: 100%; font-family: monospace; font-size: 14px; padding: 15px;"
                ></textarea>
              </div>
              <div class="row">
                <label>Type</label>
                <select v-model="type" @change="get()" required style="width: 100%; padding: 10px;">
                  <option value="0">---</option>
                  <option v-if="data.types" v-for="c in data.types" :value="c.id">{{c.title}}</option>
                </select>
              </div>
              <div class="row" style="margin-top: 20px;">
                <button class="btn" @click.prevent="copy(parent.formData.copy)" style="width: 100%; padding: 12px; font-size: 16px;">
                  Copy code
                </button>
              </div>
            </form>
          </div>
        </popup>
        
        <div class="table" v-if="data.items!=''">
          <table>
            <thead>
              <tr>
                <th class="image">Image</th>
                <th class="image">Campaign</th>
                <th>Link</th>
                <th class="id">Views</th>
                <th class="id">Clicks</th>
                <th class="id">Leads</th>
                <th class="id">Fraud clicks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data.items">
                <td class="image">
                  <a href="#" @click.prevent="parent.formData=item; $refs.img.active=1">
                    <img :src="parent.url + '/' + item.img" v-if="item.img" style="max-height: 65px;" />
                  </a>
                </td>
                <td class="image">{{ item.campaign_title || item.campaign || 'No campaign' }}</td>
                <td>{{ item.link || 'No link' }}</td>
                <td class="id">{{ item.views || 0 }}</td>
                <td class="id">{{ item.clicks || 0 }}</td>
                <td class="id">{{ item.leads || 0 }}</td>
                <td class="id">{{ item.fclicks || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty" v-if="data.items==''">
          No items
        </div>
      </div>
    </div>
  `
};