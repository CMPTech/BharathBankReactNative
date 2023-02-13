import React from 'react'
import Svg, { Path } from 'react-native-svg'
function DownArrowIcon({ color }) {
  return (
    <Svg width='30' height='30' viewBox='0 0 24 24'>
      <Path
        d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'
        fill={color ? color : "#000"}
      />
      <Path fill='none' d='M0 0h24v24H0V0z' />
    </Svg>
  )
}

export default React.memo(DownArrowIcon)