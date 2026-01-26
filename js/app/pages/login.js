export const login = {
    data() {
        return {
            img: 1,
            parent: ''
        }
    },

    mounted() {
        this.img = this.randomIntFromInterval(1, 7);
        this.parent = this.$parent.$parent;
    },

    methods: {
        randomIntFromInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },

        login() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(self.parent.url + "/site/login", data)
                .then(function (response) {

                    if (response.data.error) {
                        self.$refs.msg.alertFun(response.data.error);
                    }

                    if (response.data.user) {
                        self.parent.user = response.data.user;
                        window.localStorage.setItem(
                            'user',
                            JSON.stringify(self.parent.user)
                        );
                        self.parent.page('/campaigns');
                    }
                })
                .catch(function (error) {
                    console.log('errors', error);
                });
        }
    },

    template: `
    <div class="flex login-container">
        <msg ref="msg"/>

        <div id="left-area" class="w40">
            <div class="header">
                <div class="wrapper flex">
                    <div class="w40 logo">
                        <img src="./images/favicon.ico" class="mirror-logo" />
                    </div>
                    <div class="w60 al">
                        <h1>Affiliate Sign in</h1>
                    </div>
                </div>
            </div>

            <div class="form inner-form p20">
                <form @submit.prevent="login" v-if="parent.formData">
                    <div class="row">
                        <label>Email</label>
                        <input type="email" v-model="parent.formData.email" required>
                    </div>

                    <div class="row">
                        <label>Password</label>
                        <input type="password"
                               v-model="parent.formData.password"
                               required
                               autocomplete="on">
                    </div>

                    <div class="row">
                        <button class="btn">Sign in</button>
                    </div>
                </form>
            </div>
        </div>

        <div id="right-area" class="w60">
            <img :src="'./images/Cover_' + img + '.jpg'" />
        </div>
    </div>
    `
};