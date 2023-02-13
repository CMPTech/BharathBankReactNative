import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet
} from "react-native";
import { fontName, fontPixel, FONTS, fontSize, pixelSizeHorizontal, pixelSizeVertical, SIZES } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { LogoIcon, SplashScreenIcon } from "../../../assets/svg";
import TitleText from "../../components/base/TitleText";
import { GET_STARTED, HOME } from "../../routes";
import AuthNoGradientHeader from "../../components/base/AuthNoGradientHeader";
import { useSelector } from "react-redux";
import { profileSelector, userDetailsSelector, avatarSelector, userProfileSelector } from "../../store/selectors";
import { profile } from '../../../assets/images';
import StyleTextView from "../../components/input/StyleTextView";
import {
  avatarOne,
  avatarTwo,
  avatarThree,
  avatarFour,
  avatarFive,
  avatarSix,
  avatarSeven,
  avatarEight,
  avatarNine,
  EditIcon
} from '../../../assets/icons';
import moment from "moment";
import { t } from "i18next";
import { AUTH_KEYS } from "../../../assets/translations/constants";
export default function ProfileDetailsScreen({ navigation, route }) {
  const avatarSelected = useSelector(avatarSelector)
  const profileImg = useSelector(userProfileSelector);
  const profileImage = [{ icon: avatarOne, selected: false, name: "One" },
  { icon: avatarTwo, selected: false, name: "Two" },
  { icon: avatarThree, selected: false, name: "Three" },
  { icon: avatarFour, selected: false, name: "Four" },
  { icon: avatarFive, selected: false, name: "Five" },
  { icon: avatarSix, selected: false, name: "Six" },
  { icon: avatarSeven, selected: false, name: "Seven" },
  { icon: avatarEight, selected: true, name: "Eight" },
  { icon: avatarNine, selected: false, name: "Nine" },]
  const { theme, changeTheme } = useContext(AppContext)
  const selectedProfileDetails = useSelector(profileSelector)
  const userDetails = useSelector(userDetailsSelector)
  const [isRetailLogin, setRetailLogin] = useState(userDetails?.retail);
  function renderDetails(label, value) {
    return (
      <View style={{
        flexDirection: 'column',
        margin: pixelSizeHorizontal(10)
      }}>
        <View>
          <StyleTextView value={label}
            style={{
              fontSize: fontPixel(17),//fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.grey,
              //opacity: 0.5
            }} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <StyleTextView value={value}
            style={{
              fontSize: fontPixel(16),//fontSize.textNormal,
              fontFamily: fontName.bold,
              color: theme.colors.grey,
              lineHeight: pixelSizeVertical(25),
              //opacity: 0.9
            }} />
        </View>



        <View style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.dividerColor,
          opacity: .2,
          marginTop: pixelSizeVertical(10)
        }} />
      </View>
    );
  }
  function sentenceCase(str) {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();

    return str.replace(/\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() +
          txt.substr(1).toLowerCase();
      });
  }
  function mask(input) {
    if (input === undefined || input === null || input === 'undefined' || input === 'null') {
      return ''
    }
    return input
      .slice(0, input.length - 4)
      .replace(/([a-zA-Z0-9])/g, 'x') + input.slice(-4)
  }
  function maskPAN(input) {
    if (input === undefined || input === null || input === 'undefined' || input === 'null') {
      return ''
    }
    return input
      .replace(/([a-zA-Z])/g, 'x')
  }
  return (
    <View style={{ flex: 1 }} >



      <View style={{ backgroundColor: theme.colors.buttonColor, marginBottom: 20 }}>
        <AuthNoGradientHeader
          title={t(AUTH_KEYS.PERSONAL_DETAILS.PERSONAL_DETAILS_HEAD)}
          navigation={navigation}
        />

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', margin: 20 }}
          onPress={() => {
            navigation.navigate(HOME.UPDATE_PROFILE_IMAGE)
          }
          }
        >
          <Image
            // source={profileImage.find(v => v.name === avatarSelected).icon}
            source={(profileImg !== null) ? { uri: `data:image/png;base64,${profileImg}` } : profileImage.find(v => v.name === avatarSelected).icon}
            style={{
              width: 50, height: 50, borderRadius: 50,
              alignItems: 'center'
            }}
          />
          <Image
            source={EditIcon}
            style={{
              width: 20,
              height: 20,
              position: 'absolute',
              left: 40,
              bottom: 0
            }}
          />
          <View
            style={{ marginLeft: 10, width: '80%', marginLeft: 20 }}
          >
            <Text style={{ color: "#FFFF", ...FONTS.h3 }}>
              {
                selectedProfileDetails?.profileName
              }
            </Text>
            {/* <Text style={{ color: "#FFFF", ...FONTS.body4 }}>View your Profile</Text> */}

          </View>
        </TouchableOpacity>
      </View>

      {isRetailLogin &&
        <ScrollView>
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.MAILING_ADDRESS), sentenceCase(userDetails?.mailingAddress) || "-")}
          {/* {renderDetails("Date of birth", moment(userDetails?.customerDob).format('DD-MM-YYYY') || "-")} */}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.DATE_OF_BIRTH), (userDetails?.customerDob) || "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.NATIONALITY), userDetails?.nationality || "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.REGISTERED_MOBILE), mask(userDetails?.registeredMobile) || "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.REGISTERED_EMAIL), userDetails?.registeredEmail || "-")}
          {renderDetails(t(AUTH_KEYS.REGISTER.PAN_NUMBER), userDetails?.panNo ? maskPAN(userDetails?.panNo) : "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.AADHAR_NUMBER), userDetails?.aadhaarNo ? mask(userDetails?.aadhaarNo) : "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.PASSPORT), userDetails?.passport ? mask(userDetails?.passport) : "-")}

        </ScrollView>
      }

      {!isRetailLogin &&
        <ScrollView>
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.REGISTERED_COMPANY_ADDRESS), sentenceCase(userDetails?.regCompAddress) || "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.DATE_OF_INCORPORATION), userDetails?.dateOfIncorp)}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.REGISTERED_MOBILE_OF_THE_USER), mask(userDetails?.registeredMobile) || "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.REGISTERED_EMAIL_ID_OF_THE_USER), userDetails?.registeredEmail || "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.PAN_CARD), userDetails?.panNo ? maskPAN(userDetails?.panNo) : "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.TYPE_OF_COMPANY), userDetails?.typeOfCompany || "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.REGISTERATION_No), userDetails?.registrationNo || "-")}
          {renderDetails(t(AUTH_KEYS.PERSONAL_DETAILS.TIN), userDetails?.tin || "-")}
        </ScrollView>
      }

    </View>
  );
}


