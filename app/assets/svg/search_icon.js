import React from 'react'
import  Svg, { G, Path, Defs, ClipPath }from 'react-native-svg';
const SearchIcon = ({color}) => (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#a)">
        <Path
          d="m15.902 15.431-4.868-4.868a6.3 6.3 0 0 0 1.633-4.23A6.34 6.34 0 0 0 6.333 0 6.34 6.34 0 0 0 0 6.333a6.34 6.34 0 0 0 6.333 6.334 6.3 6.3 0 0 0 4.23-1.633l4.868 4.868a.332.332 0 0 0 .471 0 .333.333 0 0 0 0-.471ZM6.333 12A5.673 5.673 0 0 1 .667 6.333 5.673 5.673 0 0 1 6.333.667 5.673 5.673 0 0 1 12 6.333 5.673 5.673 0 0 1 6.333 12Z"
          fill={color?color:"#000"}
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h16v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
  
  export default SearchIcon;