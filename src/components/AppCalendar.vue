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
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.nav-button {
  background-color: #e7e7e7;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background-color: #d4d4d4;
}

h2 {
  font-size: 1.8rem;
  color: #333;
}

.exam-scheduler {
  margin-bottom: 2rem;
}

.exam-scheduler h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.exam-scheduler form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.exam-scheduler input,
.exam-scheduler textarea {
  border: 1px solid #ccc;
  padding: 0.8rem;
  font-size: 1rem;
}

.exam-scheduler textarea {
  height: 100px;
  resize: vertical;
}

.exam-scheduler button {
  padding: 0.8rem;
  border: none;
  background-color: #5cb85c;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.exam-scheduler button:hover {
  background-color: #4cae4c;
}

#exams-container {
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .calendar {
    padding: 2rem;
  }

  .exam-scheduler form {
    grid-template-columns: repeat(2, 1fr);
  }

  .exam-scheduler button {
    grid-column: span 2;
  }
}
</style>
