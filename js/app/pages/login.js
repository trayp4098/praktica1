export const login = {
  data() {
    return {
      img: 1,
      hs: 0
    };
  },

  mounted() {
    this.img = this.randomIntFromInterval(1, 7);
  },

  methods: {
    randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  },

  template: `
    <div class="flex">
      
      gdfgdfgdfgdf
    </div>
  `
};