import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

const DrawerHelpIcon = ({ color1 }) => (
  <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    <G clipPath="url(#a)" 
   fill={color1 ? color1 : "#fff"}
    >
      <Path d="M12 16.8a.48.48 0 1 0 0 .961.48.48 0 0 0 0-.96Z" />
      <Path d="M12 18.24a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92Z" />
      <Path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0Zm0 23.04C5.913 23.04.96 18.087.96 12 .96 5.913 5.913.96 12 .96 18.087.96 23.04 5.913 23.04 12c0 6.087-4.953 11.04-11.04 11.04Z" />
      <Path d="M15.306 8.516a3.38 3.38 0 0 0-2.7-2.702 3.373 3.373 0 0 0-2.765.733 3.358 3.358 0 0 0-1.2 2.574.48.48 0 0 0 .96 0c0-.711.313-1.381.858-1.838a2.39 2.39 0 0 1 1.981-.522c.962.169 1.752.96 1.922 1.922.183 1.04-.29 2.039-1.204 2.542-1.026.565-1.637 1.541-1.637 2.696v.96a.48.48 0 0 0 .958 0v-1.044c0-.716.427-1.379 1.14-1.772a3.376 3.376 0 0 0 1.687-3.55Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path
          fill={color1 ? color1 : "#fff"}
          d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)

export default DrawerHelpIcon
