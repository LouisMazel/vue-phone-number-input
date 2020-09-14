# vue-phone-number-input

[![license](https://img.shields.io/github/license/LouisMazel/vue-phone-number-input.svg?style=flat-square)](https://github.com/LouisMazel/vue-phone-number-input/blob/master/LICENSE)
[![vue 2](https://img.shields.io/badge/vue-2-42b983.svg?style=flat-square)](https://vuejs.org)
[![npm](https://img.shields.io/npm/v/vue-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/vue-phone-number-input)
[![npm](https://img.shields.io/npm/dt/vue-phone-number-input.svg?style=flat-square)](https://www.npmjs.com/package/vue-phone-number-input)
[![Codacy grade](https://img.shields.io/codacy/grade/3d15a7c11bfe47c69a2aed93cc67cc29.svg?style=flat-square)](https://www.codacy.com/app/LouisMazel/vue-phone-number-input)

[![npm](https://nodei.co/npm/vue-phone-number-input.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/vue-phone-number-input)

> A beautiful text field to format phone numbers made with VueJS

![vue-phone-number-input](./public/vue-phone-number-input-demo.gif)

---

## NEW VERSION ON MY NEW LIBRARY: [MAZ-UI](https://louismazel.github.io/maz-ui/)

 > The new version of VuePhoneNumberInput is now on my **new library** [Maz-UI](https://louismazel.github.io/maz-ui/)

> See **doc/demo** page of [MazPhoneNumberInput](https://louismazel.github.io/maz-ui/documentation/maz-phone-number-input)

> Some options may change, check the props documentation with the top right button

> In this new library, you can enjoy lot of others components in the same style.
> You can just install the component you want (and not the whole library), for this
> Read the [Get started](https://louismazel.github.io/maz-ui/documentation/get-started) page

> If you have any problem or question, do no hesitate to ask me !

---

## Demo

[Enjoy](https://louismazel.github.io/vue-phone-number-input/)

## Installation

### Using yarn

`yarn add vue-phone-number-input`

### Using npm

`npm i --save vue-phone-number-input`

## Usage

### ES6 Modules / CommonJS

```js
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

Vue.component('vue-phone-number-input', VuePhoneNumberInput);
```

```html
<VuePhoneNumberInput v-model="yourValue" />
```

### UMD

```html
<VuePhoneNumberInput v-model="yourValue" />

<script src="https://unpkg.com/vue" charset="utf-8"></script>
<script src="./dist/vue-phone-number-input.umd.min.js" charset="utf-8"></script>
<link rel="stylesheet" type="text/css" href="./dist/vue-phone-number-input.css">

<script type="text/javascript">
  Vue.component('vue-phone-number-input', window.VuePhoneNumberInput.default);
</script>
```

## Features List

- You can set `preferred-countries`, `ignored-countries` or have `only-countries`
- Validator State: input becomes green (you can modify this color with `valid-color` option) when the phone number is valid (can be disabled by `no-validator-state` attr)
- Multi options to getting country code : By default the component get the country code via the browser (disable it with `no-use-browser-locale`) or you can use `fetch-country` to get the country code via [https://ip2c.org/s](https://ip2c.org/s) (network needed) - you can use `default-country-code` option instead to set one
- Phone number formatting while typing
- You can search your country in list (open countries list & type your country name)
- Keyboard accessibility (Arrow down, Arrow up: Countries list navigation -  Escape: Close countries list)
- Phone number example for each country in placeholder/label
- Auto focus phone number input after selecting country
- You can disable the flags - `no-flags` props
- Set your translations

### All options of [VueInputUi](https://github.com/LouisMazel/vue-input-ui) are available

- Differents size of input (sm or lg) `size="sm|lg"`
- Disabled option (`disabled` prop)
- Dark UI option (`dark` prop)
- Active a clear button by the prop `clearable` (cf: [VueInputUi options](https://github.com/LouisMazel/vue-input-ui#props-api))
- Active a loader progress bar by the prop `loader`  (cf: [VueInputUi options](https://github.com/LouisMazel/vue-input-ui#props-api))
- And others

## Props API

| Props                     | Type            | Required | Default             |
|---------------------------|-----------------|----------|---------------------|
| v-model                   | String/Int      | true     | -                   |
| id                        | String          | false    | VuePhoneNumberInput |
| color                     | String `HEX`    | no       | dogderblue          |
| valid-color               | String `HEX`    | no       | yellowgreen         |
| error-color               | String `HEX`    | no       | orangered           |
| size                      | String `sm|lg`  | no       | null                |
| default-country-code (1)  | String          | no       | null                |
| preferred-countries (2)   | Array`<string>` | no       | null                |
| ignored-countries         | Array`<string>` | no       | null                |
| only-countries            | Array`<string>` | no       | null                |
| no-validator-state        | Boolean         | no       | false               |
| no-flags                  | Boolean         | no       | false               |
| disabled                  | Boolean         | no       | false               |
| dark                      | Boolean         | no       | false               |
| dark-color                | String (hex)    | no       | #424242             |
| required                  | Boolean         | no       | false               |
| error                     | Boolean         | no       | false               |
| clearable                 | Boolean         | no       | false               |
| loader (3)                | Boolean         | no       | false               |
| translations (4)          | Object          | no       | null                |
| countries-height (5)      | Number          | no       | 30                  |
| no-use-browser-locale (6) | Boolean         | no       | false               |
| fetch-country (7)         | Boolean         | no       | false               |
| no-country-selector (8)   | Boolean         | no       | false               |
| border-radius             | Number          | no       | 4                   |
| show-code-on-list         | Boolean         | no       | false               |
| no-example                | Boolean         | no       | false               |

(1) Ex : `default-country-code="FR"`

(2) Ex : `preferred-countries="['FR', 'BE', 'DE']"` This countries will be at the top of the list

(3) Loader progress bar has the input color (`color` props)

(4) translations comes to replace default texts - Ex :

```html
translations="{
  countrySelectorLabel: 'Code pays',
  countrySelectorError: 'Choisir un pays',
  phoneNumberLabel: 'Numéro de téléphone',
  example: 'Exemple :'
}"
```

(5) height in px of the rows included in the dropdown. Ex:
countries-height: 40

(6) By default the component get country code via browser - No network needed but not work on SSR with NuxtJS (disable it with `no-use-browser-locale`)

(7) Fetch country code via [https://ip2c.org/s](https://ip2c.org/s) - Network needed - (Do not use it with `default-country-code` options)

(8) The country selector is not shown, you can validate your phone number with the country code set

## Events API

| Event                | Return                                                                                                                                                                            |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| phone-number-focused | `-` (emit when phone number input is focused)                                                                                                                                     |
| phone-number-blur    | `-` (emit when phone number input is blur)                                                                                                                                        |
| input                | [AsYouType value](https://github.com/catamphetamine/libphonenumber-js#as-you-type-formatter) (emit when new value is enter on phone number input && when a country is choosed)    |
| update               | All values (cf values in table on [demo](https://louismazel.github.io/vue-phone-number-input/)) (emit when new value is enter on phone number input && when a country is choosed) |

## Keyboard accessibility

| Props                  | Action                                                    |
|------------------------|-----------------------------------------------------------|
| ArrowDown              | Navigation down in countries list                         |
| ArrowUp                | Navigation up in countries list                           |
| Escape                 | Close countries list                                      |
| All letters characters | Searching country name in countries list (should be open) |

## Named slots

| Slot  | Action                                                                  |
|-------|-------------------------------------------------------------------------|
| arrow | Override the default arrow character for toggling the list of countries |

## Contribution

### Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Lints and fixes files

```bash
npm run lint
```

## License

This project is licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License)
