export const user = {
    data: function() {
        return {
            parent: "",
            data: {},
            user: [],
            tab: 0,
            tabs: ["Statistic", "Sites", "Payments"],
            date: "",
            date2: "",
            iChart: -1,
            loader: 1
        };
    },

    mounted: function() {
        this.parent = this.$parent.$parent;

        if (!this.parent.user) {
            this.parent.logout();
        }

        if (!this.parent.$route.params.id) this.parent.page('/users');
        this.get();
        this.GetFirstAndLastDate();
    },

    methods: {
        imgSrc: function (img) {
            return img ? this.parent.url + '/' + img : '';
        },

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
            if (this.date != "") data.append('date', this.date);
            if (this.date2 != "") data.append('date2', this.date2);
            data.append('id', this.parent.$route.params.id);
            self.loader = 1;

            axios.post(this.parent.url + "/site/getUser?auth=" + this.parent.user.auth, data).then(function(response) {
                self.loader = 0;
                self.data = response.data;
                if (self.iChart != -1) self.line(self.data.items[self.iChart]);
            }).catch(function(error) {
                console.log(error);
                self.parent.logout();
            });
        },

        getDetails: function(bid = false, type = false) {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
            if (this.date != "") data.append('date', this.date);
            if (this.date2 != "") data.append('date2', this.date2);
            if (bid != "") data.append('bid', bid);
            if (type != "") data.append('type', type);
            self.loader = 1;
            
            axios.post(this.parent.url + "/site/getStatisticsDetails?auth=" + this.parent.user.auth, data).then(function(response) {
                self.details = response.data;
                self.loader = 0;
            }).catch(function(error) {
                console.log(error);
                self.parent.logout();
            });
        },

        action: function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
            
            axios.post(this.parent.url + "/site/actionUser?auth=" + this.parent.user.auth, data).then(function(response) {
                if (response.data.error) {
                    self.$refs.header.$refs.msg.alertFun(response.data.error);
                    return false;
                } else {
                    self.$refs.new.active = 0;
                    if (self.parent.formData.id) {
                        self.$refs.header.$refs.msg.successFun("Successfully updated user!");
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully added new user!");
                    }
                    self.get();
                }
            }).catch(function(error) {
                console.log('errors :', error);
            });
        },

        del: async function() {
            if (await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this user?")) {
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);

                axios.post(this.parent.url + "/site/deleteUser?auth=" + this.parent.user.auth, data).then(function(response) {
                    self.$refs.header.$refs.msg.successFun("Successfully deleted add!");
                    self.get();
                }).catch(function(error) {
                    console.log('errors :', error);
                });
            }
        },

        actionStatistic: function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
            data.append('uid', this.parent.$route.params.id);
            
            axios.post(this.parent.url + "/site/actionStatistic?auth=" + this.parent.user.auth, data).then(function(response) {
                if (response.data.error) {
                    self.$refs.header.$refs.msg.alertFun(response.data.error);
                    return false;
                } else {
                    // self.$refs.payment.active = 0;
                    if (self.parent.formData.id) {
                        self.$refs.header.$refs.msg.successFun("Successfully updated banner!");
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully added new banner!");
                    }
                    self.get();
                }
            }).catch(function(error) {
                console.log('errors :', error);
            });
        },

        delPayment: async function() {
            if (await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this payment?")) {
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);
                
                axios.post(this.parent.url + "/site/deletePayment?auth=" + this.parent.user.auth, data).then(function(response) {
                    self.$refs.header.$refs.msg.successFun("Successfully deleted add!");
                    self.get();
                }).catch(function(error) {
                    console.log('errors :', error);
                });
            }
        },

        actionSite: function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url + "/site/actionSite?auth=" + this.parent.user.auth, data).then(function(response) {
                // self.$refs.new.active = 0;
                if (self.parent.formData.id) {
                    self.$refs.header.$refs.msg.successFun("Successfully updated site!");
                } else {
                    self.$refs.header.$refs.msg.successFun("Successfully added new site!");
                }
                self.get();
            }).catch(function(error) {
                console.log('errors :', error);
            });
        },

        line: function(item) {
            setTimeout(function() {
                let dates = [];
                let clicks = [];
                let views = [];
                let leads = [];
                
                if (item && item['line']) {
                    for (let i in item['line']) {
                        dates.push(i);
                        clicks.push(item['line'][i].clicks);
                        views.push(item['line'][i].views);
                        leads.push(item['line'][i].leads);
                    }
                }

                document.getElementById('chartOuter').innerHTML = '<div id="chartHints"><div class="chartHintsViews">Views</div><div class="chartHintsClicks">Clicks</div></div><canvas id="myChart"></canvas>';
                const ctx = document.getElementById('myChart');
                const xScaleImage = {
                    id: "xScaleImage",
                    afterDatasetsDraw(chart, args, plugins) {
                        const {ctx, data, chartArea: {bottom}, scales: {x}} = chart;
                        ctx.save();
                        data.images.forEach((image, index) => {
                            const label = new Image();
                            label.src = image;
                            
                            const width = 120;
                            ctx.drawImage(label, x.getPixelForValue(index) - (width / 2), x.top, width, width);
                        });
                    }
                };
                
                new Chart(ctx, {
                    type: 'line',
                    // plugins: [xScaleImage],
                    data: {
                        labels: dates,
                        // images: images,
                        datasets: [
                            {
                                label: "Clicks",
                                backgroundColor: "#00599D",
                                borderColor: "#00599D",
                                data: clicks
                            },
                            {
                                label: "Views",
                                backgroundColor: "#5000B8",
                                borderColor: "#5000B8",
                                data: views,
                                yAxisID: 'y2'
                            },
                            {
                                label: "Leads",
                                backgroundColor: "#379D00",
                                borderColor: "#379D00",
                                data: leads
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            tooltip: {
                                bodyFontSize: 20,
                                usePointStyle: true,
                                callbacks: {
                                    title: (ctx) => {
                                        return ctx[0]['dataset'].label;
                                    }
                                }
                            },
                            legend: {
                                display: false
                            }
                        },
                        categoryPercentage: 0.2,
                        barPercentage: 0.8,
                        // barThickness: 30,
                        scales: {
                            y: {
                                id: 'y2',
                                position: 'right'
                            },
                            x: {
                                afterFit: (scale) => {
                                    scale.height = 120;
                                }
                            }
                        }
                    }
                });
            }, 100);
        }
    },

    template: `
        <div class="inside-content">
            <Header ref="header" />
            <div id='spinner' v-if="loader"></div>
            
            <div class="panelTop">
                <div class="wrapper">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 0 0 0;">
                        <div>
                            <a class="btnS" href="#" @click.prevent="parent.formData=user; $refs.new.active=1">
                                <i class="fas fa-edit"></i> Edit user
                            </a>
                        </div>
                        <div v-if="data && data.info" style="text-align: right;">
                            <h1 style="margin: 0; font-size: 1.4em;">{{data.info.user}}</h1>
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0;" v-if="data && data.info">
                        <div></div>
                        <div style="text-align: center;">
                            <p style="margin: 0;"><b>Email:</b> {{data.info.email}}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin: 0;"><b>Phone:</b> {{data.info.phone}}</p>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; padding: 10px 0 20px 0;">
                        <ul style="display: flex; gap: 15px; padding: 0; margin: 0; list-style: none;">
                            <li v-if="tabs" v-for="(t,i) in [...tabs].reverse()"
                                :class="{active:tab==(tabs.length-1-i)}"
                                @click="tab=(tabs.length-1-i)"
                                style="cursor: pointer; padding: 8px 20px; border-radius: 5px; background: white; border: 1px solid #ddd; color: black; font-size: 14px; position: relative;"
                                :style="{borderColor: tab==(tabs.length-1-i) ? '#00CB84' : '#ddd', fontWeight: tab==(tabs.length-1-i) ? 'bold' : 'normal', borderBottom: tab==(tabs.length-1-i) ? '3px solid #00CB84' : '1px solid #ddd'}">
                                {{t}}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Даты над таблицей и отцентрированы -->
            <div class="wrapper">
                <!-- Даты только для таба Statistic -->
                <div v-if="tab==0" style="text-align: center; margin: 20px 0;">
                    <div class="date-range" style="display: inline-flex; align-items: center; justify-content: center;">
                        <input type="date" v-model="date" @change="get()" style="width: 120px;" />
                        <span style="margin: 0 10px;">–</span>
                        <input type="date" v-model="date2" @change="get()" style="width: 120px;" />
                    </div>
                </div>
                
                <!-- Даты для таба Sites -->
                <div v-if="tab==1" style="text-align: center; margin: 20px 0;">
                    <div class="date-range" style="display: inline-flex; align-items: center; justify-content: center;">
                        <input type="date" v-model="date" @change="get()" style="width: 120px;" />
                    </div>
                </div>
                
                <popup ref="new" :title="(parent.formData && parent.formData.id) ? 'Edit user' : 'New user'">
                    <div class="form inner-form">
                        <form @submit.prevent="action()" v-if="parent.formData">
                            <div class="row">
                                <label>Name</label>
                                <input type="text" v-model="parent.formData.user" required>
                            </div>
                            <div class="row">
                                <label>Phone</label>
                                <input type="text" v-model="parent.formData.phone" required>
                            </div>
                            <div class="row">
                                <label>Email</label>
                                <input type="text" v-model="parent.formData.email" required>
                            </div>
                            <div class="row">
                                <label>Password</label>
                                <input type="text" v-model="parent.formData.password">
                            </div>
                            
                            <div class="row">
                                <button class="btn" v-if="parent.formData && parent.formData.id">Edit</button>
                                <button class="btn" v-if="parent.formData && !parent.formData.id">Add</button>
                            </div>
                        </form>
                    </div>
                </popup>
                
                <!-- Tab 1: Sites -->
                <div v-if="tab==1">
                    <popup ref="chart" fullscreen="true" title="Chart">
                        <div class="flex panel">
                            <div class="w70 al">
                                <div class="flex cubes">
                                    <div class="w30 clicks">
                                        <div>Clicks</div>
                                        {{data.sites[iChart].clicks}}
                                    </div>
                                    <div class="w30 views">
                                        <div>Views</div>
                                        {{data.sites[iChart].views}}
                                    </div>
                                    <div class="w30 leads">
                                        <div>Leads</div>
                                        {{data.sites[iChart].leads}}
                                    </div>
                                    <div class="w30 ctr">
                                        <div>CTR</div>
                                        {{(data.sites[iChart].clicks*100/data.sites[iChart].views).toFixed(2)}}%
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex body">
                            <div class="w30 ar filchart"></div>
                            <div class="w70" id="chartOuter">
                                <div id="chartHints">
                                    <div class="chartHintsViews">Views</div>
                                    <div class="chartHintsClicks">Clicks</div>
                                </div>
                            </div>
                        </div>
                    </popup>
                    
                    <div class="table" v-if="data.sites!=''">
                        <table>
                            <thead>
                                <tr>
                                    <th class="id"></th>
                                    <th class="image">Site</th>
                                    <th class="id">Views</th>
                                    <th class="id">Clicks</th>
                                    <th class="id">Leads</th>
                                    <th class="id">Fraud clicks</th>
                                    <th class="actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,i) in data.sites">
                                    <td class="id">
                                        <toogle :modelValue="item.published" @update:modelValue="item.published = $event; parent.formData = item; actionSite();" />
                                    </td>
                                    <td class="image">{{item.site}}</td>
                                    <td class="id">{{item.views}}</td>
                                    <td class="id">
                                        <template v-if="item.clicks">{{item.clicks}}</template>
                                        <template v-if="!item.clicks">0</template>
                                    </td>
                                    <td class="id">
                                        <template v-if="item.leads">{{item.leads}}</template>
                                        <template v-if="!item.leads">0</template>
                                    </td>
                                    <td class="id">
                                        <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id,4)">
                                            <template v-if="item.fclicks">{{item.fclicks}}</template>
                                            <template v-if="!item.fclicks">0</template>
                                        </a>
                                    </td>
                                    <td class="actions">
                                        <a href="#" @click.prevent="parent.formData = item; iChart = i; $refs.chart.active = 1; line(item)">
                                            <i class="fas fa-chart-bar"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="empty" v-if="data.sites==''">
                        No items
                    </div>
                </div>
                
                <!-- Tab 2: Payments -->
                <div v-if="tab==2">
                    <div class="flex panel">
                        <div class="w30 ptb10">
                            <h2>{{tabs[tab]}}</h2>
                        </div>
                        <div class="w50"></div>
                        <div class="w20 al ptb15">
                            <a class="btnS" href="#" @click.prevent="parent.formData={}; $refs.payment.active=1">
                                <i class="fas fa-plus"></i> Add payment
                            </a>
                        </div>
                    </div>
                    
                    <popup ref="payment" :title="(parent.formData && parent.formData.id) ? 'Edit payment' : 'New payment'">
                        <div class="form inner-form">
                            <form @submit.prevent="actionPayment()" v-if="parent.formData">
                                <div class="row">
                                    <label>Value</label>
                                    <input type="number" v-model="parent.formData.value" required>
                                </div>
                                <div class="row">
                                    <label>Date</label>
                                    <input type="date" v-model="parent.formData.date" required>
                                </div>
                                <div class="row">
                                    <label>Description</label>
                                    <input type="text" v-model="parent.formData.description">
                                </div>
                                
                                <div class="row">
                                    <button class="btn" v-if="parent.formData && parent.formData.id">Edit</button>
                                    <button class="btn" v-if="parent.formData && !parent.formData.id">Add</button>
                                </div>
                            </form>
                        </div>
                    </popup>
                    
                    <div class="table" v-if="data.payments!=''">
                        <table>
                            <thead>
                                <tr>
                                    <th class="id">#</th>
                                    <th class="id">Value</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th class="actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in data.payments">
                                    <td class="id">{{item.id}}</td>
                                    <td class="id">
                                        <a href="#" @click.prevent="parent.formData = item; $refs.payment.active=1;">
                                            {{item.value}}
                                        </a>
                                    </td>
                                    <td>
                                        <a href="#" @click.prevent="parent.formData = item; $refs.payment.active=1;">
                                            {{item.date_title}}
                                        </a>
                                    </td>
                                    <td>{{item.description}}</td>
                                    <td class="actions">
                                        <a href="#" @click.prevent="parent.formData = item; $refs.payment.active=1;">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a href="#" @click.prevent="parent.formData = item; delPayment();">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="empty" v-if="data.payments==''">
                        No items
                    </div>
                </div>
                
                <!-- Tab 0: Statistic -->
                <div v-if="tab==0">
                    <popup ref="img" title="Banner">
                        <div class="ac">
                            <img :src="imgSrc(parent.formData.img)" v-if="parent.formData.img" />
                        </div>
                    </popup>
                    
                    <div class="table" v-if="data.statistics!=''">
                        <table>
                            <thead>
                                <tr>
                                    <th class="id"></th>
                                    <th class="image"></th>
                                    <th class="image">Campaign</th>
                                    <th>Size</th>
                                    <th>Link</th>
                                    <th class="id">Views</th>
                                    <th class="id">Clicks</th>
                                    <th class="id">Leads</th>
                                    <th class="id">Fraud Clicks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in data.statistics">
                                    <td class="id">
                                        <a href="#">{{item.published}}</a>
                                    </td>
                                    <td class="image">
                                        <a href="#" @click.prevent="parent.formData=item; $refs.img.active=1">
                                            <img :src="imgSrc(item.img)" />
                                        </a>
                                    </td>
                                    <td class="image">{{item.campaign}}</td>
                                    <td>{{item.size}}</td>
                                    <td>{{item.link}}</td>
                                    <td class="id">{{item.views}}</td>
                                    <td class="id">
                                        <template v-if="item.clicks">{{item.clicks}}</template>
                                        <template v-if="!item.clicks">0</template>
                                    </td>
                                    <td class="id">
                                        <template v-if="item.leads">{{item.leads}}</template>
                                        <template v-if="!item.leads">0</template>
                                    </td>
                                    <td class="id">
                                        <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id,4)">
                                            <template v-if="item.fclicks">{{item.fclicks}}</template>
                                            <template v-if="!item.fclicks">0</template>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="empty" v-if="data.statistics==''">
                        No items
                    </div>
                </div>
            </div>
        </div>
    `
};