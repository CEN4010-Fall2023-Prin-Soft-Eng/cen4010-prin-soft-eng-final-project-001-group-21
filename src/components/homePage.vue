<template>
  <div class="container">
    <!-- Only display the logout button if the user is authenticated -->
    <div v-if="isAuthenticated" class="logout-container">
      <button type="button" class="button logout-button" @click="handleLogout">Logout</button>
    </div>

    <!-- Header Section -->
    <header>
      <!-- Image displayed here using the mindMingleLogo data property -->
      <img :src="mindMingleLogo" alt="Mind Mingle Logo" width="600">
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
      mindMingleLogo: mindMingleLogo // This is where the image is made available to the template
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
.logout-container {
  display: inline-block;
  background-color: #f0f0f0;
  border: 1px solid #d0d0d0;
  padding: 10px 20px;
  cursor: pointer;
  transition: transform 0.2s;
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
