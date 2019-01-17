<template>
  <div
    id="app"
    :class="{ 'dark': dark }"
  >
    <h1 style="text-align: center;">
      VuePhoneNumberInput
    </h1>
    <div class="container">
      <button
        class="btn"
        @click="dark = !dark"
      >
        Enable Dark Mode
      </button>
      <div class="component-container">
        <div class="component">
          <VuePhoneNumberInput
            id="phoneNumber1"
            v-model="phoneNumber"
            color="purple"
            :dark="dark"
            :disabled="disabled"
            :default-country-code="defaultCountry"
            :ignored-countries="countriesIgnored"
            :preferred-countries="countriesList"
            :translations="translations"
            :no-validator-state="false"
            :size="'sm'"
            @update="onUpdate"
          />
        </div>
        <br>
        <div class="component">
          <b>v-model</b> : {{ phoneNumber }}
          <hr>
          <b>onUpdate</b> : {{ results || 'null' }}
        </div>
      </div>
      <div class="component-container">
        <div class="component">
          <VuePhoneNumberInput
            id="phoneNumber2"
            v-model="phoneNumber2"
            @update="onUpdate2"
          />
        </div>
        <br>
        <div class="component">
          <b>v-model</b> : {{ phoneNumber2 }}
          <hr>
          <b>onUpdate</b> : {{ results2 || 'null' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VuePhoneNumberInput from './VuePhoneNumberInput'

  export default {
    name: 'App',
    components: {
      VuePhoneNumberInput
    },
    data () {
      return {
        phoneNumber: '0658584929',
        phoneNumber2: null,
        defaultCountry: null,
        countriesList: ['FR', 'BE', 'DE'],
        countriesIgnored: ['AF', 'AD', 'AL'],
        translations: {
          countrySelectorLabel: 'Code pays',
          countrySelectorError: 'Choisir un pays',
          phoneNumberLabel: 'Numéro de téléphone'
        },
        results: null,
        results2: null,
        dark: false,
        disabled: false
      }
    },
    methods: {
      onUpdate (payload) {
        this.results = payload
      },
      onUpdate2 (payload) {
        this.results2 = payload
      }
    }
  }
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  min-height: 100%;
  padding: 1px;
  &.dark {
    background-color: darken(#424242, 20%);
    h1 {
      color: rgba(255, 255, 255, 0.7);
    }
    header {
      color: rgba(255, 255, 255, 0.70);
    }
  }
}
.container {
  width: 80%;
  margin: 0 auto;
  text-align: center;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*, *::before, *::after {
  box-sizing: border-box;
}
.btn {
  padding: 10px 20px;
  margin-bottom: 20px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  background-color: #96bf31;
  color: #FFF;
  font-weight: 500;
  &:hover {
    background-color: darken(#96bf31, 10%);
    box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
  }
  &.option {
    background-color: #424242;
    &:hover {
      background-color: darken(#424242, 10%);
    }
  }
}
.component {
  padding: 10px;
  background: #FFF;
  border-radius: 4px;
  border: 1px solid #ebebeb;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
  }
  &.options {
    margin-bottom: 20px;
  }
}
.component-container {
  margin: 0 10px 20px 10px;
  padding: 20px;
  background: #FFF;
  border-radius: 4px;
  border: 1px solid #ebebeb;
  min-width: 300px;
  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  flex: 1 0 48%;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
  }
  &.dark {
    background-color: darken(#424242, 10%);
    color: #FFF;
    textarea {
      background: #424242;
      color: dodgerblue;
    }
    .btn {
      &:hover {
        box-shadow: 0 0 8px 0 rgba(0,0,0,.6), 0 2px 4px 0 rgba(0,0,0,.5);
      }
      &.option {
        background-color: #424242;
        &:hover {
          background-color: lighten(#424242, 10%);
        }
      }
    }
  }
}
.dark {
  .component-container, .component {
    border: 1px solid #424242;
    background-color: darken(#424242, 10%);
    &:hover {
      box-shadow: 0 0 8px 0 rgba(0,0,0,.6), 0 2px 4px 0 rgba(0,0,0,.5);
    }
    color: rgba(255, 255, 255, 0.70);
  }
  hr {
    border-color: #424242;
  }
}
@media screen and (max-width: 1024px) {
  .components-container.flex {
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    flex-flow: column;
    -moz-flex-direction: column;
  }
}
</style>
