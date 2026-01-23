export const msg = {
    data() {
        return {
            alert: "",
            success: "",
            t1: null,
            t2: null,

            confirm: "",
            code: 0,
            interval: null,

            parent: null
        }
    },

    mounted() {
        this.parent = this.$parent.$parent;
    },

    methods: {
        fadeIn(el, timeout, display = 'block') {
            if (!el) return;
            el.style.opacity = 0;
            el.style.display = display;
            el.style.transition = `opacity ${timeout}ms`;
            setTimeout(() => el.style.opacity = 1, 10);
        },

        fadeOut(el, timeout) {
            if (!el) return;
            el.style.opacity = 1;
            el.style.transition = `opacity ${timeout}ms`;
            el.style.opacity = 0;
            setTimeout(() => el.style.display = 'none', timeout);
        },

        successFun(msg) {
            this.success = msg;
            this.alert = "";

            clearTimeout(this.t1);
            clearTimeout(this.t2);

            this.t1 = setTimeout(() => {
                const block = document.querySelector('.successMsg');
                this.fadeIn(block, 300, 'flex');

                this.t2 = setTimeout(() => {
                    this.fadeOut(block, 300);
                    this.success = "";
                }, 3000);
            }, 100);
        },

        alertFun(msg) {
            this.alert = msg;
            this.success = "";

            clearTimeout(this.t1);
            clearTimeout(this.t2);

            this.t1 = setTimeout(() => {
                const block = document.querySelector('.alertMsg');
                this.fadeIn(block, 300, 'flex');

                this.t2 = setTimeout(() => {
                    this.fadeOut(block, 300);
                    this.alert = "";
                }, 3000);
            }, 100);
        },

        // ===== CONFIRM =====
        confirmFun(text) {
            this.code = 0;
            this.confirm = text;

            this.$refs.confirm.active = 1;

            return new Promise((resolve) => {
                this.interval = setInterval(() => {
                    if (this.code > 0) {
                        resolve(this.code === 1);
                    }
                }, 100);
            }).then((res) => {
                clearInterval(this.interval);
                this.$refs.confirm.active = 0;
                return res;
            });
        }
    },

    template: `
        <div>
            <div class="alertMsg" v-if="alert">
                <div class="wrapper al">
                    <i class="fas fa-times-circle"></i> {{ alert }}
                </div>
            </div>

            <div class="successMsg" v-if="success">
                <div class="wrapper al">
                    <i class="fas fa-check-circle"></i> {{ success }}
                </div>
            </div>
        </div>

        <popup ref="confirm">
            <div class="confirm-box">
                <button class="confirm-close" @click.prevent="code = 2">×</button>

                <div class="confirm-text">
                    {{ confirm }}
                </div>

                <div class="confirm-buttons">
                    <button class="confirm-btn confirm-no"
                            @click.prevent="code = 2">
                        No
                    </button>

                    <button class="confirm-btn confirm-yes"
                            @click.prevent="code = 1">
                        Yes
                    </button>
                </div>
            </div>
        </popup>
    `
};
