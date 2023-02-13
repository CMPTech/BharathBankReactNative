const hexToRgb = (hex) => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,
  (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`)
  .substring(1).match(/.{2}/g)
  .map((x) => parseInt(x, 16))

const rgbToHex = (r, g, b) => `#${[r, g, b].map((x) => {
  const hex = x.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}).join('')}`

export default function blender(color1, color2, weight) {
  const w2 = weight
  const w1 = 1 - w2
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  const rgb = [Math.round(rgb1[0] * w1 + rgb2[0] * w2),
    Math.round(rgb1[1] * w1 + rgb2[1] * w2),
    Math.round(rgb1[2] * w1 + rgb2[2] * w2)]
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}
