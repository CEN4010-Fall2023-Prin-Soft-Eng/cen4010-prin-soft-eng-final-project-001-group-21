<template>
    <div class="inspirational-message">
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        message: '',
      };
    },
    methods: {
      fetchInspirationalMessage() {
        // You can fetch inspirational messages from an API or define them locally
        const inspirationalMessages = [
          "Believe you can and you're halfway there.",
          "The only way to do great work is to love what you do.",
          "Your time is limited, don't waste it living someone else's life.",
          // Add more inspirational messages as needed
        ];
  
        // Select a random message
        this.message = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
      },
    },
    mounted() {
      // Fetch an initial message when the component is mounted
      this.fetchInspirationalMessage();
  
      // Set up an interval to fetch a new message every 5 minutes
      setInterval(() => {
        this.fetchInspirationalMessage();
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
    },
  };
  </script>
  
  <style scoped>
  /* Add styling for your inspirational message component as needed */
  .inspirational-message {
    background-color: #e0e0e0;
    padding: 10px;
    border-radius: 5px;
    margin: 10px;
    text-align: center;
  }
  </style>
  