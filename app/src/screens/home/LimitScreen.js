import React, { useEffect, useContext } from "react";
import {
  View,
} from "react-native";
import { fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { LogoIcon, SplashScreenIcon } from "../../../assets/svg";
import TitleText from "../../components/base/TitleText";
import { GET_STARTED } from "../../routes";
import { t } from "i18next";
import { AUTH_KEYS } from "../../../assets/translations/constants";

export default function LimitScreen({ navigation, route }) {

  const { theme, changeTheme } = useContext(AppContext)


  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      useAngle={true}
      angle={45}
      angleCenter={{ x: 0.5, y: 0.5 }}
      colors={[theme.colors.mainBackground1, theme.colors.mainBackground2]} >
      <View style={{
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',

      }}>
        <TitleText title={t(AUTH_KEYS.MAIN_SCREEN.LIMITS)} style={{
          color: theme.colors.headingTextColor,
          margin: 10
        }} />


      </View>
    </LinearGradient>
  );
}


