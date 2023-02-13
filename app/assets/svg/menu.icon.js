import React, { useContext } from 'react'
import Svg, { Path, Mask, G } from 'react-native-svg'
import { ThemeColors } from 'react-navigation'
import { AppContext } from '../../themes/AppContextProvider'

function MenuIcon({ width, height, color1, color2 }) {

  const { theme, changeTheme } = useContext(AppContext)

  return (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M21 7H3C1.7 7 1.7 5 3 5h18c1.3 0 1.3 2 0 2ZM18 13H3c-1.3 0-1.3-2 0-2h15c1.3 0 1.3 2 0 2ZM12 19H3c-1.3 0-1.3-2 0-2h9c1.3 0 1.3 2 0 2Z"
        fill={theme.colors.lightGreen || "#000"}
      />
    </Svg>

  )
}

export default React.memo(MenuIcon)
