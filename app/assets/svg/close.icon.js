import React from 'react'
import Svg, { G, Circle, Path, Defs} from 'react-native-svg'

function CloseIcon({ width, height, color1, color2 }) {
  return (
    <Svg width={44} height={44} fill="none" xmlns="http://www.w3.org/2000/svg">
    <G filter="url(#a)">
      <Circle
        cx={22}
        cy={18}
        transform="rotate(-180 22 18)"
        fill="#15c7a5"
        r={18}
      />
    </G>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.244 13.254a.832.832 0 0 1 1.177 0l3.574 3.578 3.574-3.578a.832.832 0 1 1 1.177 1.179l-3.574 3.577 3.574 3.578a.834.834 0 0 1-1.177 1.178l-3.574-3.577-3.574 3.577a.832.832 0 0 1-1.177-1.178l3.574-3.578-3.574-3.577a.834.834 0 0 1 0-1.179Z"
      fill="#fff"
      fillOpacity={0.95}
    />
    <Defs></Defs>
  </Svg>
  )
}

export default React.memo(CloseIcon)
