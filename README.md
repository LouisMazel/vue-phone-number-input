# vue-phone-number-input

> A beautiful text field to format phone numbers made with VueJS

![vue-phone-number-input](./public/vue-phone-number-input-demo.gif)

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
- Validator State : input becomes green (you can modify this color with `valid-color` option) when the phone number is valid (can be disabled by `no-validator-state` attr)
- Use browser locale to set the country calling code (can be disabled & you can use `default-country-code` option)
- Phone number formatting while typing
- You can search your country in list (open countries list & type your country name)
- Keyboard accessibility (Arrow down, Arrow up : Countries list navigation -  Escape : Close countries list)
- Phone number example for each country in placeholder/label
- Auto focus phone number input after selecting country
- You can disable the flags - `no-flags` props
- Set your translations

### All options of [VueInputUi](https://github.com/LouisMazel/vue-input-ui) are availables

- Differents size of input (sm or lg) `size="sm|lg"`
- Disabled option (`disabled` prop)
- Dark UI option (`dark` prop)
- Active a clear button by the prop `clearable` (cf: [VueInputUi options](https://github.com/LouisMazel/vue-input-ui#props-api))
- Active a loader progress bar by the prop `loader`  (cf: [VueInputUi options](https://github.com/LouisMazel/vue-input-ui#props-api))
- And others
`

## Props API

| Props      | Type       | Required | Default    |
|------------|------------|----------|------------|
| v-model    | String/Int | true     | -          |
| id      | String     | false    | VuePhoneNumberInput |
| color | String `HEX`   | no       | dogderblue      |
| valid-color | String `HEX`   | no       | yellowgreen      |
| size | String `sm|lg`   | no       | null      |
| default-country-code (1) | String    | no       | null      |
| preferred-countries (2) | Array`<string>`    | no       | null      |
| ignored-countries | Array`<string>`    | no       | null      |
| only-countries | Array`<string>`    | no       | null      |
| no-validator-state | Boolean    | no       | false      |
| no-use-browser-locale | Boolean    | no       | false      |
| no-flags | Boolean    | no       | false      |
| disabled | Boolean    | no       | false      |
| dark | Boolean    | no       | false      |
| required | Boolean    | no       | false      |
| error | Boolean    | no       | false      |
| clearable | Boolean    | no       | false      |
| loader (3) | Boolean    | no       | false      |
| translations (4) | Object    | no       | null      |
| countries-height (5) | Number    | no       | 30      |

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

## Events API

| Event      | Return       |
|------------|------------|
| phone-number-focused    | `-` (emit when phone number input is focused) |
| phone-number-blur    | `-` (emit when phone number input is blur) |
| input    | [AsYouType value](https://github.com/catamphetamine/libphonenumber-js#as-you-type-formatter) (emit when new value is enter on phone number input && when a country is choosed) |
| update    | All values (cf values in table on [demo](https://louismazel.github.io/vue-phone-number-input/)) (emit when new value is enter on phone number input && when a country is choosed) |

## Keyboard accessibility

| Props      | Action       |
|------------|------------|
| ArrowDown    | Navigation down in countries list |
| ArrowUp    | Navigation up in countries list |
| Escape    | Close countries list |
| All letters characters    | Searching country name in countries list (should be open) |

## Named slots

| Slot       | Action       |
|------------|------------|
| arrow    | Override the default arrow character for toggling the list of countries |

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
