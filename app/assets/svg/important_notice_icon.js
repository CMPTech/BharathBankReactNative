import React from 'react'
import Svg, {  Path, Circle } from 'react-native-svg'

function ImportantNoticeIcon({ width, height, color1, color2 }) {
  return (
    <Svg width={327} height={509} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M202.346 433.672c6.846 8.994 10.269 13.49 11.695 14.667 2.908 2.401 2.865 2.38 6.537 3.24 1.8.421 4.546.421 10.037.421H291c11.183 0 16.774 0 21.184-1.827a24 24 0 0 0 12.989-12.989C327 432.774 327 427.183 327 416V36c0-11.183 0-16.774-1.827-21.184a24 24 0 0 0-12.989-12.99C307.774 0 302.183 0 291 0H36C24.817 0 19.226 0 14.816 1.827a24 24 0 0 0-12.99 12.989C0 19.226 0 24.817 0 36v380c0 11.183 0 16.774 1.827 21.184a24 24 0 0 0 12.989 12.989C19.226 452 24.817 452 36 452h60.385c5.491 0 8.237 0 10.037-.421 3.672-.86 3.629-.839 6.537-3.24 1.426-1.177 4.849-5.673 11.695-14.667C133.252 422.377 147.446 415 163.5 415c16.054 0 30.248 7.377 38.846 18.672Z"
      fill="#FFED9D"
    />
    <Circle
      cx={163}
      cy={465}
      r={44}
      transform="rotate(-180 163 465)"
      fill="#fff"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M152.585 453.61a1.997 1.997 0 0 1 2.825 0l8.578 8.577 8.577-8.577a2.003 2.003 0 0 1 1.42-.61 1.997 1.997 0 0 1 1.405 3.435l-8.577 8.577 8.577 8.578a2 2 0 0 1-1.42 3.386 2 2 0 0 1-1.405-.561l-8.577-8.577-8.578 8.577a2 2 0 0 1-3.386-1.42 2 2 0 0 1 .561-1.405l8.577-8.578-8.577-8.577a1.997 1.997 0 0 1 0-2.825Z"
      fill="#111827"
      fillOpacity={0.95}
    />
  </Svg>
  )
}

export default React.memo(ImportantNoticeIcon)