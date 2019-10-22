<template>
  <div
    id="app"
    :class="{ 'dark': dark }"
  >
    <h1 style="text-align: center;">
      VuePhoneNumberInput
    </h1>
    <div
      v-if="!screenshotMode"
      class="container"
    >
      <a
        class="btn btn-dark margin-right"
        target="_blank"
        href="https://github.com/LouisMazel/vue-phone-number-input"
      >
        Github
      </a>
      <a
        class="btn btn-danger"
        target="_blank"
        href="https://www.npmjs.com/package/vue-phone-number-input"
      >
        NPM
      </a>
    </div>
    <div
      class="container"
      :style="screenshotMode ? `width: 40%;` : null"
    >
      <button
        class="btn margin-right"
        @click="dark = !dark"
      >
        Toggle Dark Mode
      </button>

      <button
        class="btn btn-success margin-right"
        @click="hasLoaderActive = !hasLoaderActive"
      >
        Toggle loader
      </button>

      <button
        class="btn btn-danger"
        @click="hasErrorActive = !hasErrorActive"
      >
        Toggle error
      </button>
      <div class="component-container">
        <div class="component">
          <VuePhoneNumberInput
            v-if="!screenshotMode"
            id="phoneNumber1"
            v-model="phoneNumber"
            color="purple"
            :dark="dark"
            :disabled="disabled"
            :ignored-countries="countriesIgnored"
            :preferred-countries="countriesList"
            :loader="hasLoaderActive"
            :default-country-code="defaultCountry"
            :error="hasErrorActive"
            clearable
            @update="onUpdate"
          />
          <VuePhoneNumberInput
            v-else
            id="phoneNumber1"
            v-model="phoneNumber2"
            :dark="dark"
            :loader="hasLoaderActive"
            :error="hasErrorActive"
            @update="onUpdate"
          />
        </div>
        <br v-if="!screenshotMode">
        <div class="component">
          <div v-if="!screenshotMode">
            <h3>Datas returned with "update" event</h3>
            <hr>
            <b>v-model</b> : {{ phoneNumber }}
            <hr>
          </div>
          <div class="flex flex-wrap">
            <div class="component">
              <table>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
                <tr
                  v-for="item in resultsTable"
                  :key="item"
                >
                  <td align="left">
                    {{ item }}
                  </td>
                  <td>{{ results[item] }}</td>
                </tr>
              </table>
            </div>
            <div class="component flex-1">
              {{ results }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!screenshotMode"
        class="component-container"
      >
        <div class="component">
          <b>With translations (FR) - No flags - Dark - No Use Browser Locale</b>
          <br>
          <br>
          <VuePhoneNumberInput
            id="phoneNumber2"
            v-model="phoneNumber2"
            :translations="translations"
            dark
            no-flags
            required
            no-use-browser-locale
            :loader="hasLoaderActive"
            :error="hasErrorActive"
            @update="onUpdate2"
          />
        </div>
        <br>
        <div class="component">
          <h3>Datas returned with "update" event</h3>
          <hr>
          <b>v-model</b> : {{ phoneNumber }}
          <hr>
          <div class="flex flex-wrap">
            <div class="component">
              <table>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
                <tr
                  v-for="item in resultsTable2"
                  :key="item"
                >
                  <td align="left">
                    {{ item }}
                  </td>
                  <td>{{ results2[item] }}</td>
                </tr>
              </table>
            </div>
            <div class="component flex-1">
              {{ results2 }}
            </div>
          </div>
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
    data() {
      return {
        screenshotMode: false,
        phoneNumber: '0665656565',
        phoneNumber2: null,
        defaultCountry: 'FR',
        countriesList: ['FR', 'BE', 'DE'],
        countriesIgnored: ['AF', 'AD', 'AL'],
        translations: {
          countrySelectorLabel: 'Code pays',
          countrySelectorError: 'Choisir un pays',
          phoneNumberLabel: 'Numéro de téléphone',
          example: 'Exemple :'
        },
        results: {},
        results2: {},
        dark: false,
        disabled: false,
        hasLoaderActive: false,
        hasErrorActive: false
      }
    },
    computed: {
      resultsTable () {
        return Object.keys(this.results)
      },
      resultsTable2 () {
        return Object.keys(this.results2)
      }
    },
    methods: {
      onUpdate(payload) {
        this.results = payload
      },
      onUpdate2(payload) {
        this.results2 = payload
      }
    }
  }
</script>

<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  min-height: 100%;
  padding: 1px;
  font-size: 14px;
  &.dark {
    background-color: darken(#424242, 20%);
    h1 {
      color: rgba(255, 255, 255, 0.7);
    }
    header {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
hr {
  border: 0;
  border-top: 1px solid #ebebeb;
}
.container {
  width: 70%;
  margin: 0 auto;
  text-align: center;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
.btn {
  padding: 10px 20px;
  margin-bottom: 20px;
  border: none;
  display: inline-block;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 12px;
  outline: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  background-color: dodgerblue;
  color: white;
  font-weight: 500;
  &:hover {
    background-color: darken(dodgerblue, 10%);
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
  }
  &.option {
    background-color: #424242;
    &:hover {
      background-color: darken(#424242, 10%);
    }
  }
  &.btn-dark {
    background-color: #424242;
    &:hover {
      background-color: darken(#424242, 10%);
    }
  }
  &.btn-danger {
    background-color: orangered;
    &:hover {
      background-color: darken(orangered, 10%);
    }
  }
  &.btn-success {
    background-color: yellowgreen;
    &:hover {
      background-color: darken(yellowgreen, 10%);
    }
  }
}
.margin-right {
  margin-right: 20px;
}
.component {
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebebeb;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
  }
  &.options {
    margin-bottom: 20px;
  }
}
.component-container {
  margin: 0 10px 20px 10px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebebeb;
  min-width: 300px;
  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  flex: 1 0 48%;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
  }
  &.dark {
    background-color: darken(#424242, 10%);
    color: #fff;
    textarea {
      background: #424242;
      color: dodgerblue;
    }
  }
}
table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: 100%;
  overflow: auto;
  margin-top: 0;
  margin-bottom: 16px;
  tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
    th,
    td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    &:nth-child(2n) {
      background-color: #f6f8fa;
    }
  }
}
.dark {
  .component-container,
  .component {
    border: 1px solid #424242;
    background-color: darken(#424242, 10%);
    &:hover {
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.6), 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    }
    color: rgba(255, 255, 255, 0.7);
  }
  hr {
    border-color: #424242;
  }
  .btn {
    &:hover {
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.6), 0 2px 4px 0 rgba(0, 0, 0, 0.5) !important;
    }
  }
  table tr {
    background-color: #424242;
    border-top: 1px solid #424242;
    th,
    td {
      border: 1px solid #424242;
    }
    &:nth-child(2n) {
      background-color: darken(#424242, 10%);
    }
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
