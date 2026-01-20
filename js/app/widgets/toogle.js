export const toogle = {
  template: `
    <label class="toggle">
      <input type="checkbox" :checked="value" @change="$emit('update:value', $event.target.checked)">
      <span class="toggle-slider"></span>
    </label>
  `,
  props: ['value']
};