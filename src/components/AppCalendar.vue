<template>
  <div class="calendar">
    <!-- ... Calendar header and body -->
    <div class="calendar-body">
      <!-- Days of the Week Header -->
      <div class="day" v-for="dayOfWeek in daysOfWeek" :key="dayOfWeek">{{ dayOfWeek }}</div>
      <!-- Dates in Month -->
      <div class="date" v-for="day in daysInMonth" :key="day.date" @click="selectDate(day.date)">
        {{ day.day }}
        <!-- Display study sessions for this date -->
        <div v-for="session in filteredStudySessions(day.date)" :key="session.id">
          {{ session.subject }}
          <!-- You can display other details of the study session here -->
        </div>
      </div>
    </div>
<!-- ... Calendar body above -->
</div>

<!-- Study Sessions Table -->
<div class="study-sessions-table">
  <h2>All Study Sessions</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Subject</th>
        <th>Date</th>
        <th>Start Time</th>
        <th>End Time</th>
        <th>Notes</th>
        <!-- Add other headers as needed -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="session in Study_Sessions" :key="session.id">
        <td>{{ session.id }}</td>
        <td>{{ session.subject }}</td>
        <td>{{ new Date(session.date).toLocaleDateString() }}</td>
        <td>{{ session.start_time }}</td>
        <td>{{ session.end_time}}</td>
        <td>{{ session.notes}}</td>
        <!-- Add other session details as needed -->
      </tr>
    </tbody>
  </table>
</div>
<div class="total-time-studied">
  Total Time Studied: {{ totalTimeStudied }}
</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      Study_Sessions: [],
    };
  },
  computed: {
    totalTimeStudied() {
    const totalMinutes = this.Study_Sessions.reduce((total, session) => {
      return total + this.calculateSessionDuration(session.start_time, session.end_time);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  },
    currentMonthName() {
      return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
    },
    daysInMonth() {
      const days = [];
      const date = new Date(this.currentYear, this.currentMonth, 1);
      while (date.getMonth() === this.currentMonth) {
        days.push({
          day: date.getDate(),
          date: new Date(date) // Store the full date for each day
        });
        date.setDate(date.getDate() + 1);
      }
      return days;
    },
    filteredStudySessions() {
      return (date) => {
        // Filter Study_Sessions based on the provided date
        return this.Study_Sessions.filter(session => session.date === date);
      };
    },
  },
  methods: {
    calculateSessionDuration(startTime, endTime) {
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    const startDate = new Date(0, 0, 0, start[0], start[1], start[2]);
    const endDate = new Date(0, 0, 0, end[0], end[1], end[2]);
    const diff = endDate - startDate;
    const durationInMinutes = Math.floor(diff / 60000);
    return durationInMinutes < 0 ? durationInMinutes + 1440 : durationInMinutes; // Add 24 hours if end time is past midnight
    },
    async fetchStudySessions() {
  try {
    const response = await axios.get('/api/study-sessions', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    this.Study_Sessions = response.data;
  } catch (error) {
    console.error('Error fetching study sessions:', error.response.data);
  }
},

    selectDate(date) {
      // Handle the date click event here
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
    },
  },
  mounted() {
    this.fetchStudySessions(); // Fetch study sessions when the component is mounted
  },
};
</script>

<style scoped>
  .calendar {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* 7 days of the week */
    gap: 5px;
  }
  .day, .date {
    text-align: center;
    margin: 5px;
    padding: 10px;
    border: 1px solid #ccc;
    cursor: pointer;
  }

.study-sessions-table {
  margin-top: 20px;
  width: 100%;
}

.study-sessions-table table {
  width: 100%;
  border-collapse: collapse;
}

.study-sessions-table th, .study-sessions-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.study-sessions-table th {
  background-color: #f2f2f2;
}

  /* ... other styles */
</style>
