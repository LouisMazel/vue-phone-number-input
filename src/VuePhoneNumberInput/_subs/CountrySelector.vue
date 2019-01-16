<template>
  <div
    ref="parent"
    :class="[{
      'is-focused': isFocus,
      'has-value': value,
      'has-error': error,
      'is-disabled': disabled,
      'is-dark': dark
    }]"
    class="field country-selector"
    @click="focusInput"
  >
    <div
      v-if="value"
      class="flag-container field-country-flag"
    >
      <img
        :class="`flag-small flag flag-${value.toLowerCase()}`"
        :alt="value.toLowerCase()"
        src="./../assets/flags/blank.gif"
      >
    </div>
    <input
      :id="id"
      ref="CountrySelector"
      :value="selectedCountry"
      :placeholder="label"
      :disabled="disabled"
      :style="[borderStyle]"
      class="field-input"
      readonly
      @focus="onFocus"
      @blur="onBlur"
      @click="$emit('click')"
    >
    <div class="country-selector-arrow">
      ▼
    </div>
    <label
      ref="label"
      :for="id"
      :class="error ? 'text-danger' : null"
      :style="[colorStyle]"
      class="field-label"
      @click="focusInput"
    >
      {{ hint || label }}
    </label>
    <div
      v-if="isFocus"
      class="country-list"
    >
      <div
        v-for="item in items"
        :key="item.code"
        :class="{'selected': value === item.iso2 }"
        class="flex country-list-item"
        @click.stop="updateValue(item.iso2)"
      >
        <div class="flag-container">
          <img
            :class="`flag-small flag flag-${item.iso2.toLowerCase()}`"
            :alt="item.iso2"
            src="./../assets/flags/blank.gif"
          >
        </div>
        <div>
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CountrySelector',
    props: {
      value: { type: [String, Object], required: false, default: null },
      label: { type: String, default: 'Enter text' },
      hint: { type: String, default: String },
      error: { type: Boolean, default: Boolean },
      color: { type: String, default: 'dodgerblue' },
      disabled: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      id: { type: String, default: 'CountrySelector' },
      items: { type: Array, default: Array, required: true }
    },
    data () {
      return {
        isFocus: false
      }
    },
    computed: {
      borderStyle () {
        const cond = (this.isFocus && !this.error)
        return cond
          ? { border: `1px solid ${this.color} !important` }
          : null
      },
      colorStyle () {
        const cond = this.isFocus
        return cond
          ? { color: `${this.color}` }
          : null
      },
      selectedCountry () {
        return this.items.filter(x => x.iso2 === this.value).map(x => x.name)[0]
      }
    },
    methods: {
      focusInput () {
        this.$refs.CountrySelector.focus()
      },
      onFocus: function () {
        this.$emit('focus')
        this.isFocus = true
      },
      onBlur: function () {
        this.$emit('blur')
        this.isFocus = false
      },
      updateValue (iso2) {
        this.$emit('input', iso2 || this.value)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../assets/flags/flags.css";
  *, *::before, *::after {
    box-sizing: border-box;
  }
  .country-selector {
    position: relative;
    &.is-dark {
      .field-label{
        color: rgba(255, 255, 255, 0.70);
      }
      .field-input{
        background-color: #424242;
        border-color: rgba(255, 255, 255, 0.70);
        color: rgba(255, 255, 255, 0.70);
      }
      &.is-disabled {
        .field-label, .field-input {
          color: #000;
        }
      }
      
    }
    .field-country-flag {
      margin: auto 0;
      position: absolute;
      top: 19px;
      left: 13px;
      img{
        position: absolute;
      }
    }
    .field-label{
      position: absolute;
      top: 3px;
      cursor: pointer;
      left: 13px;
      -webkit-transform: translateY(25%);
      transform: translateY(25%);
      opacity: 0;
      -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-size: 11px;
      color: rgba(0, 0, 0, 0.54);
    }
    .field-input{
      cursor: pointer;
      background-color: transparent;
      -webkit-transition-duration: 0.3s;
      transition-duration: 0.3s;
      position: relative;
      width: 100%;
      height: 42px;
      min-height: 42px;
      padding-right: 18px;
      padding-left: 40px;
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
      transition: all .25s cubic-bezier(.645,.045,.355,1);
      font-size: 15px;
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
      }
    }
    &.is-focused {
      .field-input {
        border-color: dodgerblue;
      }
      .field-label {
        color: dodgerblue;
      }
      .country-selector-arrow {
        transform: rotate(180deg)
      }
    }
    &.is-disabled {
      .field-input {
        border-color: #CCC;
        background: #F2F2F2;
      }
      .field-label, .field-input {
        cursor: default;
      }
    }
    .text-danger {
      color: orangered !important;
    }
    &.is-dark {
      ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: rgba(255, 255, 255, 0.70);
      }
      :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: rgba(255, 255, 255, 0.70);
        opacity:  1;
      }
      ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: rgba(255, 255, 255, 0.70);
        opacity:  1;
      }
      :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: rgba(255, 255, 255, 0.70);
      }
      ::-ms-input-placeholder { /* Microsoft Edge */
        color: rgba(255, 255, 255, 0.70);
      }
      ::placeholder { /* Most modern browsers support this now. */
        color: rgba(255, 255, 255, 0.70);
      }
      &.is-disabled {
        ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
          color: #424242;
        }
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #424242;
          opacity:  1;
        }
        ::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: #424242;
          opacity:  1;
        }
        :-ms-input-placeholder { /* Internet Explorer 10-11 */
          color: #424242;
        }
        ::-ms-input-placeholder { /* Microsoft Edge */
          color: #424242;
        }
        ::placeholder { /* Most modern browsers support this now. */
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
    .country-list {
      padding: 0;
      list-style: none;
      background: #FFF;
      max-height: 200px;
      overflow: auto;
      z-index: 9;
      margin: 0;
      max-width: 100%;
      position: absolute;
      top: 100%;
      border-radius: 4px;
      width: 100%;
      min-width: 230px;
      box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12);
      &-item {
        padding: 5px 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          background-color: #F2F2F2;
        }
        &.selected {
          background: dodgerblue;
          color: #FFF;
        }
        .flag-container {
          margin-right: 10px;
        }
      }
    }
  }
</style>