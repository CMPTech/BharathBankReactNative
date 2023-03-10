import React, { useContext } from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
import { AppContext } from '../../themes/AppContextProvider'

function GetStartedFAQIcon({ width, height, color1, color2 }) {
  const { theme, changeTheme } = useContext(AppContext)
  return (
    //   <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <Path
    //       fillRule="evenodd"
    //       clipRule="evenodd"
    //       d="M1 12c0 6.1 4.9 11 11 11s11-4.9 11-11S18.1 1 12 1 1 5.9 1 12Zm2 0c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9Zm10 0V8c0-.6-.4-1-1-1s-1 .4-1 1v4c0 .6.4 1 1 1s1-.4 1-1Zm-.3 4.7c-.2.2-.4.3-.8.3-.3 0-.5-.1-.7-.3-.2-.2-.3-.4-.3-.7 0-.117.034-.2.063-.269.02-.048.037-.09.037-.131 0-.1.1-.2.2-.3.3-.3.7-.4 1.1-.2.05 0 .075.025.1.05.025.025.05.05.1.05.1 0 .2.1.2.1.05.05.075.1.1.15.025.05.05.1.1.15.1.1.1.3.1.4 0 .05-.025.125-.05.2-.025.075-.05.15-.05.2 0 .1-.1.2-.2.3Z"
    //       fill={theme.colors.lightGreen}
    //     />

    // </Svg>
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm9-8a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        fill={color1 ? color1 : theme.colors.lightGreen}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 8a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5A.5.5 0 0 1 12 8ZM12 15a.5.5 0 0 1 0 1 .5.5 0 0 1 0-1Z"
        fill={color1 ? color1 : theme.colors.lightGreen}
      />
    </Svg>
  )
}

export default React.memo(GetStartedFAQIcon)
