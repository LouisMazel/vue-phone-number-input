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
      'is-dark': dark
    }, size]"
    class="field country-selector"
    @click="onFocus"
    @keydown="keyboardNav"
  >
    <div
      v-if="value"
      class="flag-container field-country-flag"
    >
      <img
        :class="`iti-flag-small iti-flag ${value.toLowerCase()}`"
        :alt="value.toLowerCase()"
        src="./../assets/flags/blank.gif"
      >
    </div>
    <input
      :id="id"
      ref="CountrySelector"
      :value="selectedCountry.name"
      :placeholder="label"
      :disabled="disabled"
      :style="[borderStyle]"
      class="field-input"
      readonly
      @focus="onFocus"
      @click="$emit('click')"
    >
    <div
      class="country-selector-arrow"
    >
      ▼
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
        :style="[value === item.iso2 ? bgStyle : null]"
        @click.stop="updateValue(item.iso2)"
      >
        <div class="flag-container">
          <img
            :class="`flag-small flag flag-${item.iso2.toLowerCase()}`"
            :alt="item.iso2"
            src="./../assets/flags/blank.gif"
          >
        </div>
        <div>{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { directive } from 'v-click-outside'
  const itemHeight = 30 // if you modify this value, you should update the height property on css (.country-list-item)

  export default {
    name: 'CountrySelector',
    directives: {
      clickOutside: directive
    },
    props: {
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
      onlyCountries: { type: Array, default: null },
      ignoredCountries: { type: Array, default: Array }
    },
    data () {
      return {
        isFocus: false,
        selectedIndex: null,
        tmpValue: this.value
      }
    },
    computed: {
      borderStyle () {
        const cond = (this.isFocus && !this.error) || this.valid
        return cond ? { border: `1px solid ${this.valid ? this.validColor : this.color} !important` } : null
      },
      colorStyle () {
        const cond = this.isFocus || this.valid
        return cond ? { color: `${this.valid ? this.validColor : this.color}` } : null
      },
      bgStyle () {
        return { backgroundColor: `${this.color}` }
      },
      itemHeight () {
        return {
          height: `${this.itemHeight}px`
        }
      },
      countriesList () {
        return this.items.filter(item => !this.ignoredCountries.includes(item.iso2))
      },
      countriesFiltered () {
        const countries = this.onlyCountries || this.preferredCountries
        return this.countriesList.filter(item => countries.find(country => item.iso2.includes(country)))
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
      selectedCountry () {
        return this.value
        ? {
          ...this.countriesSorted.find(country => country.iso2 === this.value),
          index: this.countriesSorted.findIndex(c => c.iso2 === this.value)
        } : {}
      },
      tmpValueIndex () {
        return this.countriesSorted.findIndex(c => c.iso2 === this.tmpValue)
      }
    },
    mounted () {
      this.$parent.$on('phone-number-focused', () => { this.isFocus = false })
    },
    methods: {
      onFocus () {
        this.$emit('focus')
        this.isFocus = true
        if (this.value) {
          this.scrollToSelectedOnFocus(this.selectedCountry.index)
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
      updateTmpValue (iso2) {
        this.tmpValue = iso2
      },
      scrollToSelectedOnFocus (arrayIndex) {
        const countrylist = this.$refs.countriesList
        this.$nextTick(() => {
          this.$refs.countriesList.scrollTop = arrayIndex * itemHeight - (itemHeight * 3)
        })
      },
      keyboardNav(e) {
        const code = e.keyCode
        if (code === 40 || code === 38) {
          e.view.event.preventDefault()
          // down arrow
          let index = code === 40 ? this.tmpValueIndex + 1 : this.tmpValueIndex - 1
          if (index === -1 || index >= this.countriesSorted.length) {
            index = index === -1
              ? this.countriesSorted.length - 1
              : 0
          }
          this.updateTmpValue(this.countriesSorted[index].iso2)
          this.scrollToSelectedOnFocus(index)
        } else if (code === 13) {
          // enter key
          this.updateValue(this.tmpValue)
        } else {
          // typing a country's name
          this.typeToFindInput += e.key
          clearTimeout(this.typeToFindTimer)
          this.typeToFindTimer = setTimeout(() => {
            this.typeToFindInput = ''
          }, 700)
          // don't include preferred countries so we jump to the right place in the alphabet
          const typedCountryI = this.countriesSorted.slice(this.preferredCountries.length).findIndex(c => c.name.toLowerCase().startsWith(this.typeToFindInput))
          if (~typedCountryI) {
            this.selectedIndex = this.preferredCountries.length + typedCountryI
            const selEle = this.$refs.countriesList.children[this.selectedIndex]
            if (selEle.offsetTop < this.$refs.countriesList.scrollTop || selEle.offsetTop + selEle.clientHeight > this.$refs.countriesList.scrollTop + this.$refs.countriesList.clientHeight) {
              this.$refs.countriesList.scrollTop = selEle.offsetTop - this.$refs.countriesList.clientHeight / 2
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../assets/iti-flags/flags.css";
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
      padding-left: 12px;
      font-weight: 400;
      -webkit-appearance: none;
      outline: none;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      font-size: 14px;
      z-index: 0;
    }
    &-arrow {
      position: absolute;
      right: 0;
      bottom: 10px;
      width: 25px;
      color: #424242;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-size: 15px;
      transform: scaleY(0.5);
      display: inline-block;
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
      .country-selector-arrow {
        transform: scaleY(0.5) rotate(-180deg);
      }
    }
    &.is-disabled {
      .field-input {
        border-color: #ccc;
        background: #f2f2f2;
      }
      .field-label,
      .field-input {
        cursor: default;
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
        height: 30px;
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
        &-item:hover {
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
      &.has-value {
        .field-input {
          padding-top: 16px;
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
        top: 21px;
        img {
          zoom: .45;
          -moz-transform: scale(.45);
          -moz-transform-origin: 0 0;
        }
      }
      &.has-value {
        .field-input {
          padding-top: 16px;
        }
      }
    }
  }
</style>