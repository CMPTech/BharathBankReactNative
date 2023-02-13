import React from 'react'
import Svg, { Rect, G, Path, Defs, ClipPath } from 'react-native-svg'

function PanCardIcon({ width, height, color1, color2 }) {
  return (
    <Svg width={48} height={48} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={48} height={48} rx={12} fill="#05B2EA" />
      <G clipPath="url(#a)">
        <Path
          d="M33.25 15h-18.5A2.752 2.752 0 0 0 12 17.75v12.5A2.752 2.752 0 0 0 14.75 33h18.5A2.752 2.752 0 0 0 36 30.25v-12.5A2.752 2.752 0 0 0 33.25 15ZM19.5 19c1.378 0 2.5 1.122 2.5 2.5S20.878 24 19.5 24a2.503 2.503 0 0 1-2.5-2.5c0-1.378 1.122-2.5 2.5-2.5Zm4.5 9.25a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-.5A2.752 2.752 0 0 1 17.75 25h3.5A2.752 2.752 0 0 1 24 27.75v.5Zm8.25.75h-5.5a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 0 1.5Zm0-4h-5.5a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 0 1.5Zm0-4h-5.5a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 0 1.5Z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" transform="translate(12 12)" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default React.memo(PanCardIcon)
