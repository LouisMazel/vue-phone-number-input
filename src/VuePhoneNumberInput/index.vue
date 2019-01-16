<template>
  <div
    :class="{ 'dark': dark }"
    class="vue-phone-number-input flex"
  >
    <div class="select-country-container">
      <SelectCountry
        v-model="codeCountry"
        :items="codesCountries"
        :color="color"
        :dark="dark"
        label="Country Code"
        class="input-country-selector"
      />
    </div>
    <div class="flex-1">
      <VueInputUI
        v-model="phoneNumber"
        label="Phone number"
        :error="!numberIsValid"
        :hint="codeCountry ? phoneNumberHint : 'Choose country'"
        :color="color"
        :dark="dark"
        class="input-phone-number"
      />
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import CodesCountries from './assets/js/phoneCodeCountries.js'
  import { parseNumber, format, isValidNumber, AsYouType } from 'libphonenumber-js'
  import VueInputUI from 'vue-input-ui'
  import 'vue-input-ui/dist/vue-input-ui.css'
  import SelectCountry from './_subs/CountrySelector'

  export default {
    name: 'VuePhoneNumberInput',
    components: {
      VueInputUI,
      SelectCountry
    },
    props: {
      value: { type: Object, default: Object },
      color: { type: String, default: String },
      dark: { type: Boolean, default: Boolean }
    },
    data () {
      return {
        phoneNumberHint: '',
        formatter: null,
        numberIsValid: true
      }
    },
    created () {
      this.formatter = new AsYouType(this.codeCountry)
    },
    computed: {
      codeCountry: {
        get () {
          return this.value.code
        },
        set (country) {
          this.$emit('input', { phoneNumber: this.phoneNumber, code: country})
          // this.formatter = new AsYouType(country)
          // if (this.phoneNumber) {
          //   this.updateNumberAfterChangeCountry(this.phoneNumber)
          // }
        }
      },
      codesCountries () {
        return CodesCountries
      },
      phoneNumber: {
        get () {
          return this.value.phoneNumber
        },
        set (newPhone) {
          this.$emit('input', { phoneNumber: newPhone, code: this.codeCountry})
          // const inputNumber = this.updateFormatNumber(newPhone)
          // this.formatNumberLogic(inputNumber, newPhone)
        }
      }
    },
    methods: {
      resetFormatNumber (val) {
        this.formatter.reset()
        let format
        let chars = val.split('')
        chars.map((charac) => {
          format = this.formatter.input(charac)
        })
        return format
      },
      updateFormatNumber (val) {
        return this.formatter.input(val.slice(-1))
      },
      updateNumberAfterChangeCountry (val) {
        this.formatNumberLogic(this.resetFormatNumber(val), this.phoneNumber)
      },
      formatNumberLogic (inputNumber, val) {
        const numberParsed = parseNumber(val, this.codeCountry)
        if (Object.keys(numberParsed).length) {
          this.numberIsValid = isValidNumber(numberParsed)
          if (this.numberIsValid) {
            this.$emit('update-phone', {val: format(numberParsed.phone, this.codeCountry, 'International'), isValid: true})
            this.phoneNumberHint = format(numberParsed.phone, this.codeCountry, 'International')
          }
        } else if (val.length) {
          this.$emit('update-phone', {val: this.phoneNumber, isValid: false})
          this.phoneNumberHint = format(val, this.codeCountry, 'International')
          this.numberIsValid = false
        } else {
          this.$emit('update-phone', {val: null, isValid: false})
          this.phoneNumberHint = ''
          this.numberIsValid = true
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "./assets/scss/flexbox-helper.scss";
  @import "./assets/flags/flags.css";
  *, *::before, *::after {
    box-sizing: border-box;
  }
  .vue-phone-number-input {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    .select-country-container {
      flex: 0 0 130px;
      width: 130px;
      min-width: 130px;
      max-width: 130px;
    }
    .country-selector {
      cursor: pointer;
    }
    .input-country-selector {
      margin-right: -1px;
      input {
        border-top-right-radius: 0 !important; 
        border-bottom-right-radius: 0 !important;
      }
    }
    .input-phone-number input {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    &:not(.dark) {
      .input-phone-number input {
        background-color: transparent !important;
      }
    }
  }
</style>
