<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="signup">
      <label for="signup-username">Username:</label>
      <input type="text" id="signup-username" v-model="username" required>

      <label for="signup-email">Email:</label>
      <input type="email" id="signup-email" v-model="email" required>

      <label for="signup-password">Password:</label>
      <input type="password" id="signup-password" v-model="password" required autocomplete="new-password">

      <label for="signup-confirm-password">Confirm Password:</label>
      <input type="password" id="signup-confirm-password" v-model="confirmPassword" required>

      <button type="submit">Sign Up</button>
    </form>
    <h2>Already have an account? <a href="/login">Login</a></h2>
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

    const isEmailValid = (email) => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email.toLowerCase());
    }

    const signup = async () => {
      if (!isEmailValid(email.value)) {
        // Show a more integrated error message instead of alert
        console.error('Invalid email format');
        return;
      }

      if (password.value !== confirmPassword.value) {
        // Show a more integrated error message instead of alert
        console.error('Passwords do not match');
        return;
      }

      try {
        const response = await axios.post('/signup', {
          username: username.value,
          email: email.value,
          password: password.value
        });
        console.log('Signup successful', response);
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
