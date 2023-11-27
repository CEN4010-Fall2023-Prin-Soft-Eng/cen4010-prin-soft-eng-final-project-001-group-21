<template>
  <div class="signup-container">
    <h2 class="center">Sign Up</h2>
    <form @submit.prevent="signup" class="center">
      <label for="signup-username">Username:</label>
      <input type="text" id="signup-username" v-model="username" class="form-input" required>

      <label for="signup-email">Email:</label>
      <input type="email" id="signup-email" v-model="email" class="form-input" required>

      <label for="signup-password">Password:</label>
      <input type="password" id="signup-password" v-model="password" class="form-input" required autocomplete="new-password">

      <label for="signup-confirm-password">Confirm Password:</label>
      <input type="password" id="signup-confirm-password" v-model="confirmPassword" class="form-input" required>

      <button type="submit" class="signup-button">Sign Up</button>
    </form>
    <div class="center">
      <h2>Already have an account? <a href="/login">Login</a></h2>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const router = useRouter();

    const signup = async () => {
      // Form validation logic here (if needed)

      if (password.value !== confirmPassword.value) {
        // Show a more integrated error message instead of alert
        return;
      }

      try {
        const response = await axios.post('/signup', {
          username: username.value,
          email: email.value,
          password: password.value
        });
        console.log('Signup successful', response);
        // Reset form fields here if needed
        router.push('/login');
      } catch (error) {
        console.error('Signup failed:', error);
        // Show a more integrated error message instead of alert
      }
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      signup
    };
  }
};
</script>

<style>
    /* Basic styling for the navigation bar */
    ul.navbar {
        list-style-type: none;
        margin: 0;
        padding: 0;
        background-color: #333;
        overflow: hidden;
    }

    li.nav-item {
        float: left;
    }

    li.nav-item a {
        display: block;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
    }

    /* Style for the registration form container */
    .signup-container {
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ccc;
        max-width: 300px;
        background-color: #f9f9f9;
    }

    /* Style for form fields */
    .form-input {
        width: 100%;
        padding: 10px;
        margin: 5px 0;
        box-sizing: border-box;
    }

    /* Style for the sign-up button */
    .signup-button {
        background-color: #428bca;
        color: white;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        width: 100%;
        margin-top: 10px; /* Add some spacing between form fields and the sign-up button */
    }

    /* Center the form */
    .center {
        text-align: center;
    }
</style>
