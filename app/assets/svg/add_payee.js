import * as React from "react"
import Svg, { Path } from "react-native-svg"

const AddPayeeIcon = (props) => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 16A8 8 0 1 0 8-.001 8 8 0 0 0 8 16ZM9 5a1 1 0 0 0-2 0v2H5a1 1 0 0 0 0 2h2v2a1 1 0 1 0 2 0V9h2a1 1 0 1 0 0-2H9V5Z"
      fill="#1A70FF"
    />
  </Svg>
)

export default AddPayeeIcon