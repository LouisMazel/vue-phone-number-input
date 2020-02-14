export default {
  props: {
    theme: { type: Object, required: true }
  },
  computed: {
    labelColorStyle () {
      if (this.error) return this.theme.errorColor
      else if (this.valid) return this.theme.validColor
      else if (this.isFocus) return this.theme.color
      else if (this.dark) return this.theme.textDarkColor
      return null
    },
    inputBorderStyle () {
      if (this.error) return this.theme.borderErrorColor
      else if (this.valid) return this.theme.borderValidColor
      else if (this.isHover || this.isFocus) return this.theme.borderColor
      return null
    },
    inputBoxShadowStyle () {
      if (this.isFocus) {
        if (this.error) return this.theme.boxShadowError
        else if (this.valid) return this.theme.boxShadowValid
        return this.theme.boxShadowColor
      }
      return null
    },
    inputBgColor () {
      return !this.dark ? null : this.theme.bgDarkColor
    },
    textColor () {
      return this.dark ? this.theme.textDarkColor : null
    },
    inputCaretStyle () {
      return ({ caretColor: this.theme.colorValue })
    },
    radiusStyle () {
      return this.theme.borderRadius
    },
    radiusLeftStyle () {
      return this.theme.borderLeftRadius
    },
    radiusRightStyle () {
      return this.theme.borderRightRadius
    },
    bgItemSelectedStyle () {
      return this.theme.bgColor
    }
  }
}