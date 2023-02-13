import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

const HelpIcon = () => (
  <Svg
    width={20}
    height={20}
    fill="none"
  >
    <G clipPath="url(#a)" fill="#FFBF13">
      <Path d="M10 14a.4.4 0 1 0 0 .8.4.4 0 0 0 0-.8Z" />
      <Path d="M10 15.2a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Z" />
      <Path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0Zm0 19.2C4.927 19.2.8 15.073.8 10 .8 4.927 4.927.8 10 .8c5.073 0 9.2 4.127 9.2 9.2 0 5.073-4.127 9.2-9.2 9.2Z" />
      <Path d="M12.754 7.095a2.817 2.817 0 0 0-2.25-2.251A2.798 2.798 0 0 0 7.2 7.6a.4.4 0 0 0 .8 0c0-.593.26-1.151.714-1.532a1.991 1.991 0 0 1 1.652-.435c.801.14 1.46.8 1.601 1.601a1.99 1.99 0 0 1-1.004 2.119C10.11 9.823 9.6 10.637 9.6 11.6v.8a.4.4 0 0 0 .799 0v-.87c0-.597.356-1.15.95-1.477a2.813 2.813 0 0 0 1.406-2.958Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)

export default HelpIcon
