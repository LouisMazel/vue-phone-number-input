<template>
  <div class="ctk-phone-number flex">
    <div class="select-country-container">
      <select-country
        v-model="codeCountry"
        :value-to-show="valueToShow"
        :items="codesCountries"
        :label="$t('country_code')"
        :is-open="isOpen"
        @toggle="toggleCountrySelector"
      />
    </div>
    <div class="flex-1">
      <VueInputUI
        v-model="phoneNumber"
        :label="$t('phone_number') + ' (' + $t('optionnal') + ')'"
        :error="!numberIsValid"
        :hint="codeCountry ? phoneNumberHint:$t('choose_country')"
        class="input-text-phone"
      />
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import CodesCountries from './assets/js/phoneCodeCountries.json'
  import { parseNumber, format, isValidNumber, AsYouType } from 'libphonenumber-js'
  import VueInputUI from 'vue-input-ui'
  import 'vue-input-ui/dist/vue-input-ui.css'
  import SelectCountry from './_subs/SelectCountry'
  export default {
    name: 'PhoneNumber',
    components: {
      VueInputUI,
      SelectCountry
    },
    data () {
      return {
        codeCountry: null,
        codesCountries: CodesCountries,
        phoneNumber: '',
        phoneNumberHint: '',
        formatter: null,
        numberIsValid: true,
        isOpen: false
      }
    },
    created () {
      this.codeCountry = 'FR'
      this.formatter = new AsYouType(this.codeCountry)
    },
    computed: {
      valueToShow () {
        return this.codesCountries.filter(x => x.code === this.codeCountry).map(x => x.name)[0]
      }
    },
    watch: {
      phoneNumber (val, oldVal) {
        let inputNumber
        if ((val.length < oldVal.length)) {
          inputNumber = this.resetFormatNumber(val)
        } else {
          inputNumber = this.updateFormatNumber(val)
        }
        this.formatNumberLogic(inputNumber, val)
      },
      codeCountry (country) {
        this.formatter = new AsYouType(country.code)
        if (this.phoneNumber) {
          this.updateNumberAfterChangeCountry(this.phoneNumber)
        }
      }
    },
    methods: {
      toggleCountrySelector (val) {
        this.isOpen = val
      },
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
  .ctk-phone-number {
    .select-country-container {
      flex: 0 0 130px;
    }
    .chip--select-multi {
      margin: 5px 5px 5px 1px;
      height: 20px;
    }
    .country-selector {
      cursor: pointer;
      &:hover {
        background: #CCC;
      }
    }
    .input-text-phone .field-input {
      border-top-left-radius: 0 !important;
      margin-left: -1px !important;
      border-bottom-left-radius: 0 !important;
    }
  }
</style>
