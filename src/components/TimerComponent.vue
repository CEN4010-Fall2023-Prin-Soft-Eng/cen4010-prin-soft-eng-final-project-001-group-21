<template>
  <div>
    <label for="timer-select">Select Timer:</label>
    <select id="timer-select" v-model="selectedTime" @change="initializeTimer">
      <option value="300">5 minutes</option>
      <option value="900">15 minutes</option>
      <option value="1800">30 minutes</option>
      <option value="2700">45 minutes</option>
      <option value="3600">1 hour</option>
    </select>
    <p v-if="timeRemaining > 0">Time Remaining: {{ formattedTime }}</p>
    <p v-else>Time's up!</p>
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


#timer-select {
  margin-top: 10px; 
}
</style>
