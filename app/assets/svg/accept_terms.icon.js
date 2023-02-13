import React, { useContext } from 'react'
import Svg, { Path, Mask, G } from 'react-native-svg'
import { ThemeColors } from 'react-navigation'
import { AppContext } from '../../themes/AppContextProvider'

function AcceptTermsIcon({ width, height, color, }) {

  const { theme, changeTheme } = useContext(AppContext)

  return (

    // <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <Path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M23 12v-.9c0-.6-.4-1-1-1s-1 .4-1 1v.9c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c1.3 0 2.5.3 3.7.8.5.2 1.1 0 1.3-.5.2-.5 0-1.1-.5-1.3-1.4-.7-3-1-4.5-1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11Zm-.7-9.7c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-11 11c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3l-3-3c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l2.3 2.3L22.3 2.3Z"
    //     fill={theme.colors.buttonStrokeStartColor}
    //   />
    //   <Mask
    //     id="a"
    //     style={{
    //       maskType: "alpha",
    //     }}
    //     maskUnits="userSpaceOnUse"
    //     x={1}
    //     y={1}
    //     width={23}
    //     height={22}
    //   >
    //     <Path
    //       fillRule="evenodd"
    //       clipRule="evenodd"
    //       d="M23 12v-.9c0-.6-.4-1-1-1s-1 .4-1 1v.9c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c1.3 0 2.5.3 3.7.8.5.2 1.1 0 1.3-.5.2-.5 0-1.1-.5-1.3-1.4-.7-3-1-4.5-1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11Zm-.7-9.7c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-11 11c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3l-3-3c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l2.3 2.3L22.3 2.3Z"
    //       fill="#fff"
    //     />
    //   </Mask>
    //   <G mask="url(#a)">
    //     <Path fill={theme.colors.buttonStrokeStartColor} d="M0 0h24v24H0z" />
    //   </G>
    // </Svg>

    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 12C2 6.477 6.477 2 12 2c1.595 0 3.105.374 4.445 1.04a1 1 0 1 1-.89 1.791 8 8 0 1 0 4.396 6.279 1 1 0 1 1 1.988-.22c.04.365.061.735.061 1.11 0 5.523-4.477 10-10 10S2 17.523 2 12Zm19.707-7.707a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L12 12.586l8.293-8.293a1 1 0 0 1 1.414 0Z"
      fill={color?color:theme.colors.buttonStrokeStartColor}
    />
  </Svg>
  )
}

export default React.memo(AcceptTermsIcon)
