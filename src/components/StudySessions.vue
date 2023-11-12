<template>
    <div class="container">
      <h1>Study Sessions</h1>
      <!-- Form to create a new study session -->
      <form @submit.prevent="createStudySession">
        <!-- Input field for date -->
        <label for="session-date">Session Date</label>
        <input type="date" v-model="sessionData.date" id="session-date" name="session-date" title="Choose your session date" required="">
        
        <!-- Input field for start time -->
        <label for="start-time">Start Time</label>
        <input type="time" v-model="sessionData.start_time" id="start-time" name="start-time" required>
        
        <!-- Input field for end time -->
        <label for="end-time">End Time</label>
        <input type="time" v-model="sessionData.end_time" id="end-time" name="end-time" required>
        
        <!-- Input field for subject -->
        <label for="subject">Subject</label>
        <input type="text" v-model="sessionData.subject" id="subject" name="subject" placeholder="Subject" required>
        
        <!-- Input field for notes -->
        <label for="notes">Notes</label>
        <textarea v-model="sessionData.notes" id="notes" name="notes" placeholder="Notes"></textarea>
        
        <!-- Add other fields as necessary -->
        <button type="submit">Create Session</button>
      </form>
      
      <!-- Area to display existing study sessions -->
      <div id="sessions-display">
      </div>
      
      <div id="messageBox" :style="{ color: messageColor }">{{ message }}</div>
    </div>
  </template>

  <script>
    export default {
    data() {
      return {
        sessionData: {
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
    methods: {
      createStudySession() {
  const studySessionData = { ...this.sessionData };
  fetch('/api/study-sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the JWT in the Authorization header
    },
    body: JSON.stringify(studySessionData),
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
      // Optionally, if you want to show the updated list, you can call:
      // this.fetchStudySessions(); // If you have this method to fetch sessions
    } else {
      this.displayErrorMessage(data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    this.displayErrorMessage('An error occurred while creating the session: ' + (error.message || 'Check console for details.'));
  });
},
      displaySuccessMessage() {
      // Set a success message and style
      this.message = "Study session created successfully!";
      this.messageColor = "green"; // Assume you have a CSS class that styles this appropriately
      // Here you can also clear the form if needed or update the view
      this.clearFormData();
      //this.fetchStudySessions(); // If you want to refresh the list of sessions
      },
      displayErrorMessage(errorMessage){
        this.message=errorMessage;
        this.messageColor="red";
      },
      clearFormData() {
      // Reset the sessionData to its initial state
      this.sessionData = {
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

  </style>
  