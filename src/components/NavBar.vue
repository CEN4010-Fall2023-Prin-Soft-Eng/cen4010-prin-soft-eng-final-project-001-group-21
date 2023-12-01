<template>
  <nav>
    <ButtonComponent
      :isActive="isPageActive('home')"
      @button-click="navigateTo('home')"
    >Home</ButtonComponent>
    <ButtonComponent
      :isActive="isPageActive('calendar')"
      @button-click="navigateTo('calendar')"
    >Schedule Exam</ButtonComponent>
    <ButtonComponent
      :isActive="isPageActive('study-sessions')"
      @button-click="navigateTo('study-sessions')"
    >Study Session</ButtonComponent>
    <!-- New ButtonComponent for Music Selection -->
    <ButtonComponent
      :isActive="isPageActive('Focus Session')"
      @button-click="navigateTo('music-selection')"
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
  



<style scoped>
/* Style for the nav bar */
nav {
  display: flex;
  justify-content: center; /* Center the nav items horizontally */
  align-items: center;
  gap: 10px;
  width: 100%; /* Ensure the nav is full width */
  background-color: #373737; /* Light grey background */
  padding: 6px 0; /* Add padding on top and bottom */
  margin: 0; /* Remove any margin */
}

/* Additional styles for the ButtonComponent can go here, for example: */
.button-component-class { /* Replace with actual class if it exists */
  padding: 10px 20px;
  background-color: #4285F4;
  color: white;
  border: none;
  cursor: pointer;
}

.button-component-class:hover {
  background-color: #357ae8;
}

</style>
  