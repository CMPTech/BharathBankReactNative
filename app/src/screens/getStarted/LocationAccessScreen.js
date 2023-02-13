import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Image
} from "react-native";
import { fontName, fontSize, FONTS, SIZES } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { AuthHeader, MainButton } from '../../components';
import { LOCATION } from '../../routes'
import Geolocation from 'react-native-geolocation-service';
import {
  ATMBranchIcon,
} from '../../../assets/icons';
import GetStarted from '../../api/getStarted';
import { UIActivityIndicator } from "react-native-indicators";
import { showMessage, hideMessage } from "react-native-flash-message";
export default function LoactionAccessScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState({
    show: false,
    message: ''
  })
  const { theme, changeTheme } = useContext(AppContext)
  useEffect(() => {

  }, []);
  const getCurrentLocation = async () => {
    setLoading(true)
    Geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          setLoading(true)
          let request =
          {
            "userLatitude": coords.latitude,
            "userLongitude": coords.longitude
          }
          const response = await GetStarted.getNearByLoactionApi(request);
          navigation.navigate(LOCATION.ATM_BRANCH_LOCKER, { atmList: response })
        }
        catch (error) {
          setLoading(false)
          showMessage({
            message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
            description: error.message || error.error,
            type: t(AUTH_KEYS.LOCATE_US.TYPE_ERROR),
            hideStatusBar: true,
            backgroundColor: "black", // background color
            color: "white", // text color
          });
        }
        finally {
          setLoading(false)
        }
      },
      (error) => {
        setLoading(false);
        showMessage({
          message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
          description: t(AUTH_KEYS.LOCATE_US.DESCRIPTION),
          type: t(AUTH_KEYS.LOCATE_US.TYPE_ERROR),
          hideStatusBar: true,
          backgroundColor: "black", // background color
          color: "white", // text color
        });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }
  const getMyLoaction = async () => {
    if (Platform.OS === 'ios') {
      const granted = await Geolocation.requestAuthorization("whenInUse");
      if (granted === 'granted') {
        getCurrentLocation();
      }
      else {
        showMessage({
          message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
          description: t(AUTH_KEYS.LOCATE_US.DESCRIPTION),
          type: t(AUTH_KEYS.LOCATE_US.TYPE_ERROR),
          hideStatusBar: true,
          backgroundColor: "black", // background color
          color: "white", // text color
        });
      }
    }
    else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: t(AUTH_KEYS.LOCATE_US.DEDECT_LOCATION_PERMISSITION),
            message:
              t(AUTH_KEYS.LOCATE_US.DEDECT_LOCATION_PERMISSITION_ALLOW),
            buttonNeutral: t(AUTH_KEYS.LOCATE_US.ASKME_LATER),
            buttonNegative: t(AUTH_KEYS.LOCATE_US.CANCEL),
            buttonPositive: t(AUTH_KEYS.LOCATE_US.OK),
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          showMessage({
            message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
            description: t(AUTH_KEYS.LOCATE_US.DESCRIPTION),
            type: t(AUTH_KEYS.LOCATE_US.TYPE_ERROR),
            hideStatusBar: true,
            backgroundColor: "black", // background color
            color: "white", // text color
          });
        }
      } catch (err) {
        showMessage({
          message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
          description: t(AUTH_KEYS.LOCATE_US.DESCRIPTION),
          type: t(AUTH_KEYS.LOCATE_US.TYPE_ERROR),
          hideStatusBar: true,
          backgroundColor: "black", // background color
          color: "white", // text color
        });
      }
    }

  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bgColor
      }}>
     

        <AuthHeader title={t(AUTH_KEYS.LOCATE_US.TITLE)}
          navigation={navigation} />
        <Image
          source={ATMBranchIcon}
          style={{ alignSelf: 'center', width: 125, height: 70, marginTop: 50 }}
        />
        <Text style={{ ...FONTS.h2, textAlign: 'center', marginHorizontal: 40, marginTop: 10, color: theme.colors.textColor,lineHeight:Platform.OS==='android'?30:25 }}>{t(AUTH_KEYS.LOCATE_US.LOCATE_US_MSG)}</Text>
        <Text style={{ ...FONTS.body4, textAlign: 'center', marginHorizontal: 40, marginTop: 10, color: theme.colors.textColor, marginBottom: 30,lineHeight:Platform.OS==='android'?22:20 }}>{t(AUTH_KEYS.LOCATE_US.LOCATE_US_DESCRIPTION_MSG)}</Text>
        <MainButton title={t(AUTH_KEYS.LOCATE_US.DEDECT_LOCATION)} onPress={getMyLoaction} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(LOCATION.SEARCH_MANUALLY)
          }}
        >
          <Text style={{ ...FONTS.h3, textAlign: 'center', marginTop: 30, color: theme.colors.buttonColor }}>{t(AUTH_KEYS.LOCATE_US.SEARCH_MANUALLY)}</Text>
        </TouchableOpacity>
      {isLoading && (
        <View style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          alignSelf: 'center',
          top: 200,
          alignItems: "center",
          justifyContent: "center"
        }}>
          <UIActivityIndicator size={100} color={theme.colors.buttonColor} />
        </View>
      )}
    </SafeAreaView>
  );
}


