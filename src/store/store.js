import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
    state() {
      return {
        // Initialize userToken from localStorage if it exists
        userToken: localStorage.getItem('token')
      };
    },
    getters: {
      isAuthenticated(state) {
        return state.userToken !== null;
      }
    },
    mutations: {
      INIT_TOKEN(state) {
        const token = localStorage.getItem('token');
        if (token) {
          state.userToken = token;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          state.userToken = null;
        }
      },
      SET_TOKEN(state, token) {
        console.log('SET_TOKEN mutation called with', token);
        state.userToken = token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },
      CLEAR_TOKEN(state) {
        console.log('CLEAR_TOKEN mutation called');
        console.log('Current token:', state.userToken);
        state.userToken = null;
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        console.log('Token after logout:', state.userToken);
      }
    },
    actions: {
      // Inside your Vuex store
      async fetchStudySessions({ commit }) {
        try {
          const response = await axios.get('/api/study-sessions');
          commit('SET_STUDY_SESSIONS', response.data);
        } catch (error) {
        console.error('Error fetching study sessions:', error);
        throw error;
      }
      },


      login({ commit }, credentials) {
        console.log('login action called with', credentials);
        return axios.post('/login', credentials)
          .then(({ data }) => {
            console.log('Login successful, received data:', data);
            commit('SET_TOKEN', data.token);
            console.log('Token set in store:', data.token);
            return data;
          }).catch((error) => {
            // Handle error here
            
            console.error('Login failed:', error.response || error);
            throw error; // Rethrow the error so it can be handled in the component
          });
      },
      logout({ commit }) {
        console.log('logout method called');
        commit('CLEAR_TOKEN');
      }
    }
  });
export default store;
