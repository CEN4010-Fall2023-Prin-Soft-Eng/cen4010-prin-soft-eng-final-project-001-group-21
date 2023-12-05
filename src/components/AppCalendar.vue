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
    <div id="exams-container">
      <div v-for="exam in scheduledExams" :key="exam.id">
        <p>{{ exam.subject }} on {{ formatExamDate(exam.exam_date) }} at {{ exam.start_time }}</p>
        <!-- Add more exam details here -->
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      scheduledExams: [],
      newExam: { date: '', subject: '', start_time: '', notes: '' },
    };
  },
  methods: {
    async scheduleExam() {
      const { date, subject, start_time, notes } = this.newExam;
      const user_id = 1; // Replace with the actual user ID logic

      try {
        const response = await fetch('/api/calendar', {  // Updated endpoint
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

    async fetchExams() {
      try {
        const response = await fetch('/api/calendar');  // Updated endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.scheduledExams = await response.json();
        localStorage.setItem('scheduledExams', JSON.stringify(this.scheduledExams));
      } catch (err) {
        console.error('Error:', err);
      }
    },
  mounted() {
    // Load from local storage if available
    if (localStorage.getItem('scheduledExams')) {
      this.scheduledExams = JSON.parse(localStorage.getItem('scheduledExams'));
    } else {
      this.fetchExams();
    }
  }
}
}
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
