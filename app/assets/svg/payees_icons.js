import * as React from "react"
import Svg, { Path } from "react-native-svg"

const PayeesIcon = ({color}) => (
  <Svg
    width={18}
    height={18}
    fill="none"
  >
    <Path
      d="M9 5.667c-1.38 0-2.5.745-2.5 1.666C6.5 8.254 7.62 9 9 9s2.5.746 2.5 1.667c0 .92-1.12 1.666-2.5 1.666m0-6.666c.925 0 1.733.335 2.166.833M9 5.667v-.834m0 .834v6.666m0 0v.834m0-.834c-.925 0-1.733-.335-2.166-.833M16.5 9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
      stroke={color?color:"#fff"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default  PayeesIcon