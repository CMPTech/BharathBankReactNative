import React, { useEffect, useContext } from "react";
import {
  View,
  Image
} from "react-native";
import { fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { LogoIcon, SplashScreenIcon } from "../../../assets/svg";
import TitleText from "../../components/base/TitleText";
import { GET_STARTED, HOME } from "../../routes";

export default function SplashScreen({ navigation, route }) {

  const { theme, changeTheme } = useContext(AppContext)

  useEffect(() => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: GET_STARTED}],
      });
    }, 2000)
  }
  )

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.white,
    }}>
      <View style={{
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 20
      }}>
        <TitleText title={"Bharat Co-operative Bank (Mumbai) Limited"}
          style={{
            fontSize: fontSize.textLarge,
            fontFamily: fontName.regular,
            textAlign: 'center',
            letterSpacing: 1,
            color:theme.colors.black
          }} />
        <LinearGradient
          style={{
            alignSelf: 'center',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            width: 260,
            height: 230,
            marginTop: '10%'
          }}
          useAngle={true}
          angle={180}
          angleCenter={{ x: 0.5, y: 0.5 }}
          colors={["#4370e7", "#479ae8", "#4ad4e8"]} >
          <View style={{
            flex: 1,
            alignSelf: 'center',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>

            <Image source={require('./../../../assets/images/splash_icon.png')}
              resizeMode="contain"
              style={{
                width: 200,
                height: 80
              }} />

            <TitleText title={"Mobile Banking App"}
              style={{
                fontSize: fontSize.textNormal,
                fontFamily: fontName.regular,
                textAlign: 'center',
                color: theme.colors.white
              }} />


          </View>

          <TitleText title={"Ver 1.0"}
            style={{
              fontSize: fontSize.textSmall,
              fontFamily: fontName.regular,
              textAlign: 'center',
              color: theme.colors.white,
              marginBottom: 10
            }} />
        </LinearGradient>
      </View>

      <TitleText title={"Powered by Techurate"}
        style={{
          fontSize: fontSize.textNormal,
          fontFamily: fontName.regular,
          textAlign: 'center',
          marginBottom: '5%'
        }} />
    </View>

  );
}


