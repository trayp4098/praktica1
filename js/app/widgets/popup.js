export const popup = {
  template: `
    <div class="popup" v-if="show">
      <div class="popup-content">
        <slot></slot>
      </div>
    </div>
  `,
  props: ['show']
};