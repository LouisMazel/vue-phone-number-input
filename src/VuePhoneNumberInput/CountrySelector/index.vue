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
      :style="[borderStyle]"
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
      :style="[colorStyle]"
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
      >
        <div
          v-for="item in countriesSorted"
          :key="item.code"
          :class="[
            {'selected': value === item.iso2},
            {'keyboard-selected': tmpValue === item.iso2}
          ]"
          class="flex align-center country-selector__list__item"
          :style="[value === item.iso2 ? bgStyle : null, itemHeight]"
          @click.stop="updateValue(item.iso2)"
        >
          <div
            v-if="!noFlags"
            class="country-selector__list__item__flag-container"
          >
            <div :class="`iti-flag-small iti-flag ${item.iso2.toLowerCase()}`" />
          </div>
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
      noFlags: { type: Boolean, default: false }
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
      borderStyle () {
        const cond = (this.isFocus && !this.error) || this.valid
        const color = this.valid ? this.validColor : this.color
        return cond ? { border: `1px solid ${color}` } : null
      },
      colorStyle () {
        const cond = this.isFocus || this.valid
        const color = this.valid ? this.validColor : this.color
        return cond ? { color: `${color}` } : null
      },
      bgStyle () {
        return { backgroundColor: `${this.color}` }
      },
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
  $primary-color: var(--phone-number-primary-color);
  $primary-color-transparency: var(--phone-number-primary-color-transparency);
  $error-color-transparency: var(--phone-number-error-color-transparency);
  $second-color: var(--phone-number-second-color);
  $third-color: var(--phone-number-third-color);
  $muted-color: var(--phone-number-muted-color);
  $hover-color: var(--phone-number-hover-color);
  $bg-color: var(--phone-number-bg-color);
  $valid-color: var(--phone-number-valid-color);
  $valid-color-transparency: var(--phone-number-valid-color-transparency);
  $border-radius: var(--phone-number-border-radius);
  $error-color: orangered;
  $disabled-color: #747474;

  .country-selector {
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
      color: $second-color;
    }

    &__input {
      cursor: pointer;
      background-color: $bg-color;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      position: relative;
      width: 100%;
      height: 42px;
      min-height: 42px;
      padding-right: 18px;
      font-weight: 400;
      appearance: none;
      outline: none;
      border: 1px solid $third-color;
      border-radius: $border-radius;
      font-size: 13px;
      z-index: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      padding-left: 40px;
      color: $second-color;

      &::-webkit-input-placeholder {
        color: $second-color;
      }

      &::-moz-placeholder {
        color: $second-color;
      }

      &:-ms-input-placeholder {
        color: $second-color;
      }

      &::-ms-input-placeholder {
        color: $second-color;
      }

      &:-moz-placeholder {
        color: $second-color;
      }

      &::placeholder {
        color: $second-color;
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
        color: $second-color;
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
      background-color: $bg-color;
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

        &:hover,
        &.keyboard-selected {
          background-color: $hover-color;
        }

        &.selected {
          color: #FFF;
          background-color: $primary-color;
          font-weight: 600;
        }
      }
    }

    &.has-error {
      .country-selector__input {
        border-color: $error-color;
      }

      .country-selector__label {
        color: $error-color;
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
          border-color: $valid-color;
          box-shadow: 0 0 0 0.2rem $valid-color-transparency;
        }
      }
    }

    &.is-dark:not(.is-disabled) {
      .country-selector__input,
      .country-selector__list {
        color: $second-color;
      }
    }

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
        &__toggle__arrow &__country-flag &__country-flag > div {
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