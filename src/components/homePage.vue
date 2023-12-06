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
      <h2>Welcome to Mind Mingle!</h2>
      <p>Where studying is made easier.</p>
    </main>

    <!-- Footer Section -->
    <footer>
      <p>&copy; 2023 Mind Mingle. All rights reserved.</p>
    </footer>
  </div>
  <!-- Search Bar -->
  <div class="search-container">
    <input type="text" v-model="searchQuery" placeholder="Search exams..." class="search-input">
    <button @click="searchExams" class="search-button">Search</button>
  </div>

  <!-- Search Results -->
  <div v-if="searchResults.length">
    <ul>
      <li v-for="exam in searchResults" :key="exam.id">
        {{ exam.subject }} - {{ exam.exam_date }} at {{ exam.start_time }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mindMingleLogo from '@/assets/mindmingle.png'; // Adjust the path if necessary
import axios from 'axios'; // Import axios for HTTP requests

export default {
  data() {
    return {
      mindMingleLogo: mindMingleLogo, // Make the logo image available to the template
      searchQuery: '', // Data property for the search query
      searchResults: [] // Data property to store search results
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

    async searchExams() {
      try {
        // Adjust the URL as per your API endpoint
        const response = await axios.get(`/api/calendar?query=${this.searchQuery}`);
        this.searchResults = response.data;
      } catch (error) {
        console.error('Error during exam search:', error);
        // Handle error scenarios, for example, showing a message to the user
      }
    }
  }
};
</script>


<style scoped>
.header-background {
  background-image: url('@/assets/books-2.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: #fff;
  text-align: center; /* Center text in the header */
  position: relative;
  padding: auto;
  height: 400px;
  width: auto; 
}

.logo-image {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: auto;
  z-index: 10;
  margin-bottom: -20px;
  margin-top: 80px;
  animation: flicker 0.9s infinite alternate;
}

@keyframes flicker {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

main {
  text-align: center; /* Center text in the main content */
}

.logout-container {
  position: absolute; /* Fixed position relative to the viewport */
  top: -2px; /* Align to the top of the viewport */
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
footer {
  text-align: center; /* Center text in the footer */
  padding: 20px; /* Add padding for better spacing */
}
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.search-input {
  padding: 10px 20px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-right: none; /* Remove right border */
  outline: none;
  border-radius: 5px 0 0 5px; /* Rounded corners on the left side */
  width: 300px; /* Adjust as needed */
}

.search-button {
  padding: 12px 20px;
  border: 2px solid #4285F4;
  background-color: #4285F4;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 0 5px 5px 0; /* Rounded corners on the right side */
  transition: background-color 0.2s;
}
footer {
  text-align: center; /* Center text in the footer */
  padding: 20px; /* Add padding for better spacing */
  background-color: #f5f5f5; /* Footer background color */
  border-top: 2px solid #ddd; /* Top border for the footer */
  position: absolute; /* Position the footer at the bottom */
  bottom: 0;
  left: 0;
  width: 100%;
}
.search-button:hover {
  background-color: #357ae8;
}
</style>
