<template>
  <div class="container">
    <h1>Focus Session</h1>
    <form @submit.prevent="createMusicSelection">
      <!-- Input field for date -->
      <label for="session-date" style="display: none;">Session Date</label>
      <input type="date" v-model="selectionData.date" id="session-date" name="session-date" title="Choose your session date" required="" style="display: none;">
      
      <!-- Input field for start time -->
      <label for="start-time" style="display: none;">Start Time</label>
      <input type="time" v-model="selectionData.start_time" id="start-time" name="start-time" required="" style="display: none;">
      
      <!-- Input field for end time -->
      <label for="end-time" style="display: none;">End Time</label>
      <input type="time" v-model="selectionData.end_time" id="end-time" name="end-time" required="" style="display: none;">
      
      <!-- Input field for subject -->
      <label for="subject">Subject</label>
      <input type="text" v-model="selectionData.subject" id="subject" name="subject" placeholder="Subject" required>
      
      <!-- Input field for notes -->
      <label for="notes">Notes</label>
      <textarea v-model="selectionData.notes" id="notes" name="notes" placeholder="Notes" style="height: 150px; width: 70%; margin: 0 auto; display: block;"></textarea>

      <!-- Add other fields as necessary -->
     <!-- Add other fields as necessary -->
    <button ref="createButton" type="submit" style="background: none; border: none; color: inherit; padding: 0; font: inherit; cursor: pointer;">
    <span style="font-size: 1px; padding: 0;">Study Hard!</span>
    </button>
      <!-- Button to prefill end time -->
      <button type="button" @click="prefillEndTime" style="background: none; border: 1px solid #3498db; color: #3498db; padding: 5px 10px; font: inherit; cursor: pointer; border-radius: 5px; transition: background 0.3s, color 0.3s;">
  End Study Session</button>

    <!-- Button to navigate to StudySessions.vue -->
        <router-link to="/study-sessions">
  <button type="button" style="background: none; border: 1px solid #3498db; color: #3498db; padding: 5px 10px; font: inherit; cursor: pointer; border-radius: 5px; transition: background 0.3s, color 0.3s;">
    Go back to Study Sessions
  </button>
      </router-link>
    </form>
    
    <!-- Area to display existing music selections -->
    <div id="selections-display">
    </div>
    
    <div id="messageBox" :style="{ color: messageColor }">{{ message }}</div>
    <!-- Add these lines to display the values -->
    <div>Date: {{ selectionData.date }}</div>
    <div>Start Time: {{ selectionData.start_time }}</div>
  </div>
  <div class="timer-component">
      <Timer />
  </div>
  <div class="inspirational-message-container">
      <InspirationalMessage />
  </div>
</template>
<script>
import Timer from './TimerComponent.vue';
import InspirationalMessage from './InspirationalMessage.vue';
export default {
  components: {
  InspirationalMessage,Timer},
  data() {
    return {
      selectionData: {
        date: '',
        start_time: '',
        end_time: '',
        subject: '',
        notes: '',
      },
      message: '',
      messageColor: '',
    };
  },
  // Prefill start-time with the current time up to minutes
  created() {
    // Prefill session-date with the current date
    const currentDate = new Date().toISOString().split('T')[0];
    this.selectionData.date = currentDate;

    // Prefill start-time with the current time in 24-hour format
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    this.selectionData.start_time = currentTime;
  },
  methods: {
    prefillEndTime() {
      // Prefill end-time with the current time in 24-hour format
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      this.selectionData.end_time = currentTime;
      this.$nextTick(() => {
        // Trigger the click event of the "Create Selection" or "Create Session" button
        // Replace 'createMusicSelection' or 'createStudySession' with your actual method name
        this.$refs.createButton.click(); // Assuming you have a ref on the button like <button ref="createButton" @click="createMusicSelection">Create Selection</button>
      });
    },
    createMusicSelection() {
      const musicSelectionData = { ...this.selectionData };
      // Adjust the API endpoint as needed
      fetch('/api/study-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(musicSelectionData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data.id) {
          this.displaySuccessMessage();
        } else {
          this.displayErrorMessage(data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        this.displayErrorMessage('An error occurred while creating the selection: ' + (error.message || 'Check console for details.'));
      });
    },
    displaySuccessMessage() {
      this.message = "Study Session finished! Great Job!";
      this.messageColor = "green";
      this.clearFormData();
    },
    displayErrorMessage(errorMessage){
      this.message = errorMessage;
      this.messageColor = "red";
    },
    clearFormData() {
      this.selectionData = {
        date: '',
        start_time: '',
        end_time: '',
        subject: '',
        notes: '',
      };
    },
  },
};
</script>

<style scoped>
/* Style for the Notes textarea */
.notes-label {
  display: block;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-family: 'cursive'; /* Set the desired cursive font */
}

.notes-container {
  text-align: center;
}

textarea#notes {
  width: 80%; /* Adjust the width as needed */
  padding: 10px;
  font-family: 'cursive'; /* Set the same cursive font */
  font-size: 1.2rem;
  border: 2px solid #3498db;
  border-radius: 5px;
  margin: 0 auto; /* Center the textarea */
}

  label[for="session-date"],
  label[for="start-time"],
  label[for="end-time"],
  input#session-date,
  input#start-time,
  input#end-time {
    display: none;
  }
  .timer-component {
  float: right;
  width: 30%;
  margin-right: 10px;
}
</style>
