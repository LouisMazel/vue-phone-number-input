<template>
  <div>
    <h1>
      Component:
    </h1>
    <VuePhoneNumberInput
      id="phoneNumber1"
      v-model="phoneNumber"
      clearable
      @update="onUpdate"
    />
  </div>
</template>

<script>
  import VuePhoneNumberInput from './../VuePhoneNumberInput'
  export default {
    components: {
      VuePhoneNumberInput
    },
    data () {
      return {
        phoneNumber: null,
        results: null
      }
    },
    methods: {
      onUpdate (payload) {
        this.results = payload
      }
    }
  }
</script>
