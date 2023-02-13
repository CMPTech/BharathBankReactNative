import * as React from "react"
import Svg, { Path } from "react-native-svg"

const MoreIcon = (props) => (
  <Svg
    width={25}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M22.04 8.27V4.23c0-1.59-.64-2.23-2.233-2.23H15.76c-1.593 0-2.234.64-2.234 2.23v4.04c0 1.59.641 2.23 2.234 2.23h4.046c1.592 0 2.233-.64 2.233-2.23ZM10.523 8.52V3.98c0-1.41-.641-1.98-2.234-1.98H4.243C2.651 2 2.01 2.57 2.01 3.98v4.53c0 1.42.64 1.98 2.233 1.98H8.29c1.593.01 2.234-.56 2.234-1.97ZM10.523 19.77v-4.04c0-1.59-.641-2.23-2.234-2.23H4.243c-1.592 0-2.233.64-2.233 2.23v4.04c0 1.59.64 2.23 2.233 2.23H8.29c1.593 0 2.234-.64 2.234-2.23Z"
      fill="#1A70FF"
      stroke="#1A70FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.527 17.5h6.01M17.533 20.5v-6"
      stroke="#1A70FF"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
)

export default MoreIcon