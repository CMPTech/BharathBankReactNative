import * as React from "react"
import Svg, { Path } from "react-native-svg"

const CrossIcon = ({ color }) => (
  // <Svg
  //   width={24}
  //   height={24}
  //   fill="none"
  // >
  //   <Path
  //     fillRule="evenodd"
  //     clipRule="evenodd"
  //     d="M.585.61a1.998 1.998 0 0 1 2.825 0l8.578 8.577L20.565.61a1.998 1.998 0 1 1 2.825 2.825l-8.577 8.578 8.577 8.577a1.997 1.997 0 0 1-2.825 2.825l-8.578-8.577-8.577 8.577A1.998 1.998 0 0 1 .585 20.59l8.577-8.578L.585 3.435a1.998 1.998 0 0 1 0-2.825Z"
  //     fill={color?color:'#328DEC'}
  //     fillOpacity={0.95}
  //   />
  // </Svg>

  <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 17.587A1 1 0 1 0 6.415 19L12 13.415 17.586 19A1 1 0 0 0 19 17.586l-5.586-5.585L19 6.414A1 1 0 0 0 17.585 5L12 10.586 6.414 5A1 1 0 0 0 5 6.415L10.586 12 5 17.587Z"
      fill={color ? color : '#000'}
    />
  </Svg>

)

export default CrossIcon
