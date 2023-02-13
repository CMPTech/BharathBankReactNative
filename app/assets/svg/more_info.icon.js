import React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'

function MoreInfoIcon({ width, height, color}) {
  return (
    //   <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
    //   <Path
    //     style={{
    //       stroke: "none",
    //       fillRule: "nonzero",
    //       fill: "#2d60ff66",
    //       fillOpacity: 1,
    //     }}
    //     d="M12 2C6.488 2 2 6.488 2 12s4.488 10 10 10 10-4.488 10-10S17.512 2 12 2Zm0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8Zm-1 3v2h2V7Zm0 4v6h2v-6Zm0 0"
    //   />
    // </Svg>


    <Svg xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
    <Path
      style={{
        stroke: "none",
        fillRule: "nonzero",
        fill:  color? color:"#2d60ff88",
        fillOpacity: 1,
      }}
      d="M8 0C3.578 0 0 3.578 0 8c0 4.422 3.578 8 8 8 4.422 0 8-3.578 8-8 0-4.422-3.578-8-8-8Zm0 14.883A6.888 6.888 0 0 1 1.117 8 6.888 6.888 0 0 1 8 1.117 6.888 6.888 0 0 1 14.883 8 6.888 6.888 0 0 1 8 14.883Zm0 0"
    />
    <Path
      style={{
        stroke: "none",
        fillRule: "nonzero",
        fill:color? color: "#2d60ff88",
        fillOpacity: 1,
      }}
      d="M8 6.668c-.473 0-.809.203-.809.496v4.012c0 .254.336.508.809.508.453 0 .82-.254.82-.508V7.164c0-.293-.367-.496-.82-.496ZM8 4.191c-.484 0-.863.348-.863.75 0 .399.379.758.863.758.473 0 .852-.36.852-.758 0-.402-.38-.75-.852-.75Zm0 0"
    />
  </Svg>
  )
}

export default React.memo(MoreInfoIcon)
