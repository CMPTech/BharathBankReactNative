import React from 'react'
import Svg, { G, Path, Rect, Defs, ClipPath } from 'react-native-svg'

function BackIcon({ width, height, color1, color2 }) {
  return (
    <Svg width={40} height={40} fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#a)">
        <Path
          d="m23 14-6 6 6 6"
          stroke={color1 ? color1 : "#fff"}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      {/* <Rect x={0.5} y={0.5} width={39} height={39} rx={11.5} stroke="#E5E7EB" /> */}
      <Defs>
        <ClipPath id="a">
          <Path fill={color1 ? color1 : "#fff"} transform="translate(8 8)" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default React.memo(BackIcon)
