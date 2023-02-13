import React from 'react'
import Svg, { Path, Mask, G } from 'react-native-svg'

function RadioButtonUncheckedIcon({ width, height, color, color2 }) {
  return (
    //   <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <Path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M1 12C1 5.9 5.9 1 12 1s11 4.9 11 11-4.9 11-11 11S1 18.1 1 12Zm2 0c0 5 4 9 9 9s9-4 9-9-4-9-9-9-9 4-9 9Z"
    //     fill="#000"
    //   />
    //   <Mask
    //     id="a"
    //     style={{
    //       maskType: "alpha",
    //     }}
    //     maskUnits="userSpaceOnUse"
    //     x={1}
    //     y={1}
    //     width={22}
    //     height={22}
    //   >
    //     <Path
    //       fillRule="evenodd"
    //       clipRule="evenodd"
    //       d="M1 12C1 5.9 5.9 1 12 1s11 4.9 11 11-4.9 11-11 11S1 18.1 1 12Zm2 0c0 5 4 9 9 9s9-4 9-9-4-9-9-9-9 4-9 9Z"
    //       fill="#fff"
    //     />
    //   </Mask>
    //   <G mask="url(#a)">
    //     <Path fill="#000" d="M0 0h24v24H0z" />
    //   </G>
    // </Svg>

    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.08 20c4.458 0 8.071-3.582 8.071-8s-3.613-8-8.071-8-8.071 3.582-8.071 8 3.613 8 8.071 8Zm9.08-8c0 4.97-4.065 9-9.08 9S3 16.97 3 12s4.065-9 9.08-9 9.08 4.03 9.08 9Z"
        fill={color?color:"#000"}
      />
    </Svg>
  )
}

export default React.memo(RadioButtonUncheckedIcon)
