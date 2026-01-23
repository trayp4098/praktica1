export const popup = {
  props: ['title', 'fullscreen'],
  data() {
    return {
      active: 0,
      top: 0,
      widthVal: '500px',
      ml: '-250px',
      left: '50%',
      height: 'auto'
    }
  },
  watch: {
    active: function(o, n) {
      if (o == 1 && !this.fullscreen) {
        var self = this;
        setTimeout(function() {
          let height = self.$refs.popup.clientHeight / 2;
          self.top = "calc(50% - " + height + "px)";
        }, 10);
      }
      
      if (this.fullscreen) {
        this.top = 0;
        this.widthVal = '100%';
        this.ml = 0;
        this.left = 0;
        this.height = '100%';
      }
    }
  },
  template: `
    <div v-if="active==1">
      <div class="popup-back"></div>
      <div class="popup" 
           :style="getPopupStyle()" 
           ref="popup">
        <div class="flex head-popup">
          <div class="w80 ptb20">
            <div class="head-title">{{title}}</div>
          </div>
          <div class="w20 al ptb20">
            <a href="#" @click.prevent="active=0">
              <i class="fas fa-window-close"></i>
            </a>
          </div>
        </div>
        <div class="popup-inner">
          <slot />
        </div>
      </div>
    </div>
  `,
  methods: {
    getPopupStyle() {
      if (this.fullscreen) {
        return {
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          'max-width': '100%',
          'margin-left': '0'
        };
      }
      
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        'max-width': '360px',
        width: '90%',
        'margin-left': '0'
      };
    }
  }
};