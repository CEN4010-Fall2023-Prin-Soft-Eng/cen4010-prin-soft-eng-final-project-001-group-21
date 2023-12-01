<template>
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="session in Study_Sessions" :key="session.id">
          <td>{{ session.id }}</td>
          <td>{{ session.subject }}</td>
          <td>{{ new Date(session.date).toLocaleDateString() }}</td>
          <td>{{ session.start_time }}</td>
          <td>{{ session.end_time }}</td>
          <td>{{ session.notes }}</td>
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
      Study_Sessions: []
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
    }
  },
  mounted() {
    this.fetchStudySessions();
  }
};
</script>
<style scoped>
.study-sessions-table, .scheduled-exams-table {
  max-width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

table {
  width: 100%;
  border-spacing: 0;
}

table th, table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f8f8f8;
  color: #333;
  font-weight: bold;
}

table tr:last-child td {
  border-bottom: none;
}

table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.total-time-studied {
  text-align: center;
  padding: 15px;
  font-size: 1.1em;
  background-color: #f8f8f8;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  border-radius: 5px;
  max-width: 50%;
}
</style>
