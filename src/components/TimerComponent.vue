<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-lg-6 mx-auto">
        <form>
          <div class="form-group">
            <label for="timer-select" class="h4">Select Timer:</label>
            <select id="timer-select" class="form-control" v-model="selectedTime" @change="initializeTimer">
              <option value="300">5 minutes</option>
              <option value="600">10 minutes</option>
              <option value="900">15 minutes</option>
              <option value="1200">20 minutes</option>
              <option value="1500">25 minutes</option>
              <option value="1800">30 minutes</option>
              <option value="2100">35 minutes</option>
              <option value="2400">40 minutes</option>
              <option value="2700">45 minutes</option>
              <option value="3000">50 minutes</option>
              <option value="3300">55 minutes</option>
              <option value="3600">1 hour</option>
              <option value="5400">1 hour 30 minutes</option>
              <option value="7200">2 hours</option>
            </select>
          </div>
          <div v-if="timeRemaining > 0" class="alert alert-info mt-4" role="alert">
            Time Remaining: {{ formattedTime }}
          </div>
          <div v-else class="alert alert-success mt-4" role="alert">
            Time's up!
          </div>
        </form>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      selectedTime: 300, // Default to 5 minutes
      timeRemaining: 0,
      timer: null,
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeRemaining / 60);
      const seconds = this.timeRemaining % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
  },
  methods: {
    initializeTimer() {
      this.stopTimer();
      this.timeRemaining = this.selectedTime;
      this.startTimer();
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          this.stopTimer();
          // Optionally, you can emit an event or perform an action when the timer reaches 0
        }
      }, 1000); // Update every second
    },
    stopTimer() {
      clearInterval(this.timer);
    },
  },
  beforeUnmount() {
    this.stopTimer();
  },
};
</script>


<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff; /* White background */
  font-family: 'Arial', sans-serif;
}

h1, h2, label {
  text-align: center;
  color: #333;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem; /* Larger font size for the main title */
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

select {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.alert {
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  margin-top: 1rem;
  font-size: 1.1rem;
}

.alert-info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

button {
  background-color: rgb(175, 76, 160); /* Purple color */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: rgb(155, 66, 140); /* Slightly darker purple on hover */
  transform: translateY(-2px); /* Lift effect */
}

@media (max-width: 600px) {
  .container {
    padding: 1rem;
  }
}
</style>

