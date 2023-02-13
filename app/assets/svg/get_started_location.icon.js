import React, { useContext } from 'react'
import Svg, {   Path, Mask, G} from 'react-native-svg'
import { AppContext } from '../../themes/AppContextProvider'
function GetStartedLocationIcon({ width, height, color1, color2 }) {
  const { theme, changeTheme } = useContext(AppContext)
  return (
  //   <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    
  //     <Path
  //       fillRule="evenodd"
  //       clipRule="evenodd"
  //       d="M2 10C2 4.5 6.5 0 12 0s10 4.5 10 10c0 7.4-9.1 13.6-9.4 13.8-.2.1-.4.2-.6.2-.2 0-.4-.1-.6-.2C11.1 23.6 2 17.4 2 10Zm2 0c0 5.4 6.1 10.4 8 11.8 1.9-1.4 8-6.4 8-11.8 0-4.4-3.6-8-8-8s-8 3.6-8 8Zm8-4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Zm-2 4c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2Z"
  //       fill={theme.colors.lightGreen}
  //     />
   
  // </Svg>

<Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
<Path
  d="M12 0C7.113 0 3.136 3.977 3.136 8.866c0 1.61.722 3.34.752 3.413a14.3 14.3 0 0 0 1.025 1.917l6.078 9.21c.25.378.617.594 1.01.594.394 0 .762-.216 1.01-.593l6.08-9.211a14.24 14.24 0 0 0 1.025-1.917c.03-.072.751-1.803.751-3.413C20.866 3.977 16.89 0 12.001 0Zm7.153 11.874a13.096 13.096 0 0 1-.934 1.747l-6.08 9.211c-.12.182-.157.182-.277 0l-6.08-9.21a13.103 13.103 0 0 1-.934-1.748c-.008-.022-.67-1.615-.67-3.008 0-4.314 3.51-7.823 7.823-7.823 4.313 0 7.822 3.51 7.822 7.823 0 1.395-.663 2.993-.67 3.008Z"
  fill={theme.colors.lightGreen}
/>
<Path
  d="M12 4.172a4.699 4.699 0 0 0-4.693 4.693A4.699 4.699 0 0 0 12 13.56a4.7 4.7 0 0 0 4.694-4.694A4.699 4.699 0 0 0 12 4.172Zm0 8.344a3.655 3.655 0 0 1-3.65-3.65A3.655 3.655 0 0 1 12 5.214a3.655 3.655 0 0 1 3.65 3.65A3.655 3.655 0 0 1 12 12.516Z"
  fill={theme.colors.lightGreen}
/>
</Svg>
  )
}

export default React.memo(GetStartedLocationIcon)
