<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <PhoneNumber />
  </div>
</template>

<script>
import PhoneNumber from './PhoneNumber'

export default {
  name: 'app',
  components: {
    PhoneNumber
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
