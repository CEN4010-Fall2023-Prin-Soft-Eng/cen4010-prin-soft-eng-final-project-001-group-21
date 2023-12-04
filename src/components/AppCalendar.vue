<template>
  <div class="calendar">
    <div class="calendar-header">
      <button class="nav-button" @click="previousMonth" @mouseenter="grow" @mouseleave="shrink">&lt;</button>
      <h2>{{ currentMonthName }} {{ currentYear }}</h2>
      <button class="nav-button" @click="nextMonth" @mouseenter="grow" @mouseleave="shrink">&gt;</button>
    </div>
    <div class="calendar-body">
      <div class="day" v-for="dayOfWeek in daysOfWeek" :key="dayOfWeek">{{ dayOfWeek }}</div>
      <div v-for="day in daysInMonth" :key="day.date" @click="selectDate(day.date)" 
           :class="['date', { 'has-exam': isDateScheduled(day.date) }]">
        {{ day.day }}
        <div v-for="exam in filteredExams(day.date)" :key="exam.id">
          {{ exam.subject }}
        </div>
      </div>
    </div>
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
  </div>
</template>


<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      scheduledExams: [],
      newExam: { date: '', subject: '', start_time: '', notes: '' } // Updated newExam
    };
  },
  computed: {
    currentMonthName() {
      return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
    },
    daysInMonth() {
      const days = [];
      const date = new Date(this.currentYear, this.currentMonth, 1);
      while (date.getMonth() === this.currentMonth) {
        days.push({
          day: date.getDate(),
          date: new Date(date)
        });
        date.setDate(date.getDate() + 1);
      }
      return days;
    },
    filteredExams() {
      return (date) => this.scheduledExams.filter(exam => exam.date === this.formatDate(date));
    },
    isDateScheduled() {
      return (date) => this.scheduledExams.some(exam => exam.date === this.formatDate(date));
    }
  },
  methods: {
    selectDate(date) {
      console.log('Date selected:', date);
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear -= 1;
      } else {
        this.currentMonth -= 1;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear += 1;
      } else {
        this.currentMonth += 1;
      }
    },async mounted() {
  try {
    const response = await fetch('/calendar');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched data:', data); // Log the data to the console
    this.scheduledExams = data; // Update your component's data with the fetched data
  } catch (error) {
    console.error('Error:', error);
  }

  },
  async scheduleExam() {
  const { date, subject, start_time, notes } = this.newExam;
  const user_id = 1; // Replace with the actual user ID logic

  try {
    const response = await fetch('/calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, subject, exam_date: date, start_time, notes }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Instead of waiting for and using response.json(), simply reset the newExam object
    this.newExam = { date: '', subject: '', start_time: '', notes: '' };
  } catch (error) {
    console.error('Error:', error);
  }
}
  }
}

</script>


<style scoped>
  .calendar {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .calendar-header {
    display: flex;
    align-items: center;
  }
  .calendar-header .nav-button {
    background-color: #f0f0f0;
    border: 1px solid #d0d0d0;
    padding: 8px 16px;
    cursor: pointer;
  }
  .nav-button:hover {
    transform: scale(1.1);
  }
  .calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }
  .day, .date {
    text-align: center;
    margin: 5px;
    padding: 10px;
    border: 1px solid #ccc;
    cursor: pointer;
  }
  .date.has-exam {
    background-color: #ffecb3;
  }
  .exam-scheduler {
    margin-top: 20px;
  }
  .exam-scheduler form {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
  .exam-scheduler input, .exam-scheduler textarea {
    margin-bottom: 10px;
    padding: 8px;
  }
  .exam-scheduler button {
    cursor: pointer;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
  }
  /* Style for the container of the tables */
.table-container {
  display: flex;
  justify-content: center;
}
/* Style for the table */
.scheduled-exams-table {
  border-collapse: collapse;
  width: 80%;
  margin: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
/* Style for table headers */
.scheduled-exams-table th {
  background-color: #f2f2f2;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
  padding: 10px;
  text-align: left;
}
/* Style for table rows */
.scheduled-exams-table td {
  border-bottom: 1px solid #ddd;
  padding: 10px;
}
/* Style for alternating rows */
.scheduled-exams-table tr:nth-child(even) {
  background-color: #f2f2f2;
}
/* Hover effect for rows */
.scheduled-exams-table tr:hover {
  background-color: #ddd;
}

</style>

