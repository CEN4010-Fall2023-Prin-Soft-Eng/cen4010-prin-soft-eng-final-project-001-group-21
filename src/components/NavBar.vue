<template>
    <nav>
      <ButtonComponent
        :isActive="isPageActive('home')"
        @button-click="navigateTo('home')"
      >Home</ButtonComponent>
      <ButtonComponent
        :isActive="isPageActive('calendar')"
        @button-click="navigateTo('calendar')"
      >Calendar</ButtonComponent>
      <ButtonComponent
        :isActive="isPageActive('study-sessions')"
        @button-click="navigateTo('study-sessions')"
      >Focus Session</ButtonComponent>
    </nav>
  </template>
  
  <script>
  import ButtonComponent from './ButtonComponent.vue';
  
  export default {
    components: {
      ButtonComponent
    },
    methods: {
      navigateTo(pageName) {
        this.$emit('navigate', pageName);
      },
      isPageActive(pageName) {
        return this.$route.name === pageName;
      }
    }
  };
  </script>
  
  <style>
  /* Style your navbar here */
  </style>
  