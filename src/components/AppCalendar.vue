<template>
  <div class="calendar">
    <div class="exam-scheduler">
      <h2>Schedule Exam</h2>
      <form @submit.prevent="scheduleExam">
        <input type="date" v-model="newExam.date" required />
        <input type="text" id="subject" name="subject" v-model="newExam.subject" placeholder="Subject" required />
        <input type="time" v-model="newExam.start_time" placeholder="Start Time" required />
        <textarea id="notes" name="notes" v-model="newExam.notes" placeholder="Notes"></textarea>
        <button type="submit">Schedule</button>
      </form>
    </div>
    <h1>Scheduled Exams</h1>
    <div>
      <label for="examDropdown">Select Exam:</label>
      <select id="examDropdown" v-model="selectedExamId">
        <option value="">Select an exam</option>
        <option v-for="exam in scheduledExams" :key="exam.id" :value="exam.id">{{ exam.subject }}</option>
      </select>
      <button @click="deleteExam(selectedExamId)">Delete</button>
    </div>
    <div v-if="selectedExam">
      <h3>Selected Exam Details</h3>
      <p><strong>Subject:</strong> {{ selectedExam.subject }}</p>
      <p><strong>Date:</strong> {{ formatExamDate(selectedExam.exam_date) }}</p>
      <p><strong>Start Time:</strong> {{ formatExamTime(selectedExam.start_time) }}</p>
      <p><strong>Notes:</strong> {{ selectedExam.notes }}</p> <!-- Added Notes field -->
    </div>
      <h3>List of Scheduled Exams</h3>
      <ul>
        <li v-for="exam in scheduledExams" :key="exam.id">
          {{ exam.subject }} - {{ formatExamDate(exam.exam_date) }} - {{ formatExamTime(exam.start_time) }}
        </li>
      </ul>
    </div>
</template>




<script>
export default {
  data() {
    return {
      scheduledExams: [],
      newExam: { date: '', subject: '', start_time: '', notes: '' },
      selectedExamId: '', // Added a selectedExamId data property
    };
  }, 
  computed: {
    selectedExam() {
      return this.scheduledExams.find((exam) => exam.id === this.selectedExamId);
    },
  },
  methods: {
    async scheduleExam() {
      const { date, subject, start_time, notes } = this.newExam;
      const user_id = 1; // Replace with the actual user ID logic

      try {
        const response = await fetch('/api/calendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id, subject, exam_date: date, start_time, notes }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        this.newExam = { date: '', subject: '', start_time: '', notes: '' };
        await this.fetchExams();
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async deleteExam(examId) {
      try {
        const response = await fetch(`/api/calendar/${examId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Remove the deleted exam from the local list
        this.scheduledExams = this.scheduledExams.filter((exam) => exam.id !== examId);
        this.selectedExamId = ''; // Clear the selected exam
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async fetchExams() {
      try {
        const response = await fetch('/api/calendar');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.scheduledExams = await response.json(); // Populate scheduledExams with fetched exams
      } catch (error) {
        console.error('Error:', error);
      }
    },
    formatExamDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    formatExamTime(timeString) {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
  },
  mounted() {
    this.fetchExams(); // Fetch exams when the component is mounted
  },
};
</script>



<style scoped>
.calendar {
  max-width: 800px;
  margin: 30px auto;
  padding: 2rem;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

h1, h2, h3 {
  text-align: center;
  color: #333;
  font-family: 'Arial', sans-serif;
}

h1 {
  margin: 1rem 0;
}

h2 {
  font-size: 1.5rem;
  margin: 1rem 0;
}

.exam-scheduler {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 2rem;
}

form {
  display: grid;
  grid-gap: 1rem;
  margin-bottom: 1rem;
}

input[type="date"],
input[type="text"],
input[type="time"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Arial', sans-serif;
}

textarea {
  height: 100px; /* Reduced height */
  resize: vertical;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  transition: background-color 0.3s, transform 0.3s;
}

button[type="submit"] {
  background-color: rgb(175, 76, 160); /* purple color */
  color: white;
}

/* Hover effect for Schedule button */
button[type="submit"]:hover {
  background-color: rgb(216, 100, 197); /* Darker purple on hover */
  transform: translateY(-2px); /* Lift effect */
}

/* Delete button style */
button:not([type]) {
  background-color: #ffc400; /* Orange color */
  color: white;
}

/* Hover effect for Delete button */
button:not([type]):hover {
  background-color: #e50000; /* Darker orange on hover */
  transform: translateY(-2px); /* Lift effect */
}

select {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fafafa;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

li:last-child {
  border-bottom: none;
}

@media (min-width: 768px) {
  .exam-scheduler form {
    grid-template-columns: repeat(2, 1fr);
  }

  button[type="submit"] {
    grid-column: span 2; /* Button spans both columns */
  }

  ul {
    padding-left: 20px; /* Padding for list */
  }
}
</style>
