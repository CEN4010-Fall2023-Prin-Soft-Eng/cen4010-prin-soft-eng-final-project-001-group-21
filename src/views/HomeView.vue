<template>
  <div class="container">
    <!-- Only display the logout button if the user is authenticated -->
    <div v-if="isAuthenticated" class="logout-container">
      <!-- Call the handleLogout method when the button is clicked -->
      <button type="button" class="button logout-button" @click="handleLogout">Logout</button>
    </div>    

    <!-- Total Time Studied insert here -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'Study_Sessions']),
  },
  methods: {
    ...mapActions(['logout']),
    
    handleLogout() {
      // Call the logout action and then redirect to the login page
      this.logout().then(() => {
        this.$router.push('/login');
      }).catch((error) => {
        console.error('Logout failed:', error);
      });
    },
  }
};
</script>

<style scoped>
/* Existing styles for .container and .button remain unchanged */

/* Styles for logout button container */
.logout-container {
  display: inline-block;
  background-color: #f0f0f0; /* light grey background */
  border: 1px solid #d0d0d0; /* darker grey border */
  padding: 10px 20px; /* some padding around the text */
  cursor: pointer; /* change mouse cursor to indicate clickable */
  transition: transform 0.2s; /* smooth transition for transform */
}

.logout-button {
  display: inline-block;
  background-color: #f0f0f0; /* light grey background */
  border: 1px solid #d0d0d0; /* darker grey border */
  padding: 10px 20px; /* some padding around the text */
  cursor: pointer; /* change mouse cursor to indicate clickable */
  transition: transform 0.2s; /* smooth transition for transform */
}

.logout-button:hover {
  transform: scale(1.1); /* scale up size to 110% when hovered */
}


</style>
