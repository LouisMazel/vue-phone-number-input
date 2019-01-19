# vue-phone-number-input

> A beautiful text field to format phone numbers

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

## Props API
| Props      | Type       | Required | Default    | Options        |
|------------|------------|----------|------------|----------------|
| v-model    | String/Int | true     | -          | -              |
| id      | String     | false    | VuePhoneNumberInput | -              |
| color | String `HEX`   | no       | dogderblue      |                |
| disabled | Boolean    | no       | false      |                |
| dark | Boolean    | no       | false      |                |
| size | Boolean    | no       | false      |                |
| default-country-code (1) | String    | no       | null      |                |
| preferred-countries (2) | Array`<string>`    | no       | null      |                |
| ignored-countries | Array`<string>`    | no       | null      |                |
| only-countries | Array`<string>`    | no       | null      |                |
| no-validator-state | Boolean`    | no       | false      |                |
| no-use-browser-locale | Boolean    | no       | false      |                |
| translations (3) | Object    | no       | null      |                |


(1) Ex : `default-country-code="FR"`
(2) Ex : `preferred-countries="['FR', 'BE', 'DE']"` This countries will be at the top of the list
(3) translations comes to replace default texts :
```
translations: {
  countrySelectorLabel: 'Code pays',
  countrySelectorError: 'Choisir un pays',
  phoneNumberLabel: 'Numéro de téléphone'
}
```

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
