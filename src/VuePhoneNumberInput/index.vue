<template>
  <div
    :class="[{ 'dark': dark }, size]"
    class="vue-phone-number-input flex"
  >
    <div class="select-country-container">
      <CountrySelector
        :id="`${id}_country_selector`"
        ref="CountrySelector"
        v-model="countryCode"
        :items="codesCountries"
        :color="color"
        :error="shouldChooseCountry"
        :hint="shouldChooseCountry ? t.countrySelectorError : null"
        :dark="dark"
        :disabled="disabled"
        :valid="isValid && !noValidatorState"
        :preferred-countries="preferredCountries"
        :only-countries="onlyCountries"
        :ignored-countries="ignoredCountries"
        :label="t.countrySelectorLabel"
        :no-flags="noFlags"
        :size="size"
        class="input-country-selector"
      />
    </div>
    <div class="flex-1">
      <VueInputUI
        :id="`${id}_phone_number`"
        ref="PhoneNumberInput"
        v-model="phoneNumber"
        :label="inputLabel"
        :hint="isValid ? phoneFormatted : null"
        :color="color"
        :dark="dark"
        :disabled="disabled"
        :size="size"
        :valid="isValid && !noValidatorState"
        class="input-phone-number"
        @focus="$emit('phone-number-focused')"
      />
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import CodesCountries from './assets/js/phoneCodeCountries.js'
  import examples from 'libphonenumber-js/examples.mobile.json'
  import { parsePhoneNumberFromString, AsYouType, getExampleNumber } from 'libphonenumber-js'
  import VueInputUI from 'vue-input-ui'
  import 'vue-input-ui/dist/vue-input-ui.css'
  import CountrySelector from './_subs/CountrySelector'
  import locales from './assets/locales'

  const browserLocale = () => {
    const locale = window.navigator.userLanguage || window.navigator.language
    return locale.substr(0, 2).toUpperCase()
  }

  export default {
    name: 'VuePhoneNumberInput',
    components: {
      VueInputUI,
      CountrySelector
    },
    props: {
      value: { type: String, default: null },
      id: { type: String, default: 'VuePhoneNumberInput' },
      color: { type: String, default: 'dodgerblue' },
      dark: { type: Boolean, default: Boolean },
      disabled: { type: Boolean, default: Boolean },
      defaultCountryCode: { type: String, default: null },
      size: { type: String, default: String },
      preferredCountries: { type: Array, default: null },
      onlyCountries: { type: Array, default: null },
      ignoredCountries: { type: Array, default: Array },
      translations: { type: Object, default: Object },
      noValidatorState: { type: Boolean, default: false },
      noUseBrowserLocale: { type: Boolean, default: false },
      noFlags: { type: Boolean, default: false }
    },
    data () {
      return {
        results: {}
      }
    },
    mounted () {
      const locale = this.defaultCountryCode || (!this.noUseBrowserLocale ? browserLocale() : null)
      if (this.value && locale) {
        this.emitValues({ phoneNumber: this.value, countryCode: locale})
      }
    },
    computed: {
      t () {
        return {
          ...locales,
          ...this.translations
        }
      },
      inputLabel () {
        return this.phoneNumberExample ? `${this.t.phoneNumberLabel} (ex : ${this.phoneNumberExample})` : this.t.phoneNumberLabel
      },
      codesCountries () {
        return CodesCountries
      },
      countryCode: {
        get () {
          return this.results.countryCode || this.defaultCountryCode
        },
        set (newCountry) { 
          this.emitValues({countryCode: newCountry, phoneNumber: this.phoneNumber})
          this.$refs.PhoneNumberInput.$el.querySelector('input').focus()
        }
      },
      phoneNumber: {
        get () {
          return this.value
        },
        set (newPhone) {
          this.emitValues({countryCode: this.countryCode, phoneNumber: newPhone})
        }
      },
      shouldChooseCountry () {
        return !this.countryCode && !!this.phoneNumber
      },
      phoneFormatted () {
        return this.results.formatInternational
      },
      isValid () {
        return this.results.isValid
      },
      phoneNumberExample () {
        const phoneNumber = getExampleNumber(this.countryCode, examples)
        return this.countryCode ? phoneNumber.formatNational() : null
      }
    },
    methods: {
      getAsYouTypeFormat (payload) {
        const asYouType = new AsYouType(payload.countryCode)
        return asYouType.input(payload.phoneNumber)
      },
      getParsePhoneNumberFromString ({ phoneNumber, countryCode }) {
        const parsing = phoneNumber && countryCode ? parsePhoneNumberFromString(phoneNumber, countryCode) : null
        return {
          phoneNumber: phoneNumber ? phoneNumber : null,
          countryCode: countryCode,
          isValid: false,
          ...( parsing
            ? { 
              formattedNumber: parsing.number,
              nationalNumber: parsing.nationalNumber,
              isValid: parsing.isValid(),
              type: parsing.getType(),
              formatInternational: parsing.formatInternational(),
              formatNational: parsing.formatNational(),
              uri: parsing.getURI()
            }
            : null
          )
        }
      },
      emitValues (payload) {
        const asYouType = this.getAsYouTypeFormat(payload)
        this.$emit('input', asYouType)
        this.results = this.getParsePhoneNumberFromString(payload)
        this.$emit('update', this.results)
      }
    }
  }
</script>
<style lang="scss">
  @import "./assets/scss/flexbox-helper.scss";
  @import "./assets/iti-flags/flags.css";
  *, *::before, *::after {
    box-sizing: border-box;
  }
  .vue-phone-number-input {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    .select-country-container {
      flex: 0 0 120px;
      width: 120px;
      min-width: 120px;
      max-width: 120px;
    }
    &.sm .select-country-container {
      flex: 0 0 110px;
      width: 110px;
      min-width: 110px;
      max-width: 110px;
    }
    &.lg .select-country-container {
      flex: 0 0 130px;
      width: 130px;
      min-width: 130px;
      max-width: 130px;
    }
    .country-selector {
      cursor: pointer;
    }
    .select-country-container {
      margin-right: -1px;
      .input-country-selector input {
        border-top-right-radius: 0 !important; 
        border-bottom-right-radius: 0 !important;
      }
    }
    .input-phone-number input {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    .input-phone-number:not(.is-dark):not(.is-disabled) {
      input {
        background-color: transparent !important;
      }
    }
  }
</style>
