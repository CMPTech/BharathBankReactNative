import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Keyboard,
  Platform
} from "react-native";
import { FONTS, SIZES, fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import MainButton from "../../components/button/MainButton";
import { BackIcon, SearchIcon, TickIcon } from '../../../assets/svg'
import { TextInput } from "react-native-paper";
import {
  downArrow,
  upArrow
} from '../../../assets/icons'
import Auth from "../../api/auth";
import { showMessage, hideMessage } from "react-native-flash-message";
import AuthBody from "../../components/base/AuthBody";
import { CALL_US, } from '../../routes';
import { AuthHeader, BottomButton, LoaderComponent } from "../../components";
import { useSelector } from "react-redux";
import { metaDataSelector, profileSelector } from "../../store/selectors";
import StyleInputView from "../../components/input/StyleInputView";
import { getAlphabetsAndNumbersOnly, getAlphabetsAndNumbersSpaceOnly } from "../../utils/amount-util";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SecurityQuestionAnswersScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const { theme, changeTheme } = useContext(AppContext);
  const { height } = Dimensions.get('window');
  const [isLoading, setLoading] = useState(false);

  const profileData = useSelector(profileSelector)

  const callUsData = useSelector(metaDataSelector)

  const [rawFaqsList, setRawFaqsList] = useState([])

  const [borderColor, setBorderColor] = useState(theme.colors.grey)

  const [faqsList, setFaqsList] = useState(rawFaqsList)

  useEffect(() => {
    getSecurityQuestion()
  }, []);

  const getSecurityQuestion = useCallback(async () => {
    try {
      let request = {
        profileId: profileData.profileId,
      }

      setLoading(true);
      const response = await Auth.getSecurityQuestionAnswerApi(request);
      setLoading(false);
      setFaqsList(response)
      setRawFaqsList(response)
    } catch (error) {
      setLoading(false);
      showMessage({
        message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
        description: error.message,
        type: t(AUTH_KEYS.LOCATE_US.TYPE_ERROR),
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation]
  );

  const setSecurityQuestion = useCallback(async () => {
    try {

      let sendData = (faqsList.filter(v => v?.answer?.length > 0))

      let request = {
        securityQuestions: sendData,
        "profileId": profileData.profileId
        // "question1": sendData[0].question,
        // "answer1": sendData[0].answer,
        // "question2": sendData[1].question,
        // "answer2": sendData[1].answer,
        // "question3": sendData[2].question,
        // "answer3": sendData[2].answer,
        // "profileId": profileData.profileId
      }
      setLoading(true);
      const response = await Auth.setSecurityQuestionApi(request);
      setLoading(false);
      showMessage({
        message: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SECURITY_QUESTIONS),
        description: response.message,
        type: 'success',
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
      navigation.goBack()
    } catch (error) {
      setLoading(false);
      showMessage({
        message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
        description: error.message || error.error,
        type: 'danger',
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation, faqsList]
  );

  const renderHeader = () => {
    return (


      <LinearGradient
        useAngle={true}
        angle={45}
        angleCenter={{ x: 0.5, y: 0.5 }}
        colors={["#4370e7", "#479ae8", "#4ad4e8"]}>
        <View style={{
          flexDirection: 'row',
          alignContent: 'center',
          padding: 10,

          alignItems: 'center'
        }}>
          <TouchableOpacity
            onPress={() => { navigation.goBack() }}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={{
            color: '#FFFF',
            fontSize: fontSize.header3,
            marginLeft: 10,
            fontFamily: fontName.medium,

          }}>{t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SECURITY_QUESTIONS)}</Text>
        </View>
      </LinearGradient>
    )
  }


  const renderFaqs = () => {

    return (
      <FlatList
        data={faqsList}
        extraData={faqsList}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{ paddingTop: 20 }}
              onPress={() => {
                const dummyData = faqsList;
                let arr = dummyData.map((items, ind) => {
                  if (ind == index) {
                    items.isSelected = !items.isSelected;
                  }
                  if (items?.answer?.length > 0) {

                  } else {
                    items.answer = ""
                  }

                  return { ...items }
                })
                setFaqsList(arr)
              }}
            >

              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 20, }}>
                <Text style={{ ...FONTS.h2, color: theme.colors.textColor, textAlign: 'left', paddingVertical: 10, width: '95%', lineHeight: Platform.OS === 'android' ? 30 : 25, fontFamily: fontName.regular }}>{item.question}</Text>
                <View >
                  {item?.answer?.length >= 1 &&
                     <TickIcon style={{marginLeft:500}} color={theme.colors.buttonStrokeStartColor} />
                  }
                </View>
              </View>


              {(item.isSelected || item?.answer?.length>0) &&

                <StyleInputView
                  placeholder={""}
                  value={item.answer}
                  returnKeyType='done'
                  maxLength={13}
                  inputViewStyle={{ ...FONTS.h1, color: theme.colors.grey, fontFamily: fontName.regular }}
                  containerStyle={{ flex: 1, marginLeft: 20, marginTop: -20 }}
                  onChangeText={(text) => {

                    let arr = faqsList.map((items, ind) => {
                      if (ind == index) {
                        items.answer = getAlphabetsAndNumbersSpaceOnly(text);
                      }
                      return { ...items }
                    })
                    setFaqsList(arr)
                  }}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                // <Text style={{ ...FONTS.body4, color: theme.colors.grey, padding: 10, marginHorizontal: 20, lineHeight: 20 }}>{item.answer}</Text>
              }


              <View style={{ height: 0.5, backgroundColor: theme.colors.grey, opacity: 0.3, marginTop: 20 }} />

            </TouchableOpacity>)
        }}
        ListEmptyComponent={() => {
          return (<View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 30 }}>
            <Text style={{ ...FONTS.h2, color: '#121212', textAlign: 'center' }}>{t(AUTH_KEYS.FAQS.RESULT_NOT_FOUND)}</Text>

          </View>)
        }}
      />)
  }
  return (
    <View
      style={{ flex: 1, backgroundColor: theme.colors.white }}
    >

      <AuthHeader
        title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SECURITY_QUESTIONS_AND_ANSWERS)}
        navigation={navigation} />
      <Text style={{ ...FONTS.h3, color: theme.colors.textColor, textAlign: 'left', marginLeft: 60, marginTop: 20, width: '95%', lineHeight: 20 }}>{t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PLEASE_ANSWER_ATLEAST_THREE_ANSWERS)}</Text>
      <Text style={{ ...FONTS.body3, color: theme.colors.grey, textAlign: 'left', marginLeft: 20, marginTop: 10, marginBottom: 20, width: '95%', lineHeight: 20 }}>{t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SECURITY_QUESTIONS_DESCRIPTION)}</Text>

      {/* {renderHeader()} */}
      <View style={{ height: '65%' }}>
        <KeyboardAwareScrollView>
        {renderFaqs()}
        </KeyboardAwareScrollView>
      </View>

      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <MainButton
          noBorder
          btnContainerStyle={{ width: '100%' }}
          disabled={faqsList.filter(v => v?.answer?.length >= 1).length < 3}
          title={t(AUTH_KEYS.PAY_PEOPLE.SAVE)}
          onPress={() => {

            setSecurityQuestion()
          }}
        />
      </View>
      {isLoading && <LoaderComponent />}
    </View>
  );
}

