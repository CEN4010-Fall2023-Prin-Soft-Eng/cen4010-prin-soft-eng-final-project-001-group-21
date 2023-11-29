import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/store'; // Make sure this is the correct path to your store

// Import your route components
import AppCalendar from '../components/AppCalendar';
import StudySessions from '../components/StudySessions';
import Login from '../components/LoginComponent';
import SignUpComponent from '../components/SignupComponent';
import homePage from'../components/homePage';


// Define your routes
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/homePage',
    name: 'home',
    component: homePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: AppCalendar,
    meta: { requiresAuth: true }
  },
  {
    path: '/study-sessions',
    name: 'study-sessions',
    component: StudySessions,
    meta: { requiresAuth: true }
  },
  {path: '/signup',
  name: 'signup',
  component: SignUpComponent,
  meta: { requiresAuth: false }
}
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  console.log(`Navigating to: ${to.path}`);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  console.log(`Requires Auth: ${requiresAuth}`);
  const isAuthenticated = store.getters.isAuthenticated;
  console.log(`Is Authenticated: ${isAuthenticated}`);

  // Check if the user is trying to access the login route while already authenticated
  if (to.name === 'login' && isAuthenticated) {
    console.log('Already authenticated, redirecting to home...');
    next({ name: 'home' }); // Redirect to a different route, e.g., the home page
  } else if (requiresAuth && !isAuthenticated) {
    console.log('Redirecting to Login...');
    next('/login');
  } else {
    next();
  }
});


export default router;