<template>
  <div
    :id="id"
    :class="[{ 'dark': dark }, size]"
    class="vue-phone-number-input flex"
  >
    <div
      v-if="!noCountrySelector"
      class="select-country-container"
    >
      <CountrySelector
        :id="`${uniqueId}_country_selector`"
        ref="CountrySelector"
        v-model="countryCode"
        :items="codesCountries"
        :countries-height="countriesHeight"
        :error="shouldChooseCountry"
        :hint="shouldChooseCountry ? t.countrySelectorError : null"
        :disabled="disabled"
        :valid="isValid && !noValidatorState"
        :preferred-countries="preferredCountries"
        :only-countries="onlyCountries"
        :ignored-countries="ignoredCountries"
        :label="t.countrySelectorLabel"
        :no-flags="noFlags"
        :show-code-on-list="showCodeOnList"
        :size="size"
        :dark="dark"
        :theme="theme"
        class="input-country-selector"
      >
        <slot
          slot="arrow"
          name="arrow"
        />
      </CountrySelector>
    </div>
    <div class="flex-1">
      <InputTel
        :id="`${uniqueId}_phone_number`"
        ref="PhoneNumberInput"
        v-model="phoneNumber"
        :label="t.phoneNumberLabel"
        :hint="hintValue"
        :dark="dark"
        :disabled="disabled"
        :size="size"
        :error="error"
        :valid="isValid && !noValidatorState"
        :required="required"
        :no-country-selector="noCountrySelector"
        v-bind="$attrs"
        :theme="theme"
        class="input-phone-number"
        @keydown="(e) => { lastKeyPressed = e.keyCode }"
        @focus="$emit('phone-number-focused')"
        @blur="$emit('phone-number-blur')"
      />
    </div>
  </div>
</template>
<script>
  import { countries, countriesIso } from './assets/js/phoneCodeCountries.js'
  import examples from 'libphonenumber-js/examples.mobile.json'
  import { parsePhoneNumberFromString, AsYouType, getExampleNumber } from 'libphonenumber-js'
  import InputTel from './InputTel'
  import CountrySelector from './CountrySelector'
  import locales from './assets/locales'
  import { HexToRgba, isColorName, colorNameToHex } from 'color-transformer-ui'

  const getShadowColor = (color) => {
    return isColorName(color) ? HexToRgba(colorNameToHex(color), 0.7) : HexToRgba(color, 0.7)
  }

  const browserLocale = () => {
    if (!window) return null
    const browserLocale = window.navigator.userLanguage || window.navigator.language
    let locale = browserLocale ? browserLocale.substr(3, 4).toUpperCase() : null
    if (locale === '') locale = browserLocale.substr(0, 2).toUpperCase()
    return locale
  }

  const isCountryAvailable = (locale) => {
    return countriesIso.includes(locale)
  }

  export default {
    name: 'MazPhoneNumberInput',
    components: {
      InputTel,
      CountrySelector
    },
    props: {
      value: { type: String, default: null },
      id: { type: String, default: 'MazPhoneNumberInput' },
      color: { type: String, default: 'dodgerblue' },
      validColor: { type: String, default: 'yellowgreen' },
      errorColor: { type: String, default: 'orangered' },
      darkColor: { type: String, default: '#424242' },
      disabled: { type: Boolean, default: false },
      defaultCountryCode: { type: String, default: null },
      size: { type: String, default: null },
      preferredCountries: { type: Array, default: null },
      onlyCountries: { type: Array, default: null },
      ignoredCountries: { type: Array, default: Array },
      translations: { type: Object, default: null },
      noValidatorState: { type: Boolean, default: false },
      noFlags: { type: Boolean, default: false },
      error: { type: Boolean, default: false },
      noExample: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      countriesHeight: { type: Number, default: 30 },
      noUseBrowserLocale: { type: Boolean, default: false },
      fetchCountry: { type: Boolean, default: false },
      noCountrySelector: { type: Boolean, default: false },
      showCodeOnList: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      borderRadius: { type: Number, default: 4 }
    },
    data () {
      return {
        results: {},
        userLocale: this.defaultCountryCode,
        lastKeyPressed: null
      }
    },
    computed: {
      uniqueId () {
        return `${this.id}-${this._uid}`
      },
      t () {
        return {
          ...locales,
          ...this.translations
        }
      },
      codesCountries () {
        return countries
      },
      countryCode: {
        get () {
          return this.results.countryCode || this.userLocale
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
        const phoneNumber = this.countryCode ? getExampleNumber(this.countryCode, examples) : null
        return phoneNumber ? phoneNumber.formatNational() : null
      },
      hasEmptyPhone () {
        return this.phoneNumber === '' || this.phoneNumber === null
      },
      hintValue () {
        return  this.noExample || !this.phoneNumberExample
          ? null
          : this.hasEmptyPhone || this.isValid ? null : `${this.t.example} ${this.phoneNumberExample}`
      },
      theme () {
        return {
          colorValue: this.color,
          color: { color: this.color },
          validColor: { color: this.validColor },
          errorColor: { color: this.errorColor },
          darkColor: { color: this.darkColor },
          bgColor: { backgroundColor: this.color },
          bgValidColor: { backgroundColor: this.validColor },
          bgErrorColor: { backgroundColor: this.errorColor },
          bgDarkColor: { backgroundColor: this.darkColor },
          borderColor: { borderColor: this.color },
          borderValidColor: { borderColor: this.validColor },
          borderErrorColor: { borderColor: this.errorColor },
          borderDarkColor: { borderColor: this.darkColor },
          boxShadowColor: { boxShadow: `0 0 0 0.2rem ${getShadowColor(this.color)}` },
          boxShadowValid: { boxShadow: `0 0 0 0.2rem ${getShadowColor(this.validColor)}` },
          boxShadowError: { boxShadow: `0 0 0 0.2rem ${getShadowColor(this.errorColor)}` },
          borderRadius: { borderRadius: `${this.borderRadius}px` },
          borderLeftRadius: { borderTopLeftRadius: `${this.borderRadius}px`, borderBottomLeftRadius: `${this.borderRadius}px` },
          borderRightRadius: { borderTopRightRadius: `${this.borderRadius}px`, borderBottomRightRadius: `${this.borderRadius}px` }
        }
      }
    },
    watch: {
      defaultCountryCode (newValue, oldValue) {
        if (newValue === oldValue) return
        this.setLocale(newValue)
      }
    },
    async mounted () {
      try {
        if (this.phoneNumber && this.defaultCountryCode) this.emitValues({countryCode: this.defaultCountryCode, phoneNumber: this.phoneNumber})

        if (this.defaultCountryCode && this.fetchCountry) {
          throw new Error('MazPhoneNumberInput: Do not use "fetch-country" and "default-country-code" options in the same time')
        }

        if (this.defaultCountryCode && this.noUseBrowserLocale) {
          throw new Error('MazPhoneNumberInput: If you use a "default-country-code", do not use "no-use-browser-locale" options')
        }

        if (this.defaultCountryCode) return

        this.fetchCountry
          ? this.fetchCountryCode()
          : !this.noUseBrowserLocale
            ? this.setLocale(browserLocale())
            : null
      } catch (err) {
        throw new Error(err)
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
          countryCode: countryCode,
          isValid: false,
          ...(phoneNumber && (phoneNumber !== '')
            ? { phoneNumber : phoneNumber }
            : null
          ),
          ...(parsing
            ? {
              countryCallingCode: parsing.countryCallingCode,
              formattedNumber: parsing.number,
              nationalNumber: parsing.nationalNumber,
              isValid: parsing.isValid(),
              type: parsing.getType(),
              formatInternational: parsing.formatInternational(),
              formatNational: parsing.formatNational(),
              uri: parsing.getURI(),
              e164: parsing.format('E.164')
            }
            : null
          )
        }
      },
      emitValues (payload) {
        let asYouType = this.getAsYouTypeFormat(payload)
        const backSpacePressed = this.lastKeyPressed === 8

        this.$nextTick(() => {
          const lastCharacOfPhoneNumber = this.phoneNumber ? this.phoneNumber.trim().slice(-1) : false
          if (backSpacePressed && lastCharacOfPhoneNumber && (lastCharacOfPhoneNumber.slice(-1) === ')')) {
            asYouType = this.phoneNumber.slice(0, -2)
            payload.phoneNumber = this.phoneNumber.slice(0, -2)
          }

          this.results = this.getParsePhoneNumberFromString(payload)
          this.$emit('update', this.results)
          this.$emit('input', asYouType)
        })
      },
      setLocale (locale) {
        const countryAvailable = isCountryAvailable(locale)
        if (countryAvailable && locale) {
          this.countryCode = locale
        } else if (!countryAvailable && locale) {
          window.console.warn(`The locale ${locale} is not available`)
        }
        this.userLocale = countryAvailable ? locale : null
      },
      async fetchCountryCode () {
        try {
          const response  = await fetch('https://ip2c.org/s')
          const responseText = await response.text()
          const result = (responseText || '').toString()
          if (result && result[0] === '1') this.setLocale(result.substr(2, 2))
        } catch (err) {
          throw new Error(err)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'style-helpers';

  .vue-phone-number-input {
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
  }
</style>
