<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <label for="login-username">Username:</label>
        <input type="text" id="login-username" v-model="username" required>
        
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" v-model="password" required autocomplete="current-password">
        
        <button type="submit">Login</button>
      </form>
  
      <h2>Don't have an account? <router-link :to="{ name: 'signup' }">Sign Up</router-link>
</h2>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useStore } from 'vuex';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const store=useStore();
      const username = ref('');
      const password = ref('');
      const router = useRouter();
  
      const login = async () => {
  try {
    const response = await axios.post('/login', {
      username: username.value,
      password: password.value
    });
    // Assuming the token is in the response data
    store.dispatch('login', { username: username.value, password: password.value });
    console.log('Token received:', response.data.token); // Add this line to log the token
    router.push({ name: 'home' }); // Redirect to the homepage
  } catch (error) {
    // Handle errors, such as incorrect credentials or server issues
    console.error('Login error:', error);
  }
};


    return {
      username,
      password,
      login
    };
    }
  };
  
  </script>
  