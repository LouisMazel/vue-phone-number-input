import { ShadeColor, HexToRgba, isColorName, colorNameToHex } from '@/utils/ColorTransfomer'

export default ({ dark, color, lightColor, darkColor, validColor, borderRadius }) => {
  return {
    '--primary-color': color,
    '--primary-color-transparency': isColorName(color) ? HexToRgba(colorNameToHex(color), 0.7) : HexToRgba(color, 0.7),
    '--second-color': dark ? 'rgba(255, 255, 255, 0.7)' : '#747474',
    '--third-color': dark ? 'rgba(255, 255, 255, 0.7)' : '#CCC',
    '--bg-color': dark ? darkColor : lightColor,
    '--hover-color': dark ? ShadeColor(darkColor, 20) : ShadeColor(lightColor, -8),
    '--valid-color': validColor,
    '--muted-color': dark ? 'rgba(255, 255, 255, 0.3)' : '#747474',
    '--border-radius': `${borderRadius}px`,
    '--error-color-transparency': HexToRgba(colorNameToHex('orangered'), 0.7),
    '--valid-color-transparency': isColorName(validColor) ? HexToRgba(colorNameToHex(validColor), 0.7) : HexToRgba(validColor, 0.7)
  }
}
