import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Platform,
  Animated
} from "react-native";
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import TitleText from "../../components/base/TitleText";
import MainButton from "../../components/button/MainButton";
import { LogoIcon, SplashScreenIcon, NotificationIcon } from "../../../assets/svg";
import { REGISTER, LOCATION, CALL_US, AUTH, FAQS, HOME, PAY_PEOPLE } from "../../routes";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { timeOutIcon, notification,notificationIcon } from "../../../assets/icons"
import DrawerNotificationIcon from "../../../assets/svg/drawer_notification.icon";
import { AuthHeader } from "../../components";
import { ThemeColors } from "react-navigation";

export default function NotificationScreen({ navigation, route }) {

  const { t, i18n } = useTranslation();

  const { theme, changeTheme } = useContext(AppContext)

  const renderHeader = () => {
    return (
      <View style={{ marginTop: -30 }}>

        <LinearGradient
          useAngle={true}
          angle={45}
          angleCenter={{ x: 0.5, y: 0.5 }}
          colors={["#4370e7", "#479ae8", "#4ad4e8"]}>
          <View style={{
            flexDirection: 'column',

          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <Text style={{
                color: colors.textColorWhite,
                fontSize: fontSize.header3,
                fontFamily: fontName.medium,
                padding: 15,
                marginLeft: 120
              }}>{t(AUTH_KEYS.WEL_COME.NOTIFICATION)}</Text>

            </View>

          </View>
        </LinearGradient>
      </View>)
  }

  return (

    <View style={{ flex: 1 }}>
      {/* {renderHeader()} */}
      <AuthHeader title={t(AUTH_KEYS.WEL_COME.NOTIFICATION)}
        navigation={navigation}
      />

      <View style={{
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 20,
        marginTop: '25%'
      }}>
        <Image
            source={notificationIcon}
            style={{ width: 100, height: 100,marginTop:10,}}
          />

        {/* <NotificationIcon color1={theme.colors.buttonColor} /> */}

        <Text
          style={{
            fontSize: fontSize.textLarge,
            textAlign: 'center',
            marginTop: 20,
            fontWeight: "bold",
            color: 'black',
            opacity: 0.8
          }}
        >
          {t(AUTH_KEYS.WEL_COME.NOTIFICATION_MSG)}
        </Text>
        <Text
          style={{
            fontSize: fontSize.textNormal,
            textAlign: 'center',
            marginTop: 20,
            color: theme.colors.grey,

          }}
        >
          {t(AUTH_KEYS.WEL_COME.NOTIFICATION_MSG_SEC)}

        </Text>
      </View>

    </View>

  );
}


