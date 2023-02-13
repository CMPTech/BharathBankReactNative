import React, { useEffect, useContext, useState, useRef } from "react";
import {
  View,
  Animated,
  Text,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  ImageBackground
} from "react-native";
import { fontName, fontSize, FONTS, SIZES } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import {
  EyeHideIcon,
  EyeOpenIcon,
  SearchIcon,
  LogouteIcon,
  HelpIcon,
  NotificationIcon
} from "../../../assets/svg";
import {
  bill,
  debitCard,
  deposit,
  more,
  passbook,
  taxes
} from '../../../assets/icons'
import {
  card1,
  card2,
  card3,
  card4,
} from '../../../assets/images'
const imageBg = [card1,
  card2,
  card3,
  card4,];
export default function AccountsScreen({ navigation, route }) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { height } = Dimensions.get('window');
  const UNFOCUSED_HEIGHT = (height * 57) / 100;
  const FOCUSED_HEIGHT = (height * 87) / 100;
  const { theme, changeTheme } = useContext(AppContext);
  const [viewBalance, setViewBalance] = useState(false)
  const [accountList, setAccountList] = useState([{ accountNumber: '1008971019230', balance: '1234.68', accountName: 'Sagar J Kakanoor' }, { accountNumber: '100867192334', balance: '15674.68', accountName: 'Sathish kumar C' }, { accountNumber: '100098765443', balance: '128834.68', accountName: 'Rakesh M B' }, { accountNumber: '12000123444455', balance: '34.68', accountName: 'Shashank Roy' }, { accountNumber: '200112344445555', balance: '671234.68', accountName: 'Meena A' },]);
  const flatListRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewChangeRef = useRef(({ viewableItems, changed }) => {
    if (changed && changed.length > 0) {
      setCurrentIndex(changed.index)
    }

  })
  const Dots = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width)
    return (<View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      justifyContent: 'center'
    }}>
      {accountList.map((item, index) => {
        const dotColor = dotPosition.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: ['#AEDDFF', "#FFFFFF", "#AEDDFF"],
          extrapolate: 'clamp'
        })

        const dotWidth = dotPosition.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [10, 40, 10],
          extrapolate: 'clamp'
        })
        return (
          <Animated.View
            key={`dot-${index}`}
            style={{
              borderRadius: 5,
              marginHorizontal: 6,
              width: dotWidth,
              height: 10,
              backgroundColor: dotColor
            }}
          />
        )
      })

      }
    </View>)
  }
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const renderItem = ({ item, index }) => {

    return (<ImageBackground
      source={imageBg[index] || imageBg[(index / 4 - 1)]}
      style={{ width: SIZES.width * 0.9, marginHorizontal: 12, }}
      imageStyle={{ borderRadius: SIZES.radius }}
    >
      <View style={{ width: SIZES.width * 0.9, height: SIZES.height / 4, borderRadius: 10 }}>
        <View style={{ width: SIZES.width * 0.9, height: '70%', }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', paddingTop: 5, alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: 30 }}
            onPress={() => {

              setViewBalance(!viewBalance)
            }}
          >
            {/* <Text style={{ paddingHorizontal: 10, color: '#FFFFFF', ...FONTS.body5, width: '90%' }}>{"Balance"}</Text> */}
            {viewBalance ? <EyeOpenIcon /> : <EyeHideIcon />}
          </TouchableOpacity>
          <Text style={{ color: '#FFFFFF', ...FONTS.h2, alignSelf: 'center', textAlign: 'center' }}>{viewBalance ? "₹ " + "XXXXXX" : "₹ " + item.balance}</Text>
          <Text style={{ color: '#FFFFFF', ...FONTS.body5, textAlign: 'center' }}>{`${'as on '} ${new Date().toLocaleString()}`}</Text>
          <Text style={{ color: '#FFFFFF', ...FONTS.h5, textAlign: 'center' }}>{`${item.accountNumber}`}</Text>
          <Text style={{ color: '#FFFFFF', ...FONTS.body5, textAlign: 'center' }}>{`${"Customer Nickname"} - ${item.accountName}`}</Text>
        </View>
        <View style={{ height: '30%', flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 5, }}>
          <Text style={{ marginTop: 5, paddingHorizontal: 10, color: '#FFFFFF', ...FONTS.h4, width: '30%' }}>{"Statement"}</Text>
          <Text style={{ marginTop: 5, paddingHorizontal: 10, color: '#FFFFFF', ...FONTS.h4, width: '30%' }}>{"Cheques"}</Text>
          <Text style={{ marginTop: 5, paddingHorizontal: 10, color: '#FFFFFF', ...FONTS.h4, width: '30%' }}>{"More"}</Text>
        </View>
      </View></ImageBackground>)
  }
  const headerComponent = () => {
    return (<View style={{ position: 'absolute', top: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
      <View style={{ width: '55%', marginLeft: 40, marginRight: 0, flexDirection: 'row', borderBottomWidth: 0.6, }}>
        <TouchableOpacity style={{ padding: 15 }}>
          <SearchIcon />
        </TouchableOpacity>
        <TextInput
          placeholder="Search for e.g Open FD"
          placeholderTextColor="#000000"
        />

      </View>
      <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <TouchableOpacity style={{ padding: 15 }}>
          <NotificationIcon />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 15 }}>
          <HelpIcon />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 15 }}>
          <LogouteIcon />
        </TouchableOpacity>
      </View>
    </View>)
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: isKeyboardVisible ? FOCUSED_HEIGHT : UNFOCUSED_HEIGHT
      }}>
      {/* <Animated.ScrollView style={{
        flex: 1,
      }}> */}
      <LinearGradient
        colors={['rgba(92, 187, 255, 0)', '#5CBBFF']}
        style={{ width: '100%', height: 300 }}
        useAngle={true}
        angle={175}>
        {headerComponent()}
        <View style={{ height: 200, marginTop: 80 }}>
          <Animated.FlatList
            ref={flatListRef}
            data={accountList}
            extraData={accountList}
            pagingEnabled
            style={{ marginTop: 10 }}
            scrollEventThrottle={16}
            horizontal
            snapToAlignment='center'
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: { x: scrollX }
                }
              }
            ], {
              useNativeDriver: false
            })}
            onViewableItemsChanged={onViewChangeRef.current}
            renderItem={renderItem}
          />
          <Dots />
        </View>
      </LinearGradient>
      {/* </Animated.ScrollView> */}
    </SafeAreaView>

  );
}


