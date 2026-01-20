export const msg = {
  template: `
    <div class="message" :class="type">
      <p>{{ text }}</p>
    </div>
  `,
  props: ['text', 'type']
};