import { ShadeColor, HexToRgba, isColorName, colorNameToHex } from '@/utils/ColorTransfomer'

export default ({ color, lightColor, darkColor, validColor, borderRadius, errorColor }) => {
  return {
    '--phone-number-primary-color': color,
    '--phone-number-second-color-light': '#747474',
    '--phone-number-second-color-dark': 'rgba(255, 255, 255, 0.7)',
    '--phone-number-third-color-light': '#CCC',
    '--phone-number-third-color-dark': 'rgba(255, 255, 255, 0.7)',
    '--phone-number-bg-color-light': lightColor,
    '--phone-number-bg-color-dark': darkColor,
    '--phone-number-error-color': errorColor,
    '--phone-number-valid-color': validColor,
    '--phone-number-hover-color-light': ShadeColor(lightColor, -8),
    '--phone-number-hover-color-dark': ShadeColor(darkColor, 20),
    '--phone-number-muted-color-light': '#747474',
    '--phone-number-muted-color-dark': 'rgba(255, 255, 255, 0.3)',
    '--phone-number-primary-color-transparency': isColorName(color) ? HexToRgba(colorNameToHex(color), 0.7) : HexToRgba(color, 0.7),
    '--phone-number-error-color-transparency': isColorName(errorColor) ? HexToRgba(colorNameToHex(errorColor), 0.7) : HexToRgba(errorColor, 0.7),
    '--phone-number-valid-color-transparency': isColorName(validColor) ? HexToRgba(colorNameToHex(validColor), 0.7) : HexToRgba(validColor, 0.7),
    '--phone-number-border-radius': `${borderRadius}px`
  }
}
