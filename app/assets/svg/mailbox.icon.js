import React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'

function MailBoxIcon({ width, height, color1, color2 }) {
  return (
    // <Svg width={22} height={18} fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <Path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M19 0H3C1.3 0 0 1.3 0 3v12c0 1.7 1.3 3 3 3h16c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3ZM3 2h16c.4 0 .7.2.9.6L11 8.8 2.1 2.6c.2-.4.5-.6.9-.6ZM2 15c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V4.9l-8.4 5.9c-.2.1-.4.2-.6.2-.2 0-.4-.1-.6-.2L2 4.9V15Z"
    //     fill={color1 ? color1 : "#000"}
    //   />
    // </Svg>
    <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={18}>
      <Path
        style={{
          stroke: "none",
          fillRule: "nonzero",
          fill: color1 ? color1 : "#000",
          fillOpacity: 1,
        }}
        d="M16.313 2.25H1.688A1.69 1.69 0 0 0 0 3.938v10.124c0 .93.758 1.688 1.688 1.688h14.624A1.69 1.69 0 0 0 18 14.062V3.938a1.69 1.69 0 0 0-1.688-1.688Zm0 1.125c.078 0 .148.016.214.043L9 9.941 1.473 3.418a.555.555 0 0 1 .214-.043Zm0 11.25H1.688a.565.565 0 0 1-.563-.563V4.605l7.508 6.508a.563.563 0 0 0 .734 0l7.508-6.508v9.457a.565.565 0 0 1-.563.563Zm0 0"
      />
    </Svg>
  )
}

export default React.memo(MailBoxIcon)
