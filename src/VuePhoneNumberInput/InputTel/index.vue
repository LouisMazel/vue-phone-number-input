<template>
  <div
    ref="parent"
    :class="[{
      'is-focused': isFocus,
      'is-valid': valid,
      'has-value': value,
      'has-error': error,
      'is-disabled': disabled,
      'is-dark': dark,
      'has-hint': hint
    }, size]"
    class="input-tel"
    @click="focusInput"
  >
    <input
      :id="id"
      ref="InputTel"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="labelValue"
      :type="type"
      class="input-tel__input"
      :disabled="disabled"
      :required="required"
      :class="{
        'no-country-selector': noCountrySelector
      }"
      @keydown="keyDown"
      @keyup="keyUp"
      @focus="onFocus"
      @blur="onBlur"
      @click="$emit('click')"
    >
    <label
      ref="label"
      :for="id"
      :class="error ? 'text-danger' : null"
      class="input-tel__label"
      @click="focusInput"
    >
      {{ hintValue || labelValue }}
    </label>

    <button
      v-if="clearable && inputValue"
      class="input-tel__clear"
      title="clear"
      type="button"
      tabindex="-1"
      @click="clear"
    >
      <span class="input-tel__clear__effect" />
      <span>
        ✕
      </span>
    </button>

    <div
      v-if="loader"
      class="input-tel__loader"
    >
      <div
        class="input-tel__loader__progress-bar"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InputTel',
    props: {
      value: { type: [String, Number], default: null },
      label: { type: String, default: 'Enter text' },
      hint: { type: String, default: null },
      error: { type: Boolean, default: Boolean },
      disabled: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      id: { type: String, default: 'InputTel' },
      size: { type: String, default: null },
      type: { type: String, default: 'tel' },
      readonly: { type: Boolean, default: false },
      valid: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      loader: { type: Boolean, default: false },
      clearable: { type: Boolean, default: false },
      noCountrySelector: { type: Boolean, default: false }
    },
    data: function () {
      return {
        isFocus: false
      }
    },
    computed: {
      inputValue: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      labelValue () {
        let { label } = this
        return this.required && label ? label += ' *' : label
      },
      hintValue () {
        let { hint } = this
        return this.required && hint ? hint += ' *' : hint
      }
    },
    methods: {
      focusInput () {
        this.$refs.InputTel.focus()
      },
      onFocus: function () {
        this.$emit('focus')
        this.isFocus = true
      },
      onBlur: function () {
        this.$emit('blur')
        this.isFocus = false
      },
      clear () {
        this.$emit('input', null)
        this.$emit('clear')
      },
      keyUp (e) {
        this.$emit('keyup', e)
      },
      keyDown (e) {
        this.$emit('keydown', e)
      }
    }
  }
</script>

<style lang="scss" scoped>
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

  .input-tel {
    position: relative;
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    height: 42px;
    min-height: 42px;

    &__label {
      position: absolute;
      top: 4px;
      cursor: pointer;
      left: 13px;
      transform: translateY(25%);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-size: 11px;
      color: $second-color-light;
    }

    &__input {
      cursor: pointer;
      background-color: $bg-color-light;
      transition-duration: 0.3s;
      position: relative;
      width: 100%;
      padding: 0 12px;
      font-weight: 400;
      appearance: none;
      outline: none;
      border: 1px solid $third-color-light;
      border-radius: $border-radius;
      font-size: 14px;
      z-index: 0;
      caret-color: $primary-color;
      margin-left: -1px;
      height: 42px;
      min-height: 42px;

      &:not(.no-country-selector) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

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

      &__input:-webkit-autofill,
      &__input:-webkit-autofill:hover,
      &__input:-webkit-autofill:focus,
      &__input:-webkit-autofill:active {
        box-shadow: 0 0 0 1000px $bg-color-light inset !important;
        -webkit-text-fill-color: $second-color-light !important;
      }
    }

    &__clear {
      $clear-size: 24px;

      position: absolute;
      top: 0;
      bottom: 0;
      right: 8px;
      margin: auto 0;
      width: $clear-size;
      height: $clear-size;
      appearance: none;
      border: none;
      background: transparent;
      color: $second-color-light;
      border-radius: $clear-size;
      cursor: pointer;
      font-size: 12px;

      &:focus {
        outline: none;
      }

      & > span:not(.input-tel__clear__effect) {
        position: relative;
        top: 1px;
      }

      &__effect {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: $clear-size;
        height: $clear-size;
        background-color: $muted-color-light;
        border-radius: $clear-size;
        transform: scale(0);
        transition: transform 200ms;
      }

      &:hover {
        color: white;

        .input-tel__clear__effect {
          transform: scale(1);
          opacity: 0.6;
        }
      }
    }

    &.is-dark {
      .input-tel {
        &__label {
          color: $second-color-dark;
        }

        &__input {
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

          &__input:-webkit-autofill,
          &__input:-webkit-autofill:hover,
          &__input:-webkit-autofill:focus,
          &__input:-webkit-autofill:active {
            box-shadow: 0 0 0 1000px $bg-color-dark inset !important;
            -webkit-text-fill-color: $second-color-dark !important;
          }
        }

        &__clear {
          color: $second-color-dark;

          &__effect {
            background-color: $muted-color-dark;
          }

          &:hover {
            color: white;
          }
        }
      }
    }

    &.is-focused {
      .input-tel {
        &__input {
          border-color: $primary-color;
          box-shadow: 0 0 0 0.2rem $primary-color-transparency;
        }

        &__label {
          color: $primary-color;
        }
      }

      &.has-error {
        .input-tel__input {
          box-shadow: 0 0 0 0.2rem $error-color-transparency;
        }
      }

      &.is-valid {
        .input-tel__input {
          border-color: $valid-color;
          box-shadow: 0 0 0 0.2rem $valid-color-transparency;
        }
      }
    }

    &.has-value {
      .input-tel__label {
        opacity: 1;
        transform: translateY(0);
        font-size: 11px;
      }

      .input-tel__input {
        padding-top: 14px;
      }
    }

    &.has-value,
    &.has-hint {
      .input-tel__label {
        opacity: 1;
        transform: translateY(0);
        font-size: 11px;
      }

      .input-tel__input {
        padding-top: 14px;
      }
    }

    &.is-valid {
      .input-tel__input {
        border-color: $valid-color;
      }

      .input-tel__label {
        color: $valid-color;
      }
    }

    &.has-error {
      .input-tel__input {
        border-color: $error-color;
      }

      .input-tel__label {
        color: $error-color;
      }
    }

    &.is-disabled {
      cursor: not-allowed;

      .input-tel__input {
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

      .input-tel__label,
      .input-tel__input,
      .input-tel__toggle__arrow {
        cursor: not-allowed;
        color: $disabled-color;
      }
    }

    &.sm {
      height: 36px;
      min-height: 36px;

      .input-tel__input {
        font-size: 12px;
        height: 36px;
        min-height: 36px;
      }

      .input-tel__label {
        font-size: 10px;
      }

      &.has-value {
        .input-tel__input {
          padding-top: 12px;
        }
      }
    }

    &.lg {
      height: 48px;
      min-height: 48px;

      .input-tel__input {
        font-size: 16px;

        height: 48px;
        min-height: 48px;
      }

      .input-tel__label {
        font-size: 14px;
      }

      &.has-value {
        .input-tel__input {
          padding-top: 16px;
        }
      }
    }

    &__loader {
      bottom: 0;
      height: 2px;
      left: 2px;
      width: calc(100% - 4px);
      position: absolute;
      overflow: hidden;
      border-radius: 4px;

      &__progress-bar {
        background-color: $primary-color;
        display: block;
        position: absolute;
        content: '';
        left: -200px;
        width: 200px;
        height: 2px;
        animation: loading 2s linear infinite;
      }
    }

    @keyframes loading {
      from {
        left: -200px;
        width: 30%;
      }

      50% {
        width: 30%;
      }

      70% {
        width: 70%;
      }

      80% {
        left: 50%;
      }

      95% {
        left: 120%;
      }

      to {
        left: 100%;
      }
    }
  }
</style>