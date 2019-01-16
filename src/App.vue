<template>
  <div id="app">
    <h1>VuePhoneNumberInput</h1>
    <button
      class="btn"
      @click="dark = !dark"
    >
      Enable Dark Mode
    </button>
    <VuePhoneNumberInput
      v-model="value"
      color="purple"
      :dark="dark"
    />
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
        },
        dark: false
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
