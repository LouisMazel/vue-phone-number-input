import { ShadeColor, HexToRgba, isColorName, colorNameToHex } from '@/utils/ColorTransfomer'

export default ({ dark, color, lightColor, darkColor, validColor, borderRadius }) => {
  return {
    '--phone-number-primary-color': color,
    '--phone-number-primary-color-transparency': isColorName(color) ? HexToRgba(colorNameToHex(color), 0.7) : HexToRgba(color, 0.7),
    '--phone-number-second-color': dark ? 'rgba(255, 255, 255, 0.7)' : '#747474',
    '--phone-number-third-color': dark ? 'rgba(255, 255, 255, 0.7)' : '#CCC',
    '--phone-number-bg-color': dark ? darkColor : lightColor,
    '--phone-number-hover-color': dark ? ShadeColor(darkColor, 20) : ShadeColor(lightColor, -8),
    '--phone-number-valid-color': validColor,
    '--phone-number-muted-color': dark ? 'rgba(255, 255, 255, 0.3)' : '#747474',
    '--phone-number-border-radius': `${borderRadius}px`,
    '--phone-number-error-color-transparency': HexToRgba(colorNameToHex('orangered'), 0.7),
    '--phone-number-valid-color-transparency': isColorName(validColor) ? HexToRgba(colorNameToHex(validColor), 0.7) : HexToRgba(validColor, 0.7)
  }
}
