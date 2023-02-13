import React from 'react'
import Svg, { Path, Mask, G } from 'react-native-svg'
function SelectUpArrowIcon({ color }) {
  return (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M18.7 15.7c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3L12 10.4l-5.3 5.3c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l6-6c.4-.4 1-.4 1.4 0l6 6c.4.4.4 1 0 1.4Z"
      fill={color ? color : "#000"}
    />
    <Mask
      id="a"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={5}
      y={8}
      width={14}
      height={8}
    >
      <Path
        d="M18.7 15.7c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3L12 10.4l-5.3 5.3c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l6-6c.4-.4 1-.4 1.4 0l6 6c.4.4.4 1 0 1.4Z"
        fill="#fff"
      />
    </Mask>
    <G mask="url(#a)">
      <Path fill="#347AF0" d="M0 0h24v24H0z" />
    </G>
  </Svg>
  )
}

export default React.memo(SelectUpArrowIcon)