<template>
  <div
    ref="parent"
    :class="{'is-focused': isFocus, 'has-value': value}"
    class="field has-label"
  >
    <label
      v-if="isFocus || value"
      for="select-country"
      class="field-label"
    >
      {{ hint || label }}
    </label>
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
      id="select-coutnry"
      ref="SelectCountry"
      :placeholder="label"
      :value="selectedCountry"
      type="text"
      class="field-input dots-text"
      readonly
      @focus="isFocus = true"
      @blur="isFocus = false"
    >
    <ul
      class="select-country-list"
    >
      <li
        v-for="item in items"
        :key="item.code"
        :class="{'selected': value === item.iso2 }"
        class="flex select-country-list-item"
        @click.stop="updateValue(item.iso2)"
      >
        <div class="flag-container mr-2">
          <img
            :class="`flag-small flag flag-${item.iso2.toLowerCase()}`"
            :alt="item.iso2"
            src="./../assets/flags/blank.gif"
          >
        </div>
        <div>
          {{ item.iso2 }} - <b>{{ item.name }}</b>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'SelectCountry',
    props: {
      label: { type: String, default: 'Label' },
      value: { type: null, default: null, require: true },
      hint: { type: String, default: null },
      errorHint: { type: Boolean, default: false },
      items: { type: Array, required: true }
    },
    data () {
      return {
        inputValue: null,
        isOpen: false,
        isFocus: false
      }
    },
    computed: {
      selectedCountry () {
        return this.items.filter(x => x.iso2 === this.value).map(x => x.name)[0]
      }
    },
    methods: {
      open () {
        this.$emit('toggle', true)
      },
      close () {
        setTimeout(() => {
          this.$emit('toggle', false)
        }, 300)
      },
      updateValue (iso2) {
        this.$emit('input', iso2 || this.value)
      }
    }
  }
</script>

<style lang="scss" scoped>
  *, *::before, *::after {
    box-sizing: border-box;
  }
  .field {
    user-select: none;
    cursor: pointer;
    position: relative;

    .flag-container{
      margin: auto 0;

      img{
        position: absolute;
      }
    }
    .field-country-flag {
      position: absolute;
      top: 19px;
      left: 13px;
    }

    .field-label{
      cursor: pointer;
      position: absolute;
      top: 3px;
      left: 13px;
      transform: translateY(0);
      opacity: 1;
      transition: all .25s cubic-bezier(.645,.045,.355,1);
      font-size: 11px;
      color: rgba(0,0,0, 0.54);
    }
    .field-input{
      user-select: none;
      cursor: pointer;
      transition-duration: 0.3s;
      position: relative;
      width: 100%;
      height: 42px;
      min-height: 42px;
      padding: 0 12px;
      padding-left: 40px;
      padding-top: 14px;

      font-weight: 400;
      -webkit-appearance: none;
      outline: none;

      background-color: transparent;
      border: 1px solid rgba(0,0,0, 0.2);
      border-radius: 4px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      &.has-error {
        border-color: orangered !important;
      }
    }
    .field-arrow {
      cursor: pointer;
      position: absolute;
      right: 5px;
      top: 10px;
      color: rgba(0,0,0, 0.54);
    }
    &.is-focused {
      .field-input {
        border-color: dodgerblue;
      }
      .field-label {
        color: dodgerblue;
      }
    }
    .select-country-list {
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
      -webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
      box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
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
      }
    }
  }
</style>
