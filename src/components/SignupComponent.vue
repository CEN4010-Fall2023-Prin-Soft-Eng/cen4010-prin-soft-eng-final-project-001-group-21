<template>
  <div class="signup-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="signup">
      <div class="form-group">
        <label for="signup-username">Username:</label>
        <input type="text" id="signup-username" v-model="username" required>
      </div>

      <div class="form-group">
        <label for="signup-email">Email:</label>
        <input type="email" id="signup-email" v-model="email" required>
      </div>

      <div class="form-group">
        <label for="signup-password">Password:</label>
        <input type="password" id="signup-password" v-model="password" required autocomplete="new-password">
      </div>

      <div class="form-group">
        <label for="signup-confirm-password">Confirm Password:</label>
        <input type="password" id="signup-confirm-password" v-model="confirmPassword" required>
        <span v-if="passwordMismatch" class="error-message">Passwords do not match.</span>
      </div>

      <button type="submit" class="signup-button">Sign Up</button>
    </form>
    <p class="login-prompt">Already have an account? <router-link to="/login">Login</router-link></p>
    <div v-if="feedbackMessage" :class="{'success-message': success, 'error-message': !success}">
      {{ feedbackMessage }}
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
    const passwordMismatch = ref(false);
    const feedbackMessage = ref('');
    const success = ref(false);
    const router = useRouter();

    const signup = async () => {
      if (password.value !== confirmPassword.value) {
        passwordMismatch.value = true;
        feedbackMessage.value = 'Passwords do not match.';
        return;
      }
      passwordMismatch.value = false;

      try {
        // Since the 'response' variable is not being used, you can omit it
        await axios.post('/signup', {
          username: username.value,
          email: email.value,
          password: password.value
        });
        feedbackMessage.value = 'Signup successful. Redirecting to login...';
        success.value = true;
        setTimeout(() => router.push('/login'), 3000);
      } catch (error) {
        // Make sure to handle the case where error.response may not exist
        feedbackMessage.value = 'Signup failed: ' + (error.response ? error.response.data : error.message);
        success.value = false;
      }
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      passwordMismatch,
      feedbackMessage,
      success,
      signup
    };
  }
};
</script>


<style scoped>
.signup-container {
  max-width: 450px; /* Adjusted width to accommodate larger fields */
  margin: 50px auto;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px; /* Increased space between form groups */
}

label {
  display: block;
  margin-bottom: 10px; /* More space below the label */
  font-weight: bold;
  color: #555;
}

.form-input {
  width: 100%; /* Full width of the container */
  padding: 15px 20px; /* Larger padding for a taller input box */
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px; /* Slightly rounded corners for aesthetics */
  font-size: 18px; /* Larger font size for better readability */
  box-sizing: border-box; /* Ensures padding doesn't affect the overall width */
}

.signup-button {
  width: 90%;
  padding: 15px 20px; /* Padding to match the input fields */
  font-size: 18px; /* Font size to match the input fields */
  border-radius: 5px;
  border: none;
  background-color: rgb(175, 76, 160); /* Purple color for the button */
  color: white;
  cursor: pointer;
  margin-top: 20px; /* Space between the last input and the button */
  transition: background-color 0.3s;
}

.signup-button:hover {
  background-color: rgb(150, 50, 140);
  transform: translateY(-2px);
}

.error-message {
  color: #d9534f;
}

.success-message {
  color: #5cb85c;
}

.login-prompt {
  margin-top: 25px;
}

.login-prompt a {
  color: rgb(175, 76, 160);
  text-decoration: none;
}

.login-prompt a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .signup-container {
    width: 95%;
    padding: 20px;
  }

  h2 {
    font-size: 24px;
  }

  .form-input, .signup-button {
    width: 100%; /* Full width on smaller screens */
    padding: 15px; /* Consistent padding on smaller screens */
  }
}
</style>
