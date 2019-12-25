<template>
  <div
    ref="parent"
    :class="[{
      'is-focused': isFocus,
      'has-value': value,
      'has-hint': hint,
      'has-error': error,
      'is-disabled': disabled,
      'is-dark': dark,
      'no-flags': noFlags,
      'has-list-open': hasListOpen,
      'is-valid': valid
    }, size]"
    class="country-selector"
    @blur.capture="handleBlur"
    @mouseenter="updateHoverState(true)"
    @mouseleave="updateHoverState(false)"
  >
    <div
      v-if="value && !noFlags"
      class="country-selector__country-flag"
      @click.stop="toggleList"
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
      :style="[radiusLeftStyle, inputBorderStyle, inputBoxShadowStyle]"
      @focus="isFocus = true"
      @keydown="keyboardNav"
      @click.stop="toggleList"
    >
    <div
      class="country-selector__toggle"
      @click.stop="toggleList"
    >
      <slot name="arrow">
        <svg
          mlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="country-selector__toggle__arrow"
        >
          <path
            class="arrow"
            d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
          />
          <path
            fill="none"
            d="M0 0h24v24H0V0z"
          />
        </svg>
      </slot>
    </div>
    <label
      ref="label"
      :style="[labelColorStyle]"
      class="country-selector__label"
      @click.stop="toggleList"
    >
      {{ hint || label }}
    </label>
    <Transition name="slide">
      <div
        v-show="hasListOpen"
        ref="countriesList"
        class="country-selector__list"
        :class="{ 'has-calling-code': showCodeOnList }"
        :style="[radiusStyle, listHeight]"
      >
        <VirtualList
          :size="countriesHeight"
          :remain="7"
          :start="indexItemToShow"
        >
          <button
            v-for="item in countriesSorted"
            :key="item.code"
            :class="[
              { 'selected': value === item.iso2 },
              { 'keyboard-selected': value !== item.iso2 && tmpValue === item.iso2 }
            ]"
            class="flex align-center country-selector__list__item"
            :style="[
              itemHeight,
              value === item.iso2 ? bgItemSelectedStyle : null
            ]"
            tabindex="-1"
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
          </button>
        </VirtualList>
      </div>
    </Transition>
  </div>
</template>

<script>
  import { getCountryCallingCode } from 'libphonenumber-js'
  import VirtualList from 'vue-virtual-scroll-list'
  import StylesHandler from '@/VuePhoneNumberInput/mixins/StylesHandler'

  export default {
    name: 'CountrySelector',
    components: {
      VirtualList
    },
    mixins: [StylesHandler],
    props: {
      id: { type: String, default: 'CountrySelector' },
      value: { type: [String, Object], default: null },
      label: { type: String, default: 'Choose country' },
      hint: { type: String, default: String },
      size: { type: String, default: String },
      error: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      valid: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      items: { type: Array, default: Array, required: true },
      preferredCountries: { type: Array, default: null },
      onlyCountries: { type: Array, default: null },
      ignoredCountries: { type: Array, default: null },
      noFlags: { type: Boolean, default: false },
      countriesHeight: { type: Number, default: 35 },
      showCodeOnList: { type: Boolean, default: false }
    },
    data () {
      return {
        isFocus: false,
        isHover: false,
        hasListOpen: false,
        selectedIndex: null,
        tmpValue: this.value,
        query: '',
        indexItemToShow: 0
      }
    },
    computed: {
      itemHeight () {
        return {
          height: `${this.countriesHeight}px`
        }
      },
      listHeight () {
        return {
          height: `${this.countriesHeight * 7}px`,
          maxHeight: `${this.countriesHeight * 7}px`
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
      selectedValueIndex () {
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
    methods: {
      updateHoverState(value) {
        this.isHover = value
      },
      handleBlur (e) {
        if (this.$el.contains(e.relatedTarget)) return
        this.isFocus = false
        this.closeList()
      },
      toggleList () {
        this.hasListOpen ? this.closeList() : this.openList()
      },
      openList () {
        if (!this.disabled) {
          this.$emit('open')
          this.isFocus = true
          this.hasListOpen = true
          if (this.value) this.scrollToSelectedOnFocus(this.selectedValueIndex)
        }
      },
      closeList () {
        this.$emit('close')
        this.hasListOpen = false
      },
      async updateValue (val) {
        this.tmpValue = val
        this.$emit('input', val || null)
        await this.$nextTick()
        this.closeList()
      },
      scrollToSelectedOnFocus (arrayIndex) {
        this.$nextTick(() => {
          this.indexItemToShow = arrayIndex - 3
        })
      },
      keyboardNav (e) {
        const code = e.keyCode
        if (code === 40 || code === 38) {
          // arrow up down
          if (e.view && e.view.event) {
            // TODO : It's not compatible with FireFox
            e.view.event.preventDefault()
          }
          if (!this.hasListOpen) this.openList()
          let index = code === 40 ? this.tmpValueIndex + 1 : this.tmpValueIndex - 1
          if (index === -1 || index >= this.countriesSorted.length) {
            index = index === -1
              ? this.countriesSorted.length - 1
              : 0
          }
          this.tmpValue = this.countriesSorted[index].iso2
          this.scrollToSelectedOnFocus(index)
        } else if (code === 13) {
          // enter
          this.hasListOpen ? this.updateValue(this.tmpValue) : this.openList()
        } else if (code === 27) {
          // escape
          this.closeList()
        } else {
          // typing a country's name
          this.searching(e)
        }
      },
      searching (e) {
        const code = e.keyCode
        clearTimeout(this.queryTimer)
        this.queryTimer = setTimeout(() => {
          this.query = ''
        }, 1000)
        const q = String.fromCharCode(code)
        if (code === 8 && this.query !== '') {
          this.query = this.query.substring(0, this.query.length - 1)
        } else if (/[a-zA-Z-e ]/.test(q)) {
          if (!this.hasListOpen) this.openList()
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
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';
  @import 'style-helpers';
  @import './assets/iti-flags/flags.css';

  // Light Theme
  .country-selector {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    position: relative;
    height: 40px;
    min-height: 40px;
    z-index: 0;
    user-select: none;

    &:hover {
      z-index: 1;
    }

    &__label {
      position: absolute;
      top: 3px;
      cursor: pointer;
      left: 11px;
      transform: translateY(25%);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-size: 11px;
      color: $secondary-color;
    }

    &__input {
      cursor: pointer;
      background-color: $bg-color;
      position: relative;
      width: 100%;
      height: 40px;
      min-height: 40px;
      padding-right: 22px;
      font-weight: 400;
      appearance: none;
      outline: none;
      border: 1px solid $third-color;
      font-size: 13px;
      z-index: 0;
      padding-left: 8px;
      color: $text-color;
    }

    &__toggle {
      position: absolute;
      right: 5px;
      top: calc(50% - 10px);
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      text-align: center;
      display: inline-block;
      cursor: pointer;
      height: 24px;

      &__arrow {
        color: $secondary-color;

        path.arrow {
          fill: $secondary-color;
        }
      }
    }

    &__country-flag {
      margin: auto 0;
      position: absolute;
      top: 21px;
      left: 11px;
      z-index: 1;
      cursor: pointer;

      img {
        position: absolute;
      }
    }

    &__list {
      max-width: 100%;
      top: 100%;
      width: 100%;
      min-width: 230px;
      position: absolute;
      background-color: $bg-color;
      overflow: hidden;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
      z-index: 9;
      list-style: none;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0;
      margin: 0;

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
        background-color: transparent;
        width: 100%;
        border: 0;
        outline: none;

        &__flag-container {
          margin-right: 10px;
        }

        &__calling-code {
          width: 45px;
          color: $muted-color;
        }

        &:hover,
        &.keyboard-selected {
          background-color: $hover-color;
        }

        &.selected {
          color: #FFF;
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
          color: $secondary-color-dark;
        }

        &__input {
          cursor: pointer;
          background-color: $bg-color-dark-l;
          border: 1px solid $third-color-dark;
          color: $secondary-color-dark;

          &::-webkit-input-placeholder {
            color: $secondary-color-dark;
          }

          &::-moz-placeholder {
            color: $secondary-color-dark;
          }

          &:-ms-input-placeholder {
            color: $secondary-color-dark;
          }

          &::-ms-input-placeholder {
            color: $secondary-color-dark;
          }

          &:-moz-placeholder {
            color: $secondary-color-dark;
          }

          &::placeholder {
            color: $secondary-color-dark;
          }
        }

        &__toggle {
          &__arrow {
            color: $secondary-color-dark;

            path.arrow {
              fill: $secondary-color-dark;
            }
          }
        }

        &__list {
          background-color: $bg-color-dark-l;

          &__item {
            color: $text-color-dark;

            &:hover,
            &.keyboard-selected {
              background-color: lighten($hover-color-dark, 10%);
            }
          }

          &__calling-code {
            color: $muted-color-dark;
          }
        }
      }

      .country-selector__input,
      .country-selector__list {
        color: $secondary-color-dark;
      }
    }

    &.has-list-open {
      z-index: 1;

      .country-selector {
        &__toggle {
          transform: rotate(180deg);
        }
      }
    }

    &.is-focused {
      z-index: 1;
    }

    &.has-error {
      .country-selector__input {
        border-color: $danger-color;
      }

      .country-selector__label {
        color: $danger-color;
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
        font-size: 14px;
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
