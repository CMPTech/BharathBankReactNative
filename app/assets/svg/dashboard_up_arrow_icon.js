import React from 'react'
import Svg, { Path, Mask, G } from 'react-native-svg'
function DashboardUpArrowIcon({ color }) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
    <Path
      style={{
        stroke: "none",
        fillRule: "nonzero",
        fill: "#347AF0",
        fillOpacity: 1,
      }}
      d="M.137 18.203c.336.242 1.066-.058 1.847-.77 1.395-1.277 2.813-2.554 4.141-3.906 2.059-2.082 4.059-4.218 6.082-6.328 3.328 3.946 7.227 7.453 10.82 11.196.168.18.567.328.739.328.343 0 .265-.368.047-.809-.731-1.457-1.899-2.937-3.2-4.328-2.535-2.695-5.027-5.422-7.675-8.031l-.012-.012a.936.936 0 0 0-1.32.012c-.626.636-1.25 1.28-1.864 1.937-.418.39-.832.781-1.246 1.172-2.617 2.504-5.195 5.047-7.601 7.738-.692.774-1.133 1.535-.758 1.801Zm0 0"
    />
  </Svg>
  )
}

export default React.memo(DashboardUpArrowIcon)