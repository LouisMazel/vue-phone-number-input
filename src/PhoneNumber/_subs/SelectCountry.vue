<template>
  <div
    ref="parent"
    :class="{'is-focused': isOpen, 'has-value': valueToShow}"
    class="field has-label"
    @click="isOpen ? close : open"
  >
    <label
      for="ctk-input"
      class="field-label"
    >{{ hint || label }}</label>
    <div class="flag-container field-country-flag">
      <img
        :class="`flag-small flag flag-${value.toLowerCase()}`"
        :alt="value.toLowerCase()"
        src="./../assets/flags/blank.gif"
      >
    </div>
    <i
      aria-hidden="true"
      class="material-icons field-arrow"
    >arrow_drop_down</i>
    <input
      id="ctk-input"
      ref="ctkInput"
      :placeholder="label"
      :value="valueToShow"
      type="text"
      class="field-input dots-text"
      readonly
      @focus="open"
      @blur="close">
    <input
      ref="ctkInput"
      :value="value"
      type="hidden">
    <ul
      v-show="isOpen"
      class="ctk-input-select-list">
      <li
        v-for="item in items"
        :class="{'selected': value === item.code }"
        :key="item.code"
        class="flex ctk-input-select-item"
        @click.stop="updateValue(item.code)"
      >
        <div class="flag-container mr-2">
          <img
            :class="`flag-small flag flag-${item.code.toLowerCase()}`"
            :alt="item.code.toLowerCase()"
            src="./../assets/flags/blank.gif"
          >
        </div>
        <div>
          {{ item.dial_code }} - <b>{{ item.name }}</b>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'SelectCountry',
    props: {
      label: {
        type: String,
        default: 'Label'
      },
      value: {
        type: null,
        default: null,
        require: true
      },
      hint: {
        type: String,
        default: null
      },
      errorHint: {
        type: Boolean,
        default: false
      },
      items: {
        type: Array,
        required: true
      },
      valueToShow: {
        type: String,
        default: null
      },
      isOpen: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        inputValue: null
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
      updateValue (code) {
        this.$emit('input', code || this.value)
      }
    }
  }
</script>

<style lang="scss" scoped>
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
    .field-country-flag {
      position: absolute;
      top: 19px;
      left: 13px;
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
        border-color: $danger !important;
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
        border-color: $info;
      }
      .field-label {
        color: $info;
      }
    }
    .ctk-input-select-list {
      padding: 0;
      list-style: none;
      background: #FFF;
      max-height: 200px;
      overflow: auto;
      z-index: 9;
      max-width: 100%;
      position: absolute;
      top: 42px;
      border-radius: 4px;
      width: 100%;
      min-width: 230px;
      -webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
      box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
      .ctk-input-select-item {
        padding: 5px 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          background-color: #F2F2F2;
        }
        &.selected {
          background: $info;
          color: #FFF;
        }
      }
    }
  }
</style>
