import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

const HistoryIcon = () => (
  <Svg
    width={22}
    height={22}
    fill="none"
  >
    <Path
      d="M21.5 11a10.5 10.5 0 1 1-21 0A.75.75 0 1 1 2 11a9.014 9.014 0 1 0 4.034-7.5H6.5a.75.75 0 1 1 0 1.5H4.25a.75.75 0 0 1-.75-.75V2A.75.75 0 1 1 5 2v.385A10.497 10.497 0 0 1 21.5 11Zm-3.75 0A6.75 6.75 0 1 1 11 4.25 6.757 6.757 0 0 1 17.75 11Zm-4.084.876-1.916-1.277V7.25a.75.75 0 1 0-1.5 0V11a.75.75 0 0 0 .334.624l2.25 1.5a.75.75 0 0 0 .832-1.248Z"
      fill="url(#a)"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={11}
        y1={0.5}
        x2={11}
        y2={21.5}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#1A74FF" />
        <Stop offset={1} stopColor="#05A9FC" />
      </LinearGradient>
    </Defs>
  </Svg>
)

export default HistoryIcon