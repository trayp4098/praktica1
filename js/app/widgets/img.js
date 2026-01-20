export const img = {
  template: `
    <img :src="src" :alt="alt" :class="className">
  `,
  props: ['src', 'alt', 'className']
};