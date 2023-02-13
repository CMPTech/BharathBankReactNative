import * as React from "react"
import Svg, { Path } from "react-native-svg"

const MyAccountIcon = ({color}) => (
  <Svg
    width={20}
    height={20}
    fill="none"
  >
    <Path
      d="M13.333 5.833a3.333 3.333 0 1 1-6.667 0 3.333 3.333 0 0 1 6.667 0v0Zm-3.334 5.834A5.833 5.833 0 0 0 4.166 17.5h11.667a5.833 5.833 0 0 0-5.834-5.833v0Z"
      stroke={color?color:"#FEFEFE"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default MyAccountIcon;