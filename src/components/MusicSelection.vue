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
        <button type="button" @click="prefillEndTime" style="background: none; border: 1px solid rgb(175, 76, 160);; color: rgb(175, 76, 160);; padding: 5px 10px; font: inherit; cursor: pointer; border-radius: 5px; transition: background 0.3s, color 0.3s;">
    End Study Session</button>
  
      <!-- Button to navigate to StudySessions.vue -->
          <router-link to="/study-sessions">
    <button type="button" style="background: none; border: 1px solid rgb(175, 76, 160);; color: rgb(175, 76, 160); padding: 5px 10px; font: inherit; cursor: pointer; border-radius: 5px; transition: background 0.3s, color 0.3s;">
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
      InspirationalMessage,
      Timer
    },
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
        timerRunning: false, // Add a flag to track the timer state
      };
    },
    created() {
      this.selectionData.date = new Date().toISOString().split('T')[0];
      this.selectionData.start_time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      this.timerRunning = true; // Start the timer initially
    },
    methods: {
      prefillEndTime() {
        // Call the stopTimer method from the Timer component
        if (this.$refs.timer && this.timerRunning) {
          this.$refs.timer.stopTimer();
          this.timerRunning = false;
        }
        this.selectionData.end_time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        this.createMusicSelection();
      },
      createMusicSelection() {
        // Make sure to handle the promise correctly with async/await or then/catch
        fetch('/api/study-sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.selectionData),
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
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff; /* White background */
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  color: rgb(175, 76, 160);
  margin-bottom: 1.5rem;
}

form {
  display: grid;
  grid-gap: 1rem;
  padding: 1rem 0;
}

label {
  margin-bottom: 0.5rem;
  color: rgb(15, 1, 13);
  font-weight: bold;
}

input[type="text"],
input[type="date"],
input[type="time"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  height: 150px;
  resize: vertical;
}

button {
  background-color: rgb(175, 76, 160); /* Specified color for buttons */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: rgb(255, 49, 221); /* Slightly darker on hover */
  transform: translateY(-2px); /* Lift effect */
}

.router-link button {
  margin-top: 1rem;
}

@media (max-width: 600px) {
  .container {
    padding: 1rem;
  }

  .router-link button {
    width: 100%;
    margin-top: 1rem;
  }
}
</style>
