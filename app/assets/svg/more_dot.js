import * as React from "react"
import Svg, { Circle } from "react-native-svg"

const MoreOptionIcon = (props) => (
  <Svg
    width={15}
    height={3}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={1.5} cy={1.5} r={1.5} fill="#D9D9D9" />
    <Circle cx={7.5} cy={1.5} r={1.5} fill="#D9D9D9" />
    <Circle cx={13.5} cy={1.5} r={1.5} fill="#D9D9D9" />
  </Svg>
)

export default MoreOptionIcon