<template>
  <div class="container">
    <!-- Only display the logout button if the user is authenticated -->
    <div v-if="isAuthenticated" class="logout-container">
      <button type="button" class="button logout-button" @click="handleLogout">Logout</button>
    </div>

    <!-- Header Section with background and logo images -->
    <header class="header-background">
      <!-- Logo image here -->
      <img :src="mindMingleLogo" alt="Mind Mingle Logo" class="logo-image">
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
import mindMingleLogo from '@/assets/mindmingle.png'; // Adjust the path if necessary

export default {
  data() {
    return {
      mindMingleLogo: mindMingleLogo, // Make the logo image available to the template
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'Study_Sessions']),
  },
  methods: {
    ...mapActions(['logout']),
    
    handleLogout() {
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
.header-background {
  background-image: url('@/assets/books-2.png'); /* The path might need to be adjusted */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center; /* Center the background image */
  color: #fff; /* White text color */
  text-align: center;
  position: relative; /* Set the position context for absolute children */
  padding: auto;
  height: 400px;
  width:auto; 
}

.logo-image {
  position: absolute;
  top: 48%; /* Reduced from 60% to move the logo up */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust the positioning to truly center the logo */
  width: 600px; /* Adjust the width as needed */
  height: auto; /* Maintain aspect ratio */
  z-index: 10; /* Make sure the logo is above the background image */
  margin-bottom: -20px;
  margin-top: 80px;
  animation: flicker 0.9s infinite alternate;
}

/* Flicker animation */
@keyframes flicker {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.logout-container {
  position: absolute; /* Fixed position relative to the viewport */
  top: 7px; /* Align to the top of the viewport */
  right: 0; /* Align to the right of the viewport */
  padding: 10px 20px;
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 1000; /* Ensure it's above other elements */
}

.logout-button {
  background-color: #4285F4;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #357ae8;
  transform: scale(1.1);
}

/* Additional styles can go here */
</style>
