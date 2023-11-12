<template>
    <div>
      <NavBar @navigate="handleNavigation" />
      <router-view />
    </div>
  </template>
  
  <script>
  import NavBar from './components/NavBar';
  
  export default {
    components: {
      NavBar
    },
    methods: {
      handleNavigation(pageName) {
        this.$router.push({ name: pageName });
      }
    }
  };
  </script>
  
  <style>
  /* Your CSS here */
  </style>
  