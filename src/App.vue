<template>
  <div id="app">
    <h1>VuePhoneNumberInput</h1>
    <VuePhoneNumberInput v-model="value" />
  </div>
</template>

<script>
  import VuePhoneNumberInput from './VuePhoneNumberInput'

  export default {
    name: 'App',
    components: {
      VuePhoneNumberInput
    },
    data () {
      return {
        value: {
          code: 'FR',
          phoneNumber: '0658584729'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
