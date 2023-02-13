import React from 'react'
import Svg, { Circle } from 'react-native-svg'

const UncheckedIcon = ({color}) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Circle cx={12} cy={12} r={11.5} stroke={color?color:"#E5E7EB"} />
  </Svg>
)

export default UncheckedIcon