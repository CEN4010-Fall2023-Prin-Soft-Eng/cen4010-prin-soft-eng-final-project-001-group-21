<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="login-username">Username:</label>
        <input type="text" id="login-username" v-model="username" required>
      </div>

      <div class="form-group">
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" v-model="password" required autocomplete="current-password">
      </div>

      <button type="submit" class="login-button">Login</button>
    </form>

    <p class="signup-prompt">Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
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

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button.login-button {
  width: 100%;
  padding: 10px;
  background-color: rgb(175, 76, 160); /* The specified purple color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

button.login-button:hover {
  background-color: #d900ff; /* Change or remove this line if you want a different hover effect */
  transform: translateY(-2px);
}

.signup-prompt {
  text-align: center;
  margin-top: 20px;
}

.router-link {
  color: rgb(175, 76, 160);
  text-decoration: none;
}

.router-link:hover {
  text-decoration: underline;
}
</style>