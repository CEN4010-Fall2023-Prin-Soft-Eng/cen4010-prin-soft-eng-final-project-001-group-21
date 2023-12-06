
<template>
  <button :class="{ active: isActive }" @click="onClick" @mouseenter="grow" @mouseleave="shrink">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    grow(event) {
      event.target.style.transform = "scale(1.1)";
    },
    shrink(event) {
      event.target.style.transform = "scale(1)";
    },
    onClick() {
      this.$emit('button-click'); // Changed event name to 'button-click' for clarity
    },
  },
}
</script>

<style scoped>
button {
  background-color: #f0f0f0; /* light grey background */
  border: 1px solid #d0d0d0; /* darker grey border */
  padding: 10px 20px; /* some padding around the text */
  cursor: pointer; /* change mouse cursor to indicate clickable */
}
button.active {
  background-color: rgb(175, 76, 160); /* green background for active button */
  color: white; /* white text color for better contrast on green bg */
  border-color: #7a3678; /* darker green border for some depth */
}
</style>
