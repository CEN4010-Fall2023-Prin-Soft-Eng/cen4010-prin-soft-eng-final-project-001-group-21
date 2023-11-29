<template>
  <div class="container">
    <!-- Only display the logout button if the user is authenticated -->
    <div v-if="isAuthenticated" class="logout-container">
      <button type="button" class="button logout-button" @click="handleLogout">Logout</button>
    </div>

    <!-- Header Section -->
    <header>
      <img src="mindmingle.png" alt="Mind Mingle Logo" width="600px" height="auto">
    </header>

    <!-- Main Content Section -->
    <main>
      <h2>Welcome, <span id="username"></span>!</h2>
      <p>This is the home page of Mind Mingle. Explore and connect with others!</p>
        
      <!-- Streak Section -->
      <div id="streak-section">
        <p>Your Current Streak: <span id="streak-count"></span></p>
        <p id="streak-message"></p>
      </div>
    </main>

    <!-- Footer Section -->
    <footer>
      <p>&copy; 2023 Mind Mingle. All rights reserved.</p>
    </footer>
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
  background-color: #4285F4; /* Google blue */
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #357ae8; /* darker blue on hover */
  transform: scale(1.1); /* scale up size to 110% when hovered */
}

/* Your additional CSS styles here */
</style>
