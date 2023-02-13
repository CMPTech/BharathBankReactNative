import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Linking,
  PermissionsAndroid,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors, fontName, FONTS, fontSize, SIZES } from "../../../styles/global.config";
import { LOCATION, PAY_PEOPLE } from "../../routes";
import { useTranslation } from 'react-i18next';
import { setRefreshAccdata } from '../../store/actions/user.action';
import Contacts from 'react-native-contacts';
import { AlerComponent, MainButton, SearchComponent } from '../../components'
import { useSelector , useDispatch, } from 'react-redux';
import { getAccountDetailsSelector, profileSelector, mobileNumberSelector } from '../../store/selectors';
import { showMessage } from "react-native-flash-message";
import Home from '../../api/dashboard';
import { AppContext } from '../../../themes/AppContextProvider';
import { StarUnselectedIcon } from '../../../assets/svg';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import Startselected_icon from '../../../assets/svg/startselected_icon';
import { getAlphabetsAndNumbersSpaceOnly } from '../../utils/amount-util';
import Accounts from './../../api/accounts';
const ContactListItem = ({ navigation, setLoading, contactsList, setContactsList, accessToContact, setAccessToContact, setContactsFilter, contactsFilter, }) => {
  const { theme, changeTheme } = useContext(AppContext)
  const accountTypes = ["CA", "SB", "OD"];
  const [allowContactAlert, setAllowContactAlert] = useState(false)
  const accDetailsData = useSelector(getAccountDetailsSelector);
  const [filterList, setfilterList] = useState(accDetailsData.length > 0 ? accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1) : []);
  const [searchText, setSearchText] = useState([]);
  const [hasMore, setHasMore] = useState([]);
  const { t, i18n } = useTranslation();
  const mobileNumberInApp = useSelector(mobileNumberSelector)
  const selectedProfileDetails = useSelector(profileSelector);
  const loadContacts = () => {
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
        message: "Payee List",
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation]
  );
  const addContactToFavourit = useCallback(async (item) => {
    try {
      let request = {
        "userId": selectedProfileDetails.userId,
        "favorites": item.favourite === "Y" ? "N" : "Y",
        "accountNo": item.accountNo,
        "contact": item.mobileNo,
      }
      setLoading(true);
      const response = await Home.getAddContactFavourityApi(request);
      const dummyData = contactsList
      let arr = dummyData.map((items, ind) => {
        if (items.mobileNo === item.mobileNo) {
          items.favourite = item.favourite === "N" ? "Y" : "N"
        }
        return { ...items }
      })
      showMessage({
        message: "Add Favourite",
        description: response.message,
        type: "success",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
      setContactsList(arr);
      setContactsFilter(arr);
      setLoading(false);
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
    [navigation, contactsList, contactsFilter]
  );
  const addAccountToFavourit = useCallback(async (item) => {
    try {
      let request = {
        "userId": selectedProfileDetails.userId,
        "favorites": item.favAccount === "Y" ? "N" : "Y",
        "accountNo": item.acctNo,
      }
      setLoading(true);
      const response = await Home.getAccountFavourityApi(request);
      showMessage({
        message: "Add Favourite",
        description: response.message,
        type: "success",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
      let requestAcc = {
        userName: mobileNumberInApp || "",
        profileId: selectedProfileDetails.profileId,
      }
      const responseAcc = await Accounts.getAllAccountDetailsApi(requestAcc);
      setfilterList(responseAcc.custAccDetails.filter(v => accountTypes.indexOf(v.acctType) > -1))
      setLoading(false);
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
    [navigation,filterList]
  );
  const renderAccountListItem = ({ item, index }) => {
    return (
      <><TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate(PAY_PEOPLE.FUND_TRANSFER, { payItem: item, type: 'myAccount' })
        }}
        style={{ flexDirection: 'row', backgroundColor: '#FFFF', padding: 20, width: SIZES.width, justifyContent: 'space-between' }}>
        <View style={{ width: 50, height: 50, backgroundColor: colors.buttonColor, marginRight: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
          {item.acctDesc !== null && <Text style={{ alignSelf: 'center', ...FONTS.h1, color: '#FFF' }}>{item.acctDesc.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}</Text>}
        </View>
        <View style={{ width: '60%' }}>
          <Text style={{ ...FONTS.h3, color: theme.colors.textColor, marginBottom: 5, textTransform: 'capitalize' }}>{item.acctDesc}</Text>
          <Text style={{ color: theme.colors.textColor, marginBottom: 5 }} >{item.acctNo}</Text>
        </View>
        <View style={{ width: '18%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity  style={{padding:10}}
          onPress={() => { addAccountToFavourit(item) }}>

            {/* <Image
            source={item.favourite === "Y" ? favioritSelectedIcon : favioritIcon}
            style={{ width: 25, height: 25, tintColor: item.favourite === "Y" ? colors.buttonColor : colors.textColorgrey }}
          /> */}
            {item.favAccount === "Y" ? <Startselected_icon /> : <StarUnselectedIcon color1={theme.colors.grey} />}



          </TouchableOpacity>
        </View>
      </TouchableOpacity>
        <View style={{ height: 0.5,  backgroundColor: colors.dividerColor, marginTop: 10 }} />
      </>
    )
  }
  const renderContactsListItem = ({ item, index }) => {
    return (<><TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        navigation.navigate(PAY_PEOPLE.FUND_TRANSFER, { payItem: item, type: 'contact' })
      }}
      style={{ flexDirection: 'row', backgroundColor: '#FFFF', padding: 20, width: SIZES.width, justifyContent: 'space-between' }}>
      <View style={{ width: 50, height: 50, backgroundColor: colors.buttonColor, marginRight: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
        {item.accountName !== null && <Text style={{ alignSelf: 'center', ...FONTS.h1, color: '#FFF' }}>{item.accountName.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}</Text>}
      </View>
      <View style={{ width: '60%' }}>
        <Text style={{ ...FONTS.h3, color: theme.colors.textColor, marginBottom: 5 }}>{item.accountName}</Text>
        <Text style={{ color: theme.colors.textColor, marginBottom: 5 }}>{item.mobileNo}</Text>
      </View>
      <View style={{ width: '18%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
         style={{padding:10}}
          onPress={() => { addContactToFavourit(item) }}
        >
          {item.favourite === "Y" ? <Startselected_icon /> : <StarUnselectedIcon />}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
      <View style={{ height: 0.5,  backgroundColor: colors.dividerColor, marginTop: 10 }} />
    </>)
  }
  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 90; //Distance from the bottom you want it to trigger.
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  const searchContacts = (e) => {
    let text = e.toLowerCase()
    let contacts = contactsList

    // search by food truck name
    let filteredName = contacts.filter((contact) => {
      return contact.accountName.toLowerCase().match(text) || contact.mobileNo.toLowerCase().match(text)
    })

    // if no match and text is empty
    if (!text || text === '') {
      setContactsFilter(contactsList)
    }
    // if no name matches to text output
    else if (!Array.isArray(filteredName) && !filteredName.length) {
      setContactsFilter([])
    }
    // if name matches then display
    else if (Array.isArray(filteredName)) {
      setContactsFilter(filteredName)
    }
  }
  const searchMyAccounts = (e) => {
    let text = e.toLowerCase()
    let accounts = accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1) || []
    // search by food truck name
    let filteredName = accounts.filter((account) => {
      return account.acctNo.toLowerCase().match(text) || account.acctDesc.toLowerCase().match(text)
    })

    // if no match and text is empty
    if (!text || text === '') {
      setfilterList(accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1))
    }
    // if no name matches to text output
    else if (!Array.isArray(filteredName) && !filteredName.length) {
      setfilterList([])
    }
    // if name matches then display
    else if (Array.isArray(filteredName)) {
      setfilterList(filteredName)
    }
  }
  return (<SafeAreaView style={{
    marginHorizontal: 10,
    flex: 1,
  }}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 150
      }}
    >
      <SearchComponent
        onChangeText={(text) => {
          setSearchText(getAlphabetsAndNumbersSpaceOnly(text))
          searchMyAccounts(getAlphabetsAndNumbersSpaceOnly(text))
          searchContacts(text)
        }}
        value={searchText}
        onClear={() => {
          setSearchText('');
          setContactsFilter(contactsList)
          setfilterList(accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1))
        }}
      />
      <FlatList
        data={filterList}
        extraData={filterList}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        ListHeaderComponent={() => {
          return (<Text style={{ color: colors.textColorgrey, fontSize: fontSize.textNormal, fontFamily: fontName.medium, marginBottom: 10 }}>{t(AUTH_KEYS.MAIN_SCREEN.MY_ACCOUNTS)}</Text>)
        }}
        renderItem={renderAccountListItem}
        ListFooterComponent={
          () => {
            return (<FlatList
              data={contactsFilter}
              showsVerticalScrollIndicator={false}
              extraData={contactsFilter}
              style={{ flex: 1 }}
              ListHeaderComponent={() => {
                if (accessToContact) {
                  return (<Text style={{ color: colors.textColorgrey, fontSize: fontSize.textNormal, fontFamily: fontName.medium, marginTop: 20 }}>{t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_CONTACT)}</Text>)
                }
                else {
                  return (<MainButton
                    disabled={false}
                    onPress={() => {
                      setAllowContactAlert(true)
                    }}
                    btnContainerStyle={{ alignSelf: 'center', marginTop: 20 }}
                    title={t(AUTH_KEYS.MAIN_SCREEN.ALLOW_CONTACT_ACCESS)}
                  />)
                }

              }}
              renderItem={renderContactsListItem}
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  if (hasMore) {
                    setHasMore(false)
                  }
                }
              }}
              scrollEventThrottle={1000}
            />)
          }
        }
      />
      {allowContactAlert && <AlerComponent
        heading="Transfer money with ease"
        message="Giving access to your mobile contacts will help you to transfer money by just by selecting a contact."
        cancelButtonTitle="Deny"
        okButtonTitle="Allow"
        onCancel={() => {
          setAllowContactAlert(false)
        }}
        onSave={async () => {

          if (Platform.OS === 'android') {
            Linking.openSettings();
            // if (
            //   (await PermissionsAndroid.request(
            //     PermissionsAndroid.PERMISSIONS.READ_CONTACTS
            //   )) === 'granted'
            // ) {
            //   setAccessToContact(true)
            //   loadContacts()
            // } else {
            //   setAccessToContact(false)
            // }


          } else {
            loadContacts();
          }
          setAllowContactAlert(false)
        }}
        outSideOnPress={() => {
          setAllowContactAlert(false)
        }}
      />}
    </ScrollView>
  </SafeAreaView>)

}
export default ContactListItem;