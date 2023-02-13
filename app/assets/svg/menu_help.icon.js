import React, { useContext } from 'react'
import Svg, {  G, Path, Defs, ClipPath  } from 'react-native-svg'
import { ThemeColors } from 'react-navigation'
import { AppContext } from '../../themes/AppContextProvider'

function MenuHelpIcon({ width, height, color1, color2 }) {

  const { theme, changeTheme } = useContext(AppContext)

  return (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#a)"
        fill={theme.colors.lightGreen || "#000"}
      >
        <Path d="M12 24v-.548V24C5.383 24 0 18.617 0 12S5.383 0 12 0s12 5.383 12 12-5.383 12-12 12Zm0-22.903C5.988 1.097 1.097 5.988 1.097 12c0 6.012 4.89 10.903 10.903 10.903 6.012 0 10.903-4.891 10.903-10.903 0-6.012-4.89-10.903-10.903-10.903Z" />
        <Path d="M12 14.527a.548.548 0 0 1-.548-.548v-2.321c0-.303.245-.549.548-.549a2.204 2.204 0 0 0 2.202-2.201A2.204 2.204 0 0 0 12 6.706 2.204 2.204 0 0 0 9.8 8.908a.548.548 0 1 1-1.097 0A3.302 3.302 0 0 1 12 5.609a3.302 3.302 0 0 1 3.298 3.299 3.303 3.303 0 0 1-2.75 3.252v1.819a.548.548 0 0 1-.548.548ZM12 17.916a.903.903 0 1 0 0-1.807.903.903 0 0 0 0 1.807Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>

  )
}

export default React.memo(MenuHelpIcon)
