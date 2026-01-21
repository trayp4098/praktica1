export const msg = {
    data() {
        return {
            alert: "",
            success: "",
            t1: null,
            t2: null,
            confirmTitle: "Please confirm next action",
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

            setTimeout(() => {
                el.style.opacity = 1;
            }, 10);
        },

        fadeOut(el, timeout) {
            if (!el) return;

            el.style.opacity = 1;
            el.style.transition = `opacity ${timeout}ms`;
            el.style.opacity = 0;

            setTimeout(() => {
                el.style.display = 'none';
            }, timeout);
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
    `
};
