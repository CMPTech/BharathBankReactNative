import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ContactIcon = ({color}) => (
  <Svg
    width={18}
    height={18}
    fill="none"
  >
    <Path
      d="M9 2.628a3.333 3.333 0 1 1 0 4.41m2.5 9.462h5v-.833A5 5 0 0 0 9 11.336m2.5 5.164h-10v-.833a5 5 0 1 1 10 0v.833ZM9.833 4.833a3.333 3.333 0 1 1-6.666 0 3.333 3.333 0 0 1 6.666 0v0Z"
      stroke={color?color:"#fff"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default ContactIcon
