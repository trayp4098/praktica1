export const popup = {
  props: ['title', 'fullscreen'],
  data() {
    return {
      active: 0,
      ro: null
    };
  },
  mounted() {
    window.addEventListener('resize', this.centerPopup);
  },
  methods: {
    centerPopup() {
      if (!this.$refs.popup || this.fullscreen) return;

      const popup = this.$refs.popup;
      const windowHeight = window.innerHeight;
      const popupHeight = popup.offsetHeight;

      
      if (popupHeight < windowHeight) {
        popup.style.top = `${(windowHeight - popupHeight) / 2}px`;
      } else {
        
      }
    }
  },
  watch: {
    active(n) {
      if (n === 1 && !this.fullscreen) {
        this.$nextTick(() => {
          this.centerPopup();

          this.ro = new ResizeObserver(() => {
            this.centerPopup();
          });

          this.ro.observe(this.$refs.popup);
        });
      }

      if (n === 0 && this.ro) {
        this.ro.disconnect();
        this.ro = null;
      }
    }
  },
  beforeUnmount() {
    if (this.ro) this.ro.disconnect();
    window.removeEventListener('resize', this.centerPopup);
  },
  template: `
    <template v-if="active === 1">
      <div class="popup-back"></div>

      <div
        class="popup"
        :class="{ fullscreen: fullscreen }"
        ref="popup"
        :style="{
          left: fullscreen ? 0 : '50%',
          transform: fullscreen ? 'none' : 'translateX(-50%)',
          maxHeight: fullscreen ? '100%' : '90vh',
          overflowY: 'auto'
        }"
      >
        <div class="flex head-popup">
          <div class="w80 ptb20">
            <div class="head-title">{{ title }}</div>
          </div>
          <div class="w20 al ptb20">
            <a href="#" @click.prevent="active = 0">
              <i class="fas fa-window-close"></i>
            </a>
          </div>
        </div>

        <div class="popup-inner">
          <slot />
        </div>
      </div>
    </template>
  `
};
