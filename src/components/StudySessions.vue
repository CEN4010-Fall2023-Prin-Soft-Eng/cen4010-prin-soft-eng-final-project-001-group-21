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

    convertTo12HourFormat(timeString) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = hours % 12 || 12; // Converts '0' to '12'
      return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    },

    calculateSessionDuration(startTime, endTime) {
    function parseTime(timeString) {
      const [time, modifier] = timeString.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return new Date(0, 0, 0, hours, minutes);
    }

    const startDate = parseTime(startTime);
    const endDate = parseTime(endTime);
    let diff = (endDate - startDate) / 60000; // diff in minutes
    if (diff < 0) diff += 24 * 60; // Adjust for sessions that end after midnight
    return diff;
  },
    async fetchStudySessions() {
      try {
        const response = await axios.get('/api/study-sessions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.Study_Sessions = response.data.map(session => ({
          ...session,
          start_time: this.convertTo12HourFormat(session.start_time),
          end_time: this.convertTo12HourFormat(session.end_time)
        }));
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
.study-sessions-table {
  max-width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  color: rgb(175, 76, 160); /* Purple color for the title */
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-spacing: 0;
}

table th, table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: rgb(175, 76, 160); /* Purple color for headers */
  color: white;
  font-weight: bold;
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
  max-width: 60%;
}

@media (max-width: 600px) {
  .study-sessions-table {
    margin: 10px;
  }
  .total-time-studied {
    max-width: 80%;
  }
}
</style>
