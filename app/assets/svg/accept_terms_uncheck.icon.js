import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

function AcceptTermsUncheckIcon({ width, height, color1, color2 }) {
  return (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx={12} cy={12} r={11.5} stroke="#000" />
      <Path
        d="m7.916 12 2.917 2.917 5.833-5.834"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default React.memo(AcceptTermsUncheckIcon)
