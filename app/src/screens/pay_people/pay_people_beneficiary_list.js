import React, { useEffect, useContext, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  PermissionsAndroid,
  TouchableOpacity,
  Animated,
  Image,
  Platform

} from "react-native";
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import { BackIcon } from '../../../assets/svg';
import PayeesListItem from './PayeesListItem';
import ContactListItem from './contact_list';
import FavioritListItem from './FovioritListItem';
import i18n from '../../../../i18n';
import { getAccountDetailsSelector, profileSelector } from '../../store/selectors';
import { settingMenu } from '../../../assets/icons';
import { useSelector } from "react-redux";
import { PAY_PEOPLE, SETTINGS } from "../../routes";
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { LoaderComponent } from "../../components";
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import Contacts from 'react-native-contacts';
import { showMessage } from "react-native-flash-message";
import Home from '../../api/dashboard';
const screens = {
  faviorit: i18n.t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_FAVORITE),
  contact: i18n.t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_CONTACT),
  payees: i18n.t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_PAYEE)
}
const tabs_list = [
  {
    id: 0,
    label: screens.faviorit,
    value: "FAVIORIT"
  },
  {
    id: 1,
    label: screens.contact,
    value: "CONTACT"
  },
  {
    id: 2,
    label: screens.payees,
    value: "PAYEES"
  }
].map((tabs_list) => ({
  ...tabs_list,
  ref: React.createRef()
}))
export default function PayPeopleMenu({ navigation, route }) {
  const { params } = route;
  const [isLoading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);
  const [favList, setFavList] = useState([]);
  const [filterListPayeeFav, setfilterListPayeeFav] = useState([])
  const accDetailsData = useSelector(getAccountDetailsSelector);
  const selectedProfileDetails = useSelector(profileSelector);
  const [payeesList, setPayeesList] = useState([]);
  const [filterPayeeList, setfilterPayeeList] = useState([])
  const [contactsList, setContactsList] = useState([]);
  const [contactsListFav, setContactsListFav] = useState([]);
  const [contactsFilter, setContactsFilter] = useState([]);
  const [contactsFilterFavourit, setContactsFilterFavourit] = useState([]);
  const [accessToContact, setAccessToContact] = useState(false);
  const [accountsFilterFavourit, setAccountsFilterFavourit] = useState([])
  const [accountsListFav, setAccountsListFav] = useState([]);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const TabIndicator = ({ measureLayout, scrollX }) => {
    const inputRange = tabs_list.map((_, i) => i * SIZES.width)
    const tabIndicatorWidth = scrollX.interpolate({
      inputRange,
      outputRange: measureLayout.map(measure => measure.width)
    })
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: measureLayout.map(measure => measure.x)
    })

    return (<Animated.View
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: '10%',
        width: tabIndicatorWidth,
        backgroundColor: '#00ffce',
        transform: [{ translateX }]
      }}
    />)
  }
  const Tabs = ({ scrollX, onBottomTabPress }) => {
    const containerRef = React.useRef();
    const [measureLayout, setMeasureLayout] = React.useState([])

    React.useEffect(() => {
      let ml = []
      tabs_list.forEach(bottom_tab => {
        bottom_tab?.ref?.current?.measureLayout(containerRef.current, (x, y, width, height) => {
          ml.push({ x, y, width, height })
          if (ml.length === tabs_list.length) {
            setMeasureLayout(ml)
          }
        })
      })

    }, [containerRef.current, currentIndex])

    return (<View
      ref={containerRef}
      style={{
        flex: 1,
        flexDirection: 'row'
      }}>
      {/* Tab Indicator */}
      {measureLayout.length > 0 &&
        <TabIndicator
          measureLayout={measureLayout}
          scrollX={scrollX}
        />
      }

      {/* Tabs */}
      {tabs_list.map((item, index) => {
        return (
          <TouchableOpacity
            key={`Tab-${index}`}
            ref={item.ref}
            style={{ flex: 1, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => onBottomTabPress(index)}
          >
            <Text style={{ color: currentIndex === index ? '#00ffce' : "#FFF", ...FONTS.body3, fontFamily: fontName.medium }}>
              {`${item.label}`}
            </Text>
          </TouchableOpacity>)
      })

      }
    </View>)
  }
  const top_tabs = [
    {
      id: 0,
      label: screens.faviorit,
    },
    {
      id: 1,
      label: screens.contact,
    },
    {
      id: 2,
      label: screens.payees,
    }
  ]
  const { t, i18n } = useTranslation();
  const { theme, changeTheme } = useContext(AppContext);
  const flatListRef = useRef(null);
  const scrollX = React.useRef(new Animated.Value(0)).current
  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewChangeRef = useRef(({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index)
      switch (viewableItems[0].index) {
        case 0:
          {
            getAllFavouriteList();
            break;
          }

        case 1: {
          loadContacts();
          break
        }

        case 2: {
          getPayeeList();
          break;
        }


      }
    }
  })
  const onBottomTabPress = React.useCallback(bottomTabIndex => {
    flatListRef?.current?.scrollToOffset({
      offset: bottomTabIndex * SIZES.width
    })
  })
  useEffect(async () => {
    navigation.addListener('willFocus', () => {
    });
  }, [navigation])
  const loadContacts = async () => {
    if (Platform.OS === 'android') {
      if (
        (await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        )) === 'granted'
      ) {
        setAccessToContact(true)
        Contacts.getAll()
          .then(cont => {
            let arr = [];
            cont.map(v => v.phoneNumbers.map(p => {
              arr.push((p.number).replace(/[^A-Z0-9]/ig, ""))
            }))
            getContactList(arr)
            setAccessToContact(true);
          })
          .catch(function (error) {
            throw error
          })
      } else {
        setAccessToContact(false)
      }
    } else {
      Contacts.getAll()
        .then(cont => {
          let arr = [];
          cont.map(v => v.phoneNumbers.map(p => {
            arr.push((p.number).replace(/[^A-Z0-9]/ig, ""))
          }))
          getContactList(arr)
          setAccessToContact(true);
        })
        .catch(function (error) {
          // ADD THIS THROW error
          throw error
        })
    }
  };
  const getContactList = useCallback(async (arr) => {

    try {
      let request = {
        contacts: arr,
        // "profileId": selectedProfileDetails.profileId,
        "page": 0,
        "size": 10,

      };
      setLoading(true);
      const response = await Home.getContactListApi(request);
      setLoading(false);
      setContactsList(response.payeeContactAccountDetails);
      setContactsFilter(response.payeeContactAccountDetails);
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Contacts",
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation, contactsList, contactsFilter]
  );

  const getPayeeList = useCallback(async () => {

    try {
      let request = {

        "profileId": selectedProfileDetails.profileId,
        "page": 0,
        "size": 10,
      };
      setLoading(true);
      const response = await Home.getPayeeListApi(request);
      console.log('responsyyyy', response)
      setLoading(false);
      setfilterPayeeList(response.payeeList);
      setPayeesList(response.payeeList);
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Payee List",
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation, payeesList, filterPayeeList, favList]
  );
  const getAllFavouriteList = useCallback(async () => {

    try {
      let request = {

        "profileId": selectedProfileDetails.profileId,
      };
      setLoading(true);
      const response = await Home.getFavouritListApi(request);
      setFavList(response.payeeList)
      setfilterListPayeeFav(response.payeeList)
      setContactsFilterFavourit(response.contactList)
      setContactsListFav(response.contactList)
      setAccountsFilterFavourit(response.accountList)
      setAccountsListFav(response.accountList)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showMessage({
        message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation, favList, filterListPayeeFav, contactsFilterFavourit, contactsListFav, accountsFilterFavourit, accountsListFav]
  );
  const renderContent = () => {
    return (<View style={{ flex: 1, marginTop: 10 }} >
      <Animated.FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        snapToAlignment={'center'}
        // scrollEnabled={false}
        snapToInterval={SIZES.width}
        initialScrollIndex={2}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        }}
        decelerationRate='fast'
        scrollEventThrottle={16}
        disableIntervalMomentum={true}
        viewabilityConfig={viewConfigRef.current}
        showsHorizontalScrollIndicator={false}
        data={top_tabs}
        onViewableItemsChanged={onViewChangeRef.current}
        keyExtractor={item => `Main-${item.id}`}
        onScroll={
          Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })
        }
        renderItem={({ item, index }) => {
          return (<View style={{ height: SIZES.height, width: SIZES.width }}>
            {item.label == screens.payees &&
              <PayeesListItem
                navigation={navigation}
                route={route}
                payeesList={payeesList}
                setPayeesList={setPayeesList}
                filterPayeeList={filterPayeeList}
                setfilterPayeeList={setfilterPayeeList}
                setLoading={setLoading} />}
            {item.label == screens.contact &&
              <ContactListItem navigation={navigation} route={route}
                contactsList={contactsList}
                setContactsList={setContactsList}
                setLoading={setLoading}
                accessToContact={accessToContact}
                setAccessToContact={setAccessToContact}
                contactsFilter={contactsFilter}
                setContactsFilter={setContactsFilter}
              />}
            {item.label == screens.faviorit &&
              <FavioritListItem navigation={navigation}
                route={route}
                setLoading={setLoading}
                setContactsFilterFavourit={setContactsFilterFavourit}
                setAccountsFilterFavourit={setAccountsFilterFavourit}
                contactsFilterFavourit={contactsFilterFavourit}
                contactsListFav={contactsListFav}
                setContactsListFav={setContactsListFav}
                favList={favList}
                setFavList={setFavList}
                filterListPayeeFav={filterListPayeeFav}
                setfilterListPayeeFav={setfilterListPayeeFav}
                accountsFilterFavourit={accountsFilterFavourit}
                // accountsListFav={accountsListFav.map((item) => item.accMappingKey)}
                accountsListFav={accountsListFav}
                setAccountsListFav={setAccountsListFav}
                onAddFav={() => {
                  getAllFavouriteList()
                }}


              />}
          </View>)
        }}
      />

    </View>)
  }
  const renderTab = () => {
    return (
      <View style={{ height: 50, width: SIZES.width }}>
        <Tabs scrollX={scrollX}
          onBottomTabPress={onBottomTabPress}
        />
      </View>
    )

  }
  const renderHeader = () => {
    return (<LinearGradient
      useAngle={true}
      angle={45}
      angleCenter={{ x: 0.5, y: 0.5 }}
      colors={["#4370e7", "#479ae8", "#4ad4e8"]}>
      <View style={{
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => { navigation.goBack() }}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={FONTS.headerText}>{t(AUTH_KEYS.PAY_PEOPLE.PAYEE_PEOPLE)}</Text>

        </View>


        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate(PAY_PEOPLE.PAYEE_HISTORY);
            }}>
            <Text style={{
              ...FONTS.h3,
              color: '#00ffce',
              padding: 20
            }}>{t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_HISTORY)}</Text>

          </TouchableOpacity>
          <Menu
            visible={visible}
            style={{ width: 200, alignSelf: 'flex-end' }}
            anchor={<TouchableOpacity
              onPress={showMenu}
            >
              <Image
                style={{ width: 18, height: 20, tintColor: colors.textColorWhite, marginRight: 5 }}
                source={settingMenu}
              />
            </TouchableOpacity>}
            onRequestClose={hideMenu}
          >
            <MenuItem
              textStyle={{ fontFamily: fontName.regular, color: theme.colors.headingSubTextColor }}

              onPress={hideMenu}>{t(AUTH_KEYS.MAIN_SCREEN.DETAILED_STATEMENT)}</MenuItem>
            <MenuItem
              textStyle={{ fontFamily: fontName.regular, color: theme.colors.headingSubTextColor }}
              onPress={hideMenu}>{t(AUTH_KEYS.PAY_PEOPLE.SPEND_ANALYSER)}</MenuItem>
            <MenuItem
              textStyle={{ fontFamily: fontName.regular, color: theme.colors.headingSubTextColor }}
              onPress={() => {
                hideMenu()
                navigation.navigate(SETTINGS.TRANSACTION_LIMIT)
              }}>{t(AUTH_KEYS.PAY_PEOPLE.TRANSACTION_LIMIT)}</MenuItem>
          </Menu>
        </View>

      </View>
      {renderTab()}
    </LinearGradient>)
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.mainBackground1, }}>
      {/* Header */}
      {renderHeader()}
      {/* Render Tabs */}

      {/* Reneder Content */}
      {renderContent()}

      {isLoading && <LoaderComponent />}
    </View>
  );
}
