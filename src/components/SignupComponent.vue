<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="signup">
      <label for="signup-username">Username:</label>
      <input type="text" id="signup-username" v-model="username" required>

      <label for="signup-password">Password:</label>
      <input type="password" id="signup-password" v-model="password" required autocomplete="new-password">

      <label for="signup-confirm-password">Confirm Password:</label>
      <input type="password" id="signup-confirm-password" v-model="confirmPassword" required>

      <button type="submit">Sign Up</button>
    </form>
    <h2>Already have an account? <a href="/login">Login</a></h2> <!-- Update this link as per your routing -->
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const router = useRouter();
    const signup = () => {
      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match!');
        return;
      }
      axios.post('/signup', {
        username: username.value,
        password: password.value
      })
      .then(response => {
      console.log('Signup successful', response);
      router.push('/login'); // This is how you use useRouter to navigate
      })
      .catch(error => {
        // Handle signup errors here
        console.error('Signup failed:', error);
        alert('Signup failed: ' + error.response.data);
      });
    };

    return {
      username,
      password,
      confirmPassword,
      signup
    };
  }
};
</script>
