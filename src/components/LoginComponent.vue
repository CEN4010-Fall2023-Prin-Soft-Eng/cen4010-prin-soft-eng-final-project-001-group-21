<template>
  <div class="signup-container">
    <h2 class="center">Login</h2>
    <form @submit.prevent="login" class="center">
      <label for="login-username">Username:</label>
      <input type="text" id="login-username" v-model="username" class="form-input" required>
      
      <label for="login-password">Password:</label>
      <input type="password" id="login-password" v-model="password" class="form-input" required autocomplete="current-password">
      
      <button type="submit" class="form-button">Login</button>
    </form>

    <div class="center">
      <h2>Don't have an account? <router-link :to="{ name: 'signup' }">Sign Up</router-link></h2>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useStore } from 'vuex';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const username = ref('');
    const password = ref('');
    const router = useRouter();

    const login = async () => {
      try {
        const response = await axios.post('/login', {
          username: username.value,
          password: password.value
        });
        store.dispatch('login', { username: username.value, password: password.value });
        console.log('Token received:', response.data.token);
        router.push({ name:'home'});
      } catch (error) {
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

<style>
  .signup-container {
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ccc;
      max-width: 300px;
      background-color: #f9f9f9;
  }

  .form-input {
      width: 100%;
      padding: 10px;
      margin: 5px 0;
      box-sizing: border-box;
  }

  .form-button {
      background-color: #428bca;
      color: white;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      width: 100%;
      margin-top: 10px;
  }

  .center {
      text-align: center;
  }
</style>

  