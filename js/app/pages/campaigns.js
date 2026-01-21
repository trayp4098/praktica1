export const campaigns = {
  data() {
    return {
      parent: null
    };
  },
  mounted() {
    // Access parent component through $parent.$parent if needed
    this.parent = this.$parent.$parent;

    // Redirect to logout if no user
    if (!this.parent.user) {
      this.parent.logout();
    }
  },
  methods: {
    handleLogout() {
      if (this.parent) {
        this.parent.logout();
      }
    }
  },
  template: `
    <div>
      <h2>Campaigns</h2>
      <button @click="handleLogout">Logout</button>
    </div>
  `
};
