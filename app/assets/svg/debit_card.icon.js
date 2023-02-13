import React from 'react'
import Svg, { Rect, G, Path, Defs, ClipPath } from 'react-native-svg'

function DebitCardIcon({ width, height, color1, color2 }) {
  return (
    <Svg width={48} height={48} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={48} height={48} rx={12} fill="#05B2EA" />
      <G clipPath="url(#a)" fill="#fff">
        <Path d="M12 22.545v6.211a3.239 3.239 0 0 0 3.239 3.239H32.76A3.239 3.239 0 0 0 36 28.756v-6.211a.563.563 0 0 0-.563-.563H12.563a.563.563 0 0 0-.563.563Zm5.992 3.942H16.49a.986.986 0 1 1 0-1.97h1.502a.986.986 0 0 1 0 1.97ZM36 19.447v-.203a3.239 3.239 0 0 0-3.239-3.239H15.24A3.239 3.239 0 0 0 12 19.244v.203c0 .311.252.563.563.563h22.874a.563.563 0 0 0 .563-.563Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" transform="translate(12 12)" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default React.memo(DebitCardIcon)
