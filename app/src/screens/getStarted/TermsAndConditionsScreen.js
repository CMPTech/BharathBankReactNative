import React, { useContext ,useState} from "react";
import {
  View,
  Image,
  ScrollView,
  Text
} from "react-native";
import { fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import MainButton from "../../components/button/MainButton";
import StyleTextView from "../../components/input/StyleTextView";
import { AUTH, REGISTER } from "../../routes";
import { AUTH_KEYS, } from '../../../assets/translations/constants';
import { useTranslation } from 'react-i18next';
import AuthBody from "../../components/base/AuthBody";


export default function TermsAndConditionsScreen({ navigation, route }) {
  const { theme, changeTheme } = useContext(AppContext)
  const { t, i18n } = useTranslation();

  const [disableButton, setDisableButton] = useState(true);


  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  return (

    <AuthBody
      title={t(AUTH_KEYS.REGISTER.BEFORE_YOU_CONTINUE)}
      scrollable={false}
      navigation={navigation}>

      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, height: '80%' }}>


        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              setDisableButton(false)
            }else{
              setDisableButton(true)
            }
          }}
          scrollEventThrottle={400}>

          <StyleTextView value={t(AUTH_KEYS.REGISTER.ACCEPT_TERMS_CONDITION)} style={{
            fontSize: fontSize.textSmall,
            fontFamily: fontName.regular,
            color: theme.colors.headingTextColor,
            lineHeight: 17,
            marginTop: 10
          }} />
        </ScrollView>
        <MainButton
          title={t(AUTH_KEYS.REGISTER.AGGREE_CONTINUE)}
          disabled={disableButton}
          onPress={() => {
            navigation.navigate(REGISTER.PIN_SUCCESS)
          }} />


      </View>
    </AuthBody>
  );
}


