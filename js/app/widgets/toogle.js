export var toogle = {
    data: function() {
        return {
            checked: false
        }
    },
    watch: {
        modelValue: function(newVal) {
            // Преобразуем строку в булево значение
            this.checked = newVal === "1" || newVal === true || newVal === "true";
        }
    },
    mounted() {
        // Инициализируем начальное состояние
        this.checked = this.modelValue === "1" || this.modelValue === true || this.modelValue === "true";
    },
    methods: {
        change() {
            // Отправляем "1" для true, "0" для false
            const value = this.checked ? "1" : "0";
            this.$emit('update:modelValue', value);
        }
    },
    props: {
        modelValue: [String, Boolean] // Принимаем и строку и булево
    },
    template: `
        <label class="switch">
            <input type="checkbox" v-model="checked" @change="change()">
            <span class="slider round"></span>
        </label>
    `
};