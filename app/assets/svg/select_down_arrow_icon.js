import React from 'react'
import Svg, { Path, Mask, G } from 'react-native-svg'
function SelectDownArrowIcon({ color }) {
  return (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m18.7 9.7-6 6c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3l-6-6c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l5.3 5.3 5.3-5.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4Z"
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
          d="m18.7 9.7-6 6c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3l-6-6c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l5.3 5.3 5.3-5.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4Z"
          fill="#fff"
        />
      </Mask>
      <G mask="url(#a)">
        <Path fill="#347AF0" d="M0 0h24v24H0z" />
      </G>
    </Svg>
  )
}

export default React.memo(SelectDownArrowIcon)