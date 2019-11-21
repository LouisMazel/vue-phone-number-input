<template>
  <div
    ref="parent"
    v-click-outside="onBlur"
    :class="[{
      'is-focused': isFocus,
      'has-value': value,
      'has-hint': hint,
      'has-error': error,
      'is-disabled': disabled,
      'is-dark': dark,
      'no-flags': noFlags,
      'is-valid': valid
    }, size]"
    class="country-selector"
    @click="onFocus"
    @keydown="keyboardNav"
  >
    <div
      v-if="value && !noFlags"
      class="country-selector__country-flag"
    >
      <div :class="`iti-flag-small iti-flag ${value.toLowerCase()}`" />
    </div>
    <input
      :id="id"
      ref="CountrySelector"
      :value="callingCode"
      :placeholder="label"
      :disabled="disabled"
      class="country-selector__input"
      readonly
      @focus="onFocus"
      @click="$emit('click')"
    >
    <div
      class="country-selector__toggle"
    >
      <slot name="arrow">
        <div class="country-selector__toggle__arrow">
          ▼
        </div>
      </slot>
    </div>
    <label
      ref="label"
      :for="id"
      :class="error ? 'text-danger' : null"
      class="country-selector__label"
      @click="onFocus"
    >
      {{ hint || label }}
    </label>
    <Transition name="slide">
      <div
        v-show="isFocus"
        ref="countriesList"
        class="country-selector__list"
        :class="{ 'has-calling-code': showCodeOnList }"
      >
        <div
          v-for="item in countriesSorted"
          :key="item.code"
          :class="[
            {'selected': value === item.iso2},
            {'keyboard-selected': value !== item.iso2 && tmpValue === item.iso2}
          ]"
          class="flex align-center country-selector__list__item"
          :style="[itemHeight]"
          @click.stop="updateValue(item.iso2)"
        >
          <div
            v-if="!noFlags"
            class="country-selector__list__item__flag-container"
          >
            <div :class="`iti-flag-small iti-flag ${item.iso2.toLowerCase()}`" />
          </div>
          <span
            v-if="showCodeOnList"
            class="country-selector__list__item__calling-code flex-fixed"
          >+{{ item.dialCode }}</span>
          <div class="dots-text">
            {{ item.name }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
  import { directive } from 'v-click-outside'
  import { getCountryCallingCode } from 'libphonenumber-js'

  export default {
    name: 'CountrySelector',
    directives: {
      clickOutside: directive
    },
    props: {
      countriesHeight: { type: Number, default: 30},
      value: { type: [String, Object], default: null },
      label: { type: String, default: 'Choose country' },
      hint: { type: String, default: String },
      size: { type: String, default: String },
      error: { type: Boolean, default: Boolean },
      disabled: { type: Boolean, default: false },
      valid: { type: Boolean, default: false },
      validColor: { type: String, default: 'yellowgreen' },
      color: { type: String, default: String },
      dark: { type: Boolean, default: false },
      id: { type: String, default: 'CountrySelector' },
      items: { type: Array, default: Array, required: true },
      preferredCountries: { type: Array, default: null },
      onlyCountries: { type: Array, default: null },
      ignoredCountries: { type: Array, default: Array },
      noFlags: { type: Boolean, default: false },
      showCodeOnList: { type: Boolean, default: false }
    },
    data () {
      return {
        isFocus: false,
        selectedIndex: null,
        tmpValue: this.value,
        query: ''
      }
    },
    computed: {
      itemHeight () {
        return {
          height: `${this.countriesHeight}px`
        }
      },
      countriesList () {
        return this.items.filter(item => !this.ignoredCountries.includes(item.iso2))
      },
      countriesFiltered () {
        const countries = this.onlyCountries || this.preferredCountries
        return countries.map(country => this.countriesList.find(item => item.iso2.includes(country)))
      },
      otherCountries () {
        return this.countriesList.filter(item => !this.preferredCountries.includes(item.iso2))
      },
      countriesSorted () {
        return this.preferredCountries
          ? [ ...this.countriesFiltered,
              ...this.otherCountries ]
          : this.onlyCountries
            ? this.countriesFiltered
            : this.countriesList
      },
      selectedCountryIndex () {
        return this.value
          ? this.countriesSorted.findIndex(c => c.iso2 === this.value)
          : null
      },
      tmpValueIndex () {
        return this.countriesSorted.findIndex(c => c.iso2 === this.tmpValue)
      },
      callingCode () {
        return this.value ? `+${getCountryCallingCode(this.value)}` : null
      }
    },
    mounted () {
      this.$parent.$on('phone-number-focused', () => { this.isFocus = false })
    },
    methods: {
      onFocus () {
        if (!this.disabled) {
          this.$emit('focus')
          this.isFocus = true
          if (this.value) {
            this.scrollToSelectedOnFocus(this.selectedCountryIndex)
          }
        }
      },
      onBlur () {
        this.$emit('blur')
        this.isFocus = false
      },
      updateValue (iso2) {
        this.isFocus = false
        this.tmpValue = iso2
        this.$emit('input', iso2)
      },
      scrollToSelectedOnFocus (arrayIndex) {
        this.$nextTick(() => {
          this.$refs.countriesList.scrollTop = arrayIndex * this.countriesHeight - (this.countriesHeight * 3)
        })
      },
      keyboardNav (e) {
        const code = e.keyCode
        if (code === 40 || code === 38) {
          if (e.view && e.view.event) {
            // TODO : It's not compatible with FireFox
            e.view.event.preventDefault()
          }
          // down arrow
          let index = code === 40 ? this.tmpValueIndex + 1 : this.tmpValueIndex - 1
          if (index === -1 || index >= this.countriesSorted.length) {
            index = index === -1
              ? this.countriesSorted.length - 1
              : 0
          }
          this.tmpValue = this.countriesSorted[index].iso2
          this.scrollToSelectedOnFocus(index)
        } else if (code === 13) {
          // enter key
          this.updateValue(this.tmpValue)
        } else if (code === 27) {
          this.onBlur()
        } else {
          // typing a country's name
          clearTimeout(this.queryTimer)
          this.queryTimer = setTimeout(() => {
            this.query = ''
          }, 1000)
          const q = String.fromCharCode(code)
          if (code === 8 && this.query !== '') {
            this.query = this.query.substring(0, this.query.length-1)
          } else if (/[a-zA-Z-e ]/.test(q)) {
            this.query += e.key
            const countries = this.preferredCountries ? this.countriesSorted.slice(this.preferredCountries.length) : this.countriesSorted
            const resultIndex = countries.findIndex(c => {
              this.tmpValue = c.iso2
              return c.name.toLowerCase().startsWith(this.query)
            })
            if (resultIndex !== -1) {
              this.scrollToSelectedOnFocus(resultIndex + (this.preferredCountries ? this.preferredCountries.length : 0))
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'style-helpers';
  @import './assets/iti-flags/flags.css';

  $primary-color: var(--phone-number-primary-color);
  $second-color-light: var(--phone-number-second-color-light);
  $second-color-dark: var(--phone-number-second-color-dark);
  $third-color-light: var(--phone-number-third-color-light);
  $third-color-dark: var(--phone-number-third-color-dark);
  $muted-color-light: var(--phone-number-muted-color-light);
  $muted-color-dark: var(--phone-number-muted-color-dark);
  $hover-color-light: var(--phone-number-hover-color-light);
  $hover-color-dark: var(--phone-number-hover-color-dark);
  $bg-color-light: var(--phone-number-bg-color-light);
  $bg-color-dark: var(--phone-number-bg-color-dark);
  $valid-color: var(--phone-number-valid-color);
  $error-color: var(--phone-number-error-color);
  $error-color-transparency: var(--phone-number-error-color-transparency);
  $primary-color-transparency: var(--phone-number-primary-color-transparency);
  $valid-color-transparency: var(--phone-number-valid-color-transparency);
  $border-radius: var(--phone-number-border-radius);
  $disabled-color: #747474;

  // Light Theme
  .country-selector {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    position: relative;
    height: 42px;
    min-height: 42px;

    &__label {
      position: absolute;
      top: 3px;
      cursor: pointer;
      left: 11px;
      transform: translateY(25%);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-size: 11px;
      color: $second-color-light;
    }

    &__input {
      cursor: pointer;
      background-color: $bg-color-light;
      position: relative;
      width: 100%;
      height: 42px;
      min-height: 42px;
      padding-right: 22px;
      font-weight: 400;
      appearance: none;
      outline: none;
      border: 1px solid $third-color-light;
      border-radius: $border-radius;
      font-size: 13px;
      z-index: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      padding-left: 8px;

      &::-webkit-input-placeholder {
        color: $second-color-light;
      }

      &::-moz-placeholder {
        color: $second-color-light;
      }

      &:-ms-input-placeholder {
        color: $second-color-light;
      }

      &::-ms-input-placeholder {
        color: $second-color-light;
      }

      &:-moz-placeholder {
        color: $second-color-light;
      }

      &::placeholder {
        color: $second-color-light;
      }
    }

    &__toggle {
      position: absolute;
      right: 10px;
      top: calc(50% - 8px);
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      text-align: center;
      display: inline-block;

      &__arrow {
        color: $second-color-light;
        font-size: 15px;
        transform: scaleY(0.5);
      }
    }

    &__country-flag {
      margin: auto 0;
      position: absolute;
      top: 21px;
      left: 11px;
      z-index: 1;

      img {
        position: absolute;
      }
    }

    &__list {
      border-radius: $border-radius;
      background-color: $bg-color-light;
      padding: 0;
      list-style: none;
      height: 210px;
      max-height: 210px;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 9;
      margin: 0;
      max-width: 100%;
      position: absolute;
      top: 100%;
      width: 100%;
      min-width: 230px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

      &.has-calling-code {
        min-width: 270px;
      }

      &__item {
        padding: 0 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        cursor: pointer;

        &__flag-container {
          margin-right: 10px;
        }

        &__calling-code {
          width: 45px;
          color: var(--phone-number-muted-color-light);
        }

        &:hover,
        &.keyboard-selected {
          background-color: $hover-color-light;
        }

        &.selected {
          color: #FFF;
          background-color: $primary-color;
          font-weight: 600;

          .country-selector__list__item__calling-code {
            color: #FFF;
          }
        }
      }
    }

    // Dark Theme
    &.is-dark {
      .country-selector {
        &__label {
          color: $second-color-dark;
        }

        &__input {
          cursor: pointer;
          background-color: $bg-color-dark;
          border: 1px solid $third-color-dark;
          color: $second-color-dark;

          &::-webkit-input-placeholder {
            color: $second-color-dark;
          }

          &::-moz-placeholder {
            color: $second-color-dark;
          }

          &:-ms-input-placeholder {
            color: $second-color-dark;
          }

          &::-ms-input-placeholder {
            color: $second-color-dark;
          }

          &:-moz-placeholder {
            color: $second-color-dark;
          }

          &::placeholder {
            color: $second-color-dark;
          }
        }

        &__toggle {
          &__arrow {
            color: $second-color-dark;
          }
        }

        &__list {
          background-color: $bg-color-dark;

          &__item {
            &:hover,
            &.keyboard-selected {
              background-color: $hover-color-dark;
            }

            &__calling-code {
              color: var(--phone-number-muted-color-dark);
            }
          }
        }
      }

      .country-selector__input,
      .country-selector__list {
        color: $second-color-dark;
      }
    }

    &.is-focused {
      .country-selector {
        &__toggle {
          transform: rotate(180deg);
        }

        &__input {
          border-color: $primary-color;
          box-shadow: 0 0 0 0.2rem $primary-color-transparency;
        }

        &__label {
          color: $primary-color;
        }
      }

      &.is-valid {
        .country-selector__input {
          box-shadow: 0 0 0 0.2rem $valid-color-transparency;
        }
      }
    }

    &.has-error:not(.is-valid) {
      .country-selector__input {
        border-color: $error-color;
      }

      .country-selector__label {
        color: $error-color;
      }
    }

    &.is-valid {
      .country-selector__input {
        border-color: $valid-color;
      }

      .country-selector__label {
        color: $valid-color;
      }
    }

    &.has-value {
      .country-selector__input {
        padding-left: 40px;
      }
    }

    &.has-value,
    &.has-hint {
      .country-selector__label {
        opacity: 1;
        transform: translateY(0);
        font-size: 11px;
      }

      .country-selector__input {
        padding-top: 14px;
      }
    }

    // Disable theme
    &.is-disabled {
      .country-selector {
        cursor: not-allowed;

        &__input {
          border-color: #CCC;
          background-color: #F2F2F2;
          color: $disabled-color;

          &::-webkit-input-placeholder {
            color: $disabled-color;
          }

          &::-moz-placeholder {
            color: $disabled-color;
          }

          &:-ms-input-placeholder {
            color: $disabled-color;
          }

          &::-ms-input-placeholder {
            color: $disabled-color;
          }

          &:-moz-placeholder {
            color: $disabled-color;
          }

          &::placeholder {
            color: $disabled-color;
          }
        }

        &__label,
        &__input,
        &__toggle__arrow,
        &__country-flag,
        &__country-flag > div {
          cursor: not-allowed;
          color: $disabled-color;
        }
      }
    }

    &.no-flags {
      .country-selector__input {
        padding-left: 10px;
      }
    }

    &.sm {
      height: 36px;
      min-height: 36px;

      .country-selector__input {
        height: 36px;
        min-height: 36px;
        font-size: 12px;
      }

      .country-selector__label {
        font-size: 10px;
      }

      .country-selector__country-flag {
        top: 16px;

        img {
          zoom: 0.3;
          color: red;
          /* stylelint-disable */
          -moz-transform: scale(0.3);
          -moz-transform-origin: 0 0;
          /* stylelint-enable */
        }
      }

      &.has-value {
        .country-selector__input {
          padding-top: 12px;
        }
      }
    }

    &.lg {
      height: 48px;
      min-height: 48px;

      .country-selector__input {
        height: 48px;
        min-height: 48px;
        font-size: 16px;
      }

      .country-selector__label {
        font-size: 14px;
      }

      .country-selector__country-flag {
        top: 25px;

        img {
          zoom: 0.45;
          /* stylelint-disable */
          -moz-transform: scale(0.45);
          -moz-transform-origin: 0 0;
          /* stylelint-enable */
        }
      }

      &.has-value {
        .country-selector__input {
          padding-top: 18px;
        }
      }
    }

    .slide-enter-active,
    .slide-leave-active {
      opacity: 1;
      z-index: 998;
      transition: all 0.3s;
      transform: translateY(0);
    }

    .slide-enter,
    .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
      z-index: 998;
      transform: translateY(-20px);
    }
  }
</style>