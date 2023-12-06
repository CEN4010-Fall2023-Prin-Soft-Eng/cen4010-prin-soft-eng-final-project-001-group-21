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
      const inspirationalMessages = [
        "Believe you can and you're halfway there.",
        "The only way to do great work is to love what you do.",
        "Your time is limited, don't waste it living someone else's life.",
        "Don’t let what you cannot do interfere with what you can do.",
        "Start where you are. Use what you have. Do what you can.",
        "The secret of getting ahead is getting started.",
        "The best way to predict your future is to create it.",
        "You don’t have to be great to start, but you have to start to be great.",
        "Success is the sum of small efforts, repeated day in and day out.",
        "The expert in anything was once a beginner.",
        "Strive for progress, not perfection.",
        "There are no shortcuts to any place worth going.",
        "Failure is the opportunity to begin again more intelligently.",
        "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.",
        "You are braver than you believe, stronger than you seem, and smarter than you think.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "It always seems impossible until it is done.",
        "The best time to plant a tree was 20 years ago. The second best time is now.",
        "You don’t drown by falling in the water; you drown by staying there.",
        "Procrastination makes easy things hard and hard things harder.",
      ];

      this.message = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
    },
  },
  mounted() {
    this.fetchInspirationalMessage();
    setInterval(this.fetchInspirationalMessage, 3 * 60 * 1000);
  },
};
</script>

  
<style scoped>
.inspirational-message {
  background-color: #f0f8ff; /* Soft blue background */
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* subtle shadow for depth */
  border-left: 5px solid #3498db; /* a colored border on the left for accent */
  font-family: 'Arial', sans-serif; /* clean, readable font */
  color: #333; /* dark gray color for text */
}

.inspirational-message p {
  font-size: 1.2rem; /* slightly larger text for impact */
  line-height: 1.6; /* more readable line spacing */
  margin: 0; /* remove default margin from <p> */
  color: #2c3e50; /* darker color for contrast */
  font-weight: 500; /* medium font weight for emphasis */
}

@media (max-width: 600px) {
  .inspirational-message {
    margin: 20px 10px; /* smaller side margins for narrow screens */
    padding: 15px; /* slightly less padding for narrow screens */
  }

  .inspirational-message p {
    font-size: 1rem; /* smaller font size for narrow screens */
  }
}
</style>
