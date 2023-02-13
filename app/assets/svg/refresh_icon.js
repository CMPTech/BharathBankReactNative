import React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
const RefreshIcon = ({ color, size }) => (
  // <Svg
  //   width={16}
  //   height={16}
  //   fill="none"
  //   xmlns="http://www.w3.org/2000/svg"
  // >
  //   <G clipPath="url(#a)">
  //     <Path
  //       d="m15.902 15.431-4.868-4.868a6.3 6.3 0 0 0 1.633-4.23A6.34 6.34 0 0 0 6.333 0 6.34 6.34 0 0 0 0 6.333a6.34 6.34 0 0 0 6.333 6.334 6.3 6.3 0 0 0 4.23-1.633l4.868 4.868a.332.332 0 0 0 .471 0 .333.333 0 0 0 0-.471ZM6.333 12A5.673 5.673 0 0 1 .667 6.333 5.673 5.673 0 0 1 6.333.667 5.673 5.673 0 0 1 12 6.333 5.673 5.673 0 0 1 6.333 12Z"
  //       fill={color?color:"#000"}
  //     />
  //   </G>
  //   <Defs>
  //     <ClipPath id="a">
  //       <Path fill="#fff" d="M0 0h16v16H0z" />
  //     </ClipPath>
  //   </Defs>
  // </Svg>

  <Svg width={size ? size : 24} height={size ? size : 24} fill="none" xmlns="http://www.w3.org/2000/svg">
    <G clipPath="url(#a)"
      fill={color ? color : "#000"}
    >
      <Path d="M23.84 10.01a.546.546 0 0 0-.77 0l-1.29 1.288A9.81 9.81 0 0 0 3.674 6.833a.546.546 0 1 0 .926.578 8.723 8.723 0 0 1 16.088 3.81l-1.211-1.211a.546.546 0 0 0-.772.771l2.183 2.183a.545.545 0 0 0 .771 0l2.183-2.183a.545.545 0 0 0 0-.771ZM20.148 16.477a.547.547 0 0 0-.752.173 8.723 8.723 0 0 1-16.089-3.81l1.211 1.211a.546.546 0 0 0 .771-.771l-2.182-2.183a.545.545 0 0 0-.771 0L.153 13.28a.545.545 0 0 0 .772.771l1.288-1.288a9.81 9.81 0 0 0 18.107 4.465.546.546 0 0 0-.172-.751Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)

export default RefreshIcon;