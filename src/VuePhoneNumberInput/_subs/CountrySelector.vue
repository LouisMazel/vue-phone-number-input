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
      'no-flags': noFlags
    }, size]"
    class="field country-selector"
    @click="onFocus"
    @keydown="keyboardNav"
  >
    <div
      v-if="value && !noFlags"
      class="flag-container field-country-flag"
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
      class="field-input"
      readonly
      @focus="onFocus"
      @click="$emit('click')"
    >
    <div
      class="country-selector-toggle"
    >
      <slot name="arrow">
        <div class="country-selector-arrow">
          ▼
        </div>
      </slot>
    </div>
    <label
      ref="label"
      :for="id"
      :class="error ? 'text-danger' : null"
      :style="[colorStyle]"
      class="field-label"
      @click="onFocus"
    >
      {{ hint || label }}
    </label>
    <Transition name="slide">
      <div
        v-show="isFocus"
        ref="countriesList"
        class="country-list"
      >
        <div
          v-for="item in countriesSorted"
          :key="item.code"
          :class="[
            {'selected': value === item.iso2},
            {'keyboard-selected': tmpValue === item.iso2}
          ]"
          class="flex align-center country-list-item"
          :style="[value === item.iso2 ? bgStyle : null, itemHeight]"
          @click.stop="updateValue(item.iso2)"
        >
          <div
            v-if="!noFlags"
            class="flag-container"
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
      countriesHeight: { type: Number, required: false, default: 30},
      value: { type: [String, Object], required: false, default: null },
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
      keepPreferredOrOnlyCountrySort: { type: Boolean, default: false },
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
        return cond ? { border: `1px solid ${color} !important` } : null
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
        return this.keepPreferredOrOnlyCountrySort ? countries.map(country => this.countriesList.find(item => item.iso2.includes(country))) : this.countriesList.filter(item => countries.find(country => item.iso2.includes(country)))
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
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  .country-selector {
    position: relative;
    .field-country-flag {
      margin: auto 0;
      position: absolute;
      top: 21px;
      left: 13px;
      z-index: 1;
      img {
        position: absolute;
      }
    }
    .field-label {
      position: absolute;
      top: 3px;
      cursor: pointer;
      left: 13px;
      -webkit-transform: translateY(25%);
      transform: translateY(25%);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-size: 11px;
      color: rgba(0, 0, 0, 0.54);
    }
    .field-input {
      cursor: pointer;
      background-color: transparent;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      position: relative;
      width: 100%;
      height: 42px;
      min-height: 42px;
      padding-right: 18px;
      padding-left: 10px;
      font-weight: 400;
      -webkit-appearance: none;
      outline: none;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      font-size: 13px;
      z-index: 0;
    }
    &-toggle {
      position: absolute;
      right: 10px;
      top: calc(50% - 8px);
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      text-align: center;
      display: inline-block;
    }
    &-arrow {
      color: #424242;
      font-size: 15px;
      transform: scaleY(0.5);
    }

    &.has-error {
      .field-input {
        border-color: orangered !important;
      }
    }
    &.has-value {
      .field-label {
        opacity: 1;
        -webkit-transform: translateY(0);
        transform: translateY(0);
        font-size: 11px;
      }
      .field-input {
        padding-top: 14px;
        padding-left: 40px;
      }
    }
    &.has-hint {
      .field-label {
        opacity: 1;
        -webkit-transform: translateY(0);
        transform: translateY(0);
        font-size: 11px;
      }
      .field-input {
        padding-top: 14px;
      }
    }
    &.is-focused {
      .country-selector-toggle {
        transform: rotate(-180deg);
      }
    }
    &.is-disabled {
      .field-input {
        border-color: #ccc;
        background-color: #f2f2f2;
      }
      .field-label,
      .field-input {
        cursor: default;
      }
    }
    &.no-flags {
      .field-input {
        padding-left: 10px;
      }
    }
    .text-danger {
      color: orangered !important;
    }
    .country-list {
      padding: 0;
      list-style: none;
      background: #fff;
      height: 210px;
      max-height: 210px;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 9;
      margin: 0;
      max-width: 100%;
      position: absolute;
      top: 100%;
      border-radius: 4px;
      width: 100%;
      min-width: 230px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
      &-item {
        padding: 0 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        cursor: pointer;
        &:hover, &.keyboard-selected {
          background-color: #f2f2f2;
        }
        &.selected {
          color: #fff;
          font-weight: 600;
        }
        .flag-container {
          margin-right: 10px;
        }
      }
    }
    &.is-dark {
      .field-label {
        color: rgba(255, 255, 255, 0.7);
      }
      .field-input {
        background-color: #424242;
        border-color: rgba(255, 255, 255, 0.7);
        color: rgba(255, 255, 255, 0.7);
      }
      .country-list {
        background-color: #424242;
        color: rgba(255, 255, 255, 0.7);
        &-item:hover, &-item.keyboard-selected {
          background-color: darken(#424242, 5%);
        }
      }
      .country-selector-arrow {
        color: rgba(255, 255, 255, 0.7);
      }
      &.is-disabled {
        .field-label,
        .field-input {
          color: #000;
        }
      }
      ::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        color: rgba(255, 255, 255, 0.7);
      }
      :-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: rgba(255, 255, 255, 0.7);
        opacity: 1;
      }
      ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: rgba(255, 255, 255, 0.7);
        opacity: 1;
      }
      :-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: rgba(255, 255, 255, 0.7);
      }
      ::-ms-input-placeholder {
        /* Microsoft Edge */
        color: rgba(255, 255, 255, 0.7);
      }
      ::placeholder {
        /* Most modern browsers support this now. */
        color: rgba(255, 255, 255, 0.7);
      }
      &.is-disabled {
        .field-input {
          border-color: #ccc;
          background-color: #f2f2f2;
        }
        .country-selector-arrow {
          color: #888;
        }
        ::-webkit-input-placeholder {
          /* WebKit, Blink, Edge */
          color: #424242;
        }
        :-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #424242;
          opacity: 1;
        }
        ::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #424242;
          opacity: 1;
        }
        :-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #424242;
        }
        ::-ms-input-placeholder {
          /* Microsoft Edge */
          color: #424242;
        }
        ::placeholder {
          /* Most modern browsers support this now. */
          color: #424242;
        }
      }
    }
    &.sm {
      .field-input {
        height: 36px;
        min-height: 36px;
        font-size: 12px;
      }
      .field-label {
        font-size: 10px;
      }
      .field-country-flag {
        top: 16px;
        img {
          zoom: .3;
          -moz-transform: scale(.3);
          -moz-transform-origin: 0 0;
        }
      }
      &.has-value {
        .field-input {
          padding-top: 12px;
        }
      }
    }
    &.lg {
      .field-input {
        height: 48px;
        min-height: 48px;
        font-size: 16px;
      }
      .field-label {
        font-size: 14px;
      }
      .field-country-flag {
        top: 25px;
        img {
          zoom: .45;
          -moz-transform: scale(.45);
          -moz-transform-origin: 0 0;
        }
      }
      &.has-value {
        .field-input {
          padding-top: 18px;
        }
      }
    }
    .slide-enter-active, .slide-leave-active {
      opacity: 1;
      z-index: 998;
      transition: all 0.3s;
      transform: translateY(0);
    }
    .slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
      z-index: 998;
      transform: translateY(-20px);
    }
  }
</style>