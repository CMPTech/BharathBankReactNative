import React, { useContext } from 'react'
import Svg, { Path, Mask, G } from 'react-native-svg'
const TickIcon = ({ color }) => (
  <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="m20.7 7.7-11 11c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3l-5-5c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L9 16.6 19.3 6.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4Z"
      fill={color ? color : "#347AF0"}
    />
    <Mask
      id="a"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={3}
      y={6}
      width={18}
      height={13}
    >
      <Path
        d="m20.7 7.7-11 11c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3l-5-5c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L9 16.6 19.3 6.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4Z"
        fill="#fff"
      />
    </Mask>
    <G mask="url(#a)">
      <Path fill={color ? color : "#347AF0"}
        d="M0 0h24v24H0z" />
    </G>
  </Svg>
)

export default TickIcon
