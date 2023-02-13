import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform
} from "react-native";
import { FONTS, SIZES, fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import MainButton from "../../components/button/MainButton";
import { BackIcon, SearchIcon, SelectDownArrowIcon, SelectUpArrowIcon } from '../../../assets/svg'
import { TextInput } from "react-native-paper";
import {
  downArrow,
  upArrow
} from '../../../assets/icons'
import Auth from "../../api/auth";
import { showMessage, hideMessage } from "react-native-flash-message";
import AuthBody from "../../components/base/AuthBody";
import { CALL_US, } from '../../routes';
import { LoaderComponent } from "../../components";
import { useSelector } from "react-redux";
import { metaDataSelector } from "../../store/selectors";
import { getAlphabetsAndNumbersSpaceOnly } from "../../utils/amount-util";
import { Keyboard } from "react-native";
export default function FaqsScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const { theme, changeTheme } = useContext(AppContext);
  const { height } = Dimensions.get('window');
  const [isLoading, setLoading] = useState(false);

  const callUsData = useSelector(metaDataSelector)

  const [rawFaqsList, setRawFaqsList] = useState([])

  const [faqsList, setFaqsList] = useState(rawFaqsList)

  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    getFaqData()
  }, []);

  const getFaqData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Auth.getFaqDataApi();
      setLoading(false);
      setFaqsList(response.faqList)
      setRawFaqsList(response.faqList)
    } catch (error) {
      setLoading(false);
      showMessage({
        message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
        description: error.message || error.error,
        type: t(AUTH_KEYS.LOCATE_US.TYPE_ERROR),
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation]
  );

  const renderHeader = () => {
    return (


      <LinearGradient
        useAngle={true}
        angle={135}
        angleCenter={{ x: 0.5, y: 0.5 }}
        colors={["#4370e7", "#4370e7", "#4ad4e8"]}>
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
          <Text style={FONTS.headerText}>{t(AUTH_KEYS.FAQS.TITLE)}</Text>
        </View>
        <View style={{
          marginBottom: 20,
          marginHorizontal: 20,
          marginTop: 20,
          borderColor: theme.colors.white,
          borderBottomWidth: 0.5,
          flexDirection: 'row',
          alignItems: 'center'
          //opacity: 0.6
        }}>
          <View style={{ justifyContent: 'center' }}>
            <SearchIcon color={theme.colors.white} />
          </View>
          <TextInput
            underlineColorAndroid="transparent"
            underlineColor="transparent"
            selectionColor={theme.colors.white}
            // ref={input => { this.textInput = input }}
            style={{
              flex: 1, color: theme.colors.white, backgroundColor: "transparent", height: 40, ...FONTS.body4
            }}
            textColor={theme.colors.white}
            placeholder={t(AUTH_KEYS.FAQS.SEARCH)}
            placeholderTextColor={theme.colors.white}
            theme={{
              colors: { primary: "transparent", text: theme.colors.white },
              textInput: {
                fontSize: fontSize.textNormal,
                color: theme.colors.white,
                backgroundColor: "transparent",
              }
            }}
            value={searchText}
            keyboardType='default'
            onChangeText={(searchText) => {
              setSearchText(getAlphabetsAndNumbersSpaceOnly(searchText))
              const transformedSearchQuery = searchText.toLowerCase()

              let filteredData = rawFaqsList.filter(function (item) {

                const transformedItemQuestion = item.question.toLowerCase()
                const transformedItemAnswer = item.answer.toLowerCase()

                return transformedItemQuestion.includes(transformedSearchQuery) || transformedItemAnswer.includes(transformedSearchQuery);
              });

              setFaqsList(filteredData);
            }}
          />
          {searchText != null && searchText.length > 0 &&
            <TouchableOpacity
              style={{ marginHorizontal: 5 }}
              onPress={() => {
                //this.textInput.clear()
                setSearchText("")
                setFaqsList(rawFaqsList);
                Keyboard.dismiss()
              }}
            >
              <Text style={{
                color: '#FFFF',
                fontSize: fontSize.textNormal,
                fontFamily: fontName.light,
              }}>{"X"}</Text>
            </TouchableOpacity>
          }
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
          return (<TouchableOpacity
            onPress={() => {
              const dummyData = faqsList;
              let arr = dummyData.map((items, ind) => {
                if (ind == index) {
                  items.isSelected = !items.isSelected;
                }
                return { ...items }
              })
              setFaqsList(arr)
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 10, paddingRight: 10, marginTop: 15 }}>
              <Text style={{ ...FONTS.h3, color: theme.colors.textColor, textAlign: 'left', padding: 10, width: '95%', lineHeight: Platform.OS==='android'?23:20, fontFamily: fontName.medium }}>{item.question}</Text>
              {/* <Image
                source={item.isSelected ? upArrow : downArrow}
                style={{ width: 15, height: 15, tintColor: '#588bf8', alignSelf: 'center', }}

              /> */}

                {item.isSelected ? <SelectUpArrowIcon color={theme.colors.buttonColor} /> : <SelectDownArrowIcon color={theme.colors.buttonColor} />}
            </View>

            {item.isSelected &&
              <Text style={{ ...FONTS.body4, color: theme.colors.grey,  marginHorizontal: 20, lineHeight: 20,marginBottom:15 }}>{item.answer}</Text>
            }

            <View style={{ height: 1, marginTop: 5, backgroundColor: theme.colors.grey,opacity:0.1 }} />

          </TouchableOpacity>)
        }}
        ListEmptyComponent={() => {
          return (<View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 30 }}>
            <Text style={{ ...FONTS.h2, color: theme.colors.textColor, textAlign: 'center' }}>{t(AUTH_KEYS.FAQS.RESULT_NOT_FOUND)}</Text>
            <Text style={{ ...FONTS.body3, color: theme.colors.textColor, textAlign: 'center', marginHorizontal: 40 ,marginVertical:20,lineHeight:20}}>{t(AUTH_KEYS.FAQS.HELP_MSG)}</Text>
            <MainButton title={t(AUTH_KEYS.FAQS.CALL_US)}  onPress={() => {
              navigation.navigate(CALL_US, { callUsData: callUsData })
            }} />
          </View>)
        }}
      />)
  }
  return (
    // <AuthBody
    //   title={""}
    //   hideHeader={true}
    //   isLoading={isLoading}
    //   navigation={navigation}>

    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bgColor
      }}>

      {renderHeader()}
      <View style={{ marginTop: 20 }}>

      </View>
      {renderFaqs()}

      {isLoading && <LoaderComponent />}
    </SafeAreaView>
    // </AuthBody>
  );
}

