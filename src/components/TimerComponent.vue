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
body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
  line-height: 1.6;
}

header, footer, .container {
  margin: auto;
  padding: 0 20px;
}

header {
  background: #333;
  color: #fff;
  padding-top: 30px;
  min-height: 70px;
  border-bottom: #eee solid 1px;
}

header a {
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  margin: 0 15px;
}

.container {
  max-width: 1200px;
  margin-top: 30px;
  padding: 20px;
  background: #fff;
}

button, select {
  background: #333;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover, select:hover {
  opacity: 0.9;
}

textarea, select {
  width: 100%;
  padding: 10px;
}

.card {
  background: #fff;
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 4px;
}

.quote {
  font-style: italic;
  opacity: 0.6;
}

.timer {
  font-size: 1.5em;
  margin-top: 20px;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    width: 95%;
    padding: 0;
  }
  
  header, footer, .container {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
