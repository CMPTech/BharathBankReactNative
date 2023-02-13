import React from 'react'
import Svg, { Circle } from 'react-native-svg'

function RadioButtonCheckedIcon({ width, height, color1, color2 }) {
  return (
    <Svg width={27} height={27} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle
        cx={13.5}
        cy={13.5}
        r={12.5}
        fill="#fff"
        stroke="#15c7a5"
        strokeWidth={2}
      />
      <Circle cx={13.5} cy={13.5} r={8.5} fill="#15c7a5" />
    </Svg>
  )
}

export default React.memo(RadioButtonCheckedIcon)
