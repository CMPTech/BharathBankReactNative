import * as React from "react"
import Svg, { Path, Mask, G } from "react-native-svg"

const DrawerNotificationIcon = ({ color1 }) => (
  <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">


    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23 17c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1s.4-1 1-1c1.1 0 2-.9 2-2V9c0-4.4 3.6-8 8-8s8 3.6 8 8v5c0 1.1.9 2 2 2 .6 0 1 .4 1 1Zm-8.4 4.5C14 22.5 13 23 12 23c-.5 0-1-.1-1.5-.4-.5-.3-.8-.6-1.1-1.1-.3-.5-.1-1.1.4-1.4.5-.3 1.1-.1 1.4.4.03.03.06.07.094.113.076.099.167.217.306.287.5.3 1.1.1 1.4-.4.3-.5.9-.6 1.4-.4.5.2.5.9.2 1.4ZM18 14c0 .7.2 1.4.5 2h-13c.3-.6.5-1.3.5-2V9c0-3.3 2.7-6 6-6s6 2.7 6 6v5Z"
      fill={color1 ? color1 : "#fff"}
    />
    
  </Svg>
)

export default DrawerNotificationIcon
