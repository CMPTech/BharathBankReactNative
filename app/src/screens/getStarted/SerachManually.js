import React, { useEffect, useContext, useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  PermissionsAndroid
} from "react-native";
import { FONTS, SIZES, fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import MainButton from "../../components/button/MainButton";
import { BackIcon, CloseIcon, SearchIcon } from '../../../assets/svg'
// import { TextInput } from "react-native-paper";
import {
  detectLocation,
  rightArrow,
} from '../../../assets/icons';
import Geolocation from 'react-native-geolocation-service';
import GetStarted from '../../api/getStarted';
import { LOCATION } from '../../routes';
import { UIActivityIndicator } from "react-native-indicators";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSelector, useDispatch } from 'react-redux';
import { setAppSearchLocation } from '../../store/actions/app.action';
import { locationSelector } from '../../store/selectors/app.selector';
import { showMessage, hideMessage } from "react-native-flash-message";
import { LoaderComponent } from "../../components";
export default function SearchManuallyScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setLoading] = useState(false)
  const [isInput, setIsInput] = useState(false)
  const { theme, changeTheme } = useContext(AppContext);
  const dispatch = useDispatch();
  const searchList = useSelector(locationSelector)
  const renderHeader = () => {
    return (<LinearGradient
      useAngle={true}
      angle={135}
      style={{ paddingTop: 10 }}
      angleCenter={{ x: 0.5, y: 0.5 }}
      colors={["#4173ea", "#4173ea", "#4173ea", "#4ad4e8"]}>
      <View style={{
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          onPress={() => { navigation.goBack() }}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={FONTS.headerText} >{t(AUTH_KEYS.LOCATE_US.SELECT_LOCATION_TITILE)}</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        borderBottomColor: theme.colors.white,
        borderBottomWidth: 0.5,
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20
      }}>
        <View>
          <SearchIcon color="#FFFF" />
        </View>
        {/* <TextInput
          underlineColorAndroid="transparent"

          underlineColor="transparent"
          style={{ flex: 1, backgroundColor: "transparent", borderBottomWidth: 0, color: '#FFFF', ...FONTS.body4, color: "#ffffff", }}
          placeholder="Start typing a location "
          placeholderTextColor={'#fff1f1f1'}
          theme={{ colors: { primary: "transparent" } }}
          keyboardType='default'
        /> */}
        <GooglePlacesAutocomplete
          placeholder={t(AUTH_KEYS.LOCATE_US.START_TYPING)}
          ref={(instance) => { GooglePlacesAutocomplete.GooglePlacesRef = instance }}
          renderRightButton={isInput ? () =>
            <TouchableOpacity
              // this.GooglePlacesRef.clearInput()
              onPress={() => {
                GooglePlacesAutocomplete.GooglePlacesRef.setAddressText("")
                setIsInput(false)
              }
              }
            >
              <Text style={{ ...FONTS.h3, textAlign: 'center', marginTop: 15, marginRight: 5, color: theme.colors.white }}>X</Text>
            </TouchableOpacity> : null
          }
          onPress={(data, details = null) => {
            getLocation(data)
          }}
          query={{
            key: 'AIzaSyAu8_VDjnMGhi1MyPpGguTCLGiJw2mQYfg',
            language: 'en',
          }}
          textInputProps={{
            placeholderTextColor: theme.colors.white,
            returnKeyType: "search",
            selectionColor: theme.colors.white,
            onChangeText: (text) => { text !== '' ? setIsInput(true) : setIsInput(false) }
          }}
          styles={{
            textInputContainer: {
              backgroundColor: "transparent",
              borderBottomColor: theme.colors.white,
              borderColor: theme.colors.white,
              height: 40,
            },
            description: {
              color: theme.colors.white,
            },
            listView: {
            },
            row: {
              backgroundColor: "transparent",
              color: theme.colors.white,
            },
            textInput: {
              fontSize: fontSize.textNormal,
              color: theme.colors.white,
              backgroundColor: "transparent",
            },
            predefinedPlacesDescription: {
              color: theme.colors.white,
            },
          }}
          enablePoweredByContainer={false}
        />

        {/* <TouchableOpacity
          style={{ marginTop: 20, marginHorizontal: 5 }}
          onPress={()=>{

          }}
        >
          <Text style={{
            color: '#FFFF',
            fontSize: fontSize.header3,
            fontFamily: fontName.bold,
          }}>{"X"}</Text>
        </TouchableOpacity> */}
      </View>
      <TouchableOpacity
        style={{ marginHorizontal: 20, paddingVertical: 25, flexDirection: 'row', alignItems: 'center' }}
        onPress={getMyLoaction}
      >
        <Image
          style={{ width: 15, height: 15, tintColor: '#00ffce', alignSelf: 'center' }}
          source={detectLocation}
        />
        <Text style={{
          color: '#00ffce',
          ...FONTS.body3,
          marginLeft: 15,
          textAlign: 'center'

        }}>{t(AUTH_KEYS.LOCATE_US.DEDECT_LOCATION)}</Text>
      </TouchableOpacity>
    </LinearGradient>)
  }
  const renderSearch = () => {
    return (<FlatList
      data={searchList}
      extraData={searchList}
      keyExtractor={(item, index) => `${index}`}
      renderItem={({ item, index }) => {
        return (<TouchableOpacity
          onPress={() => {
            callLocationAPI(item)
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 5, }}>
            <Text style={{ ...FONTS.body4, color: '#6c6c6c', textAlign: 'left', padding: 10, width: '95%' }}>{item.locationName}</Text>
            <Image
              source={rightArrow}
              style={{ width: 10, height: 15, tintColor: '#588bf8', alignSelf: 'center', }}

            />
          </View>
          <View style={{ height: 1, marginTop: 5, backgroundColor: '#F3F4F6' }} />

        </TouchableOpacity>)
      }}
    />)
  }
  const callLocationAPI = useCallback(async ({ location }) => {
    setLoading(true)
    try {
      let request =
      {
        "userLatitude": location.lat,
        "userLongitude": location.lng
      }
      const response = await GetStarted.getNearByLoactionApi(request)
      navigation.navigate(LOCATION.ATM_BRANCH_LOCKER, { atmList: response })
    }
    catch (error) {
      showMessage({
        message: "Error message",
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });

    }
    finally {
      setLoading(false)
    }

  }, [searchList])
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
          const response = await GetStarted.getNearByLoactionApi(request)
          navigation.navigate(LOCATION.ATM_BRANCH_LOCKER, { atmList: response })

        }
        catch (error) {
          setLoading(false)
          showMessage({
            message: "Error message",
            description: error.message || error.error,
            type: "danger",
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
          message: "Error message",
          description: 'Location permission denied',
          type: "danger",
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
          message: "Error message",
          description: 'Location permission denied',
          type: "danger",
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

            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          showMessage({
            message: "Error message",
            description: 'Location permission denied',
            type: "danger",
            hideStatusBar: true,
            backgroundColor: "black", // background color
            color: "white", // text color
          });
        }
      } catch (err) {
        showMessage({
          message: "Error message",
          description: 'Location permission denied',
          type: "danger",
          hideStatusBar: true,
          backgroundColor: "black", // background color
          color: "white", // text color
        });
      }
    }

  }
  const getLocation = useCallback(
    async (data) => {
      setLoading(true)
      try {
        setLoading(true)
        const request = data.place_id + '&key=AIzaSyAu8_VDjnMGhi1MyPpGguTCLGiJw2mQYfg'
        const response = await GetStarted.googleMapApi(request)
        let arr = [];
        arr.push({ locationName: response.result.name, location: response.result.geometry.location })
        if(searchList.length>=5)
        {
          searchList.shift()
        }
        dispatch(setAppSearchLocation([ ...arr,...searchList]))
        let requestBody = {
          "userLatitude": response.result.geometry.location.lat,
          "userLongitude": response.result.geometry.location.lng,
        }
        const location = await GetStarted.getNearByLoactionApi(requestBody);
        navigation.navigate(LOCATION.ATM_BRANCH_LOCKER, { atmList: location })
      }
      catch (error) {
        setLoading(false)
      }
      finally {
        setLoading(false)
      }

    },
    [searchList]
  )
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bgColor
      }}>


      {renderHeader()}
      <Text style={{ ...FONTS.h3, margin: 15, color: theme.colors.textColor }}>{t(AUTH_KEYS.LOCATE_US.RECENTLY_SEARCHED_LOCATION)}</Text>
      {renderSearch()}

      {/* {isLoading && (
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
      )} */}

      {isLoading && <LoaderComponent />}
    </SafeAreaView>
  );
}

