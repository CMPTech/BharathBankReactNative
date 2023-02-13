import React, { useEffect, useContext, useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Platform,
} from 'react-native'
import {
  fontName,
  fontSize,
  FONTS,
  SIZES,
  monthNames,
  fontPixel,
  pixelSizeVertical,
} from '../../../styles/global.config'
import LinearGradient from 'react-native-linear-gradient'
import { AppContext } from '../../../themes/AppContextProvider'
import { BackIcon, LogoIcon, SplashScreenIcon } from '../../../assets/svg'
import TitleText from '../../components/base/TitleText'
import { GET_STARTED } from '../../routes'
import { rightArrow, editPen } from '../../../assets/icons'
import Animated, {
  interpolate,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { CrossIcon } from '../../../assets/svg'
import { amountFormat, currencyFormat } from '../../utils/amount-util'
import { ACCOUNTS } from '../../routes'
import { MainButton } from '../../components'
import { accDeposits, accLoans, accSavings } from '../../../assets/images'
import { AUTH_KEYS } from '../../../assets/translations/constants'
import { useTranslation } from 'react-i18next'
import ShowAmountFormat from '../../components/base/ShowAmountFormat'
import { EditShortNameComponent, LoaderComponent } from '../../components'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'
import {
  profileSelector,
  mobileNumberSelector,
  getAccountDetailsSelector,
} from '../../store/selectors'
import Accounts from '../../api/accounts'
export default function AccountsOverviewScreen({ navigation, route }) {
  const { t, i18n } = useTranslation()
  const { theme, changeTheme } = useContext(AppContext)
  //const accountList = route.params.accountList
  const accountList = useSelector(getAccountDetailsSelector)
  const mobileNumberInApp = useSelector(mobileNumberSelector)
  const selectedProfileDetails = useSelector(profileSelector)
  const [selectedTab, setSelected] = useState('Banking accounts')
  const accountTypes = ['CA', 'SB', 'OD']
  const loanTypes = ['LA']
  const depositTypes = ['TD', 'FD', 'RD']
  const casaList = accountList.filter(
    (v) => accountTypes.indexOf(v.acctType) > -1,
  )
  const depositList = accountList.filter(
    (v) => depositTypes.indexOf(v.acctType) > -1,
  )
  const loanList = accountList.filter((v) => loanTypes.indexOf(v.acctType) > -1)
  const [selectedAccList, setSelectedAccList] = useState(casaList)
  const tabsValue = ['SB', 'TD', 'LA']
  const [isLoading, setLoading] = useState(false)
  const [selectedValueTab, setSelectedValue] = useState('SB')
  const [accountShortName, setAccounShortName] = useState('')
  const [accountShortError, setAccounShortNameError] = useState('')
  const [accountNoSelected, setAccounNoSelected] = useState('')
  const [showEditShortname, setShowEditShortname] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const tabs = [t(AUTH_KEYS.MAIN_SCREEN.BANKING_ACCOUNTS), t(AUTH_KEYS.MAIN_SCREEN.DEPOSITS), t(AUTH_KEYS.MAIN_SCREEN.LOANS)]
  const renderItemLoans = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (selectedValueTab === ('SB' || 'CA' || 'OD')) {
            navigation.navigate(ACCOUNTS.ACCOUNT_SUMMERY, { accountItem: item })
          } else if (selectedValueTab === 'TD') {
            navigation.navigate(ACCOUNTS.VIEW_DEPOSIT_ACCOUNT_DETAILS, {
              accountItem: item,
            })
          } else if (selectedValueTab === 'LA') {
            navigation.navigate(ACCOUNTS.LOAN_ACCOUNT_DETAILS, {
              accountItem: item,
            })
          }
        }}
      >
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}
        >
          <View style={{ width: '50%' }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: Platform.OS === 'android' ? 0 : 7,
              }}
              onPress={() => {
                setAccounNoSelected(item.acctNo)
                setShowEditShortname(true)
              }}
            >
              <Text
                style={{
                  ...FONTS.body3,
                  color: theme.colors.grey,
                  textTransform: 'capitalize',
                  fontFamily: fontName.medium,
                  fontSize: 18,
                }}
              >
                {item.acctShortName}
              </Text>
              <Image
                source={editPen}
                style={{ marginLeft: 10, width: 10, height: 10 }}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: theme.colors.grey,
                fontFamily: fontName.medium,
                fontSize: 14,
                marginTop: Platform.OS === 'android' ? 0 : 7,
              }}
            >
              {item.acctType + ' ' + item.acctNo}
            </Text>

            <Text
              style={{
                color: theme.colors.grey,
                fontFamily: fontName.medium,
                fontSize: 14,
                marginTop: Platform.OS === 'android' ? 0 : 7,
              }}
            >
              {item.acctBranchDesc + ' Branch'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '40%',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            {/* <Text style={{ ...FONTS.body2, color: theme.colors.grey, fontFamily: fontName.medium, fontSize: fontPixel(18) }}>{selectedValueTab === "LA" ? `${(item.outstandingAmt !== null && item.outstandingAmt !== undefined) ? amountFormat(item.outstandingAmt, item.acctCcy) : ''}` : `${(item.availableBalance !== null && item.availableBalance !== undefined) ? amountFormat(item.availableBalance, item.acctCcy) : ''}`}</Text> */}
            <ShowAmountFormat
              currency={item.acctCcy}
              amount={item.outstandingAmt}
              color={theme.colors.grey}
              amountFontSize={20}
              currencyFontSize={14}
              amtStyle={{ fontFamily: fontName.medium }}
            />

            <Image
              style={{
                width: 15,
                height: 15,
                marginLeft: 10,
                tintColor: theme.colors.buttonColor,
              }}
              source={rightArrow}
            />
          </View>
        </View>
        <View style={{ height: 1, marginTop: 5, backgroundColor: '#F3F4F6' }} />
      </TouchableOpacity>
    )
  }
  const renderItemDeposits = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{ paddingTop: 15, paddingHorizontal: 10 }}
        onPress={() => {
          navigation.navigate(ACCOUNTS.VIEW_DEPOSIT_ACCOUNT_DETAILS, {
            accountItem: item,
          })
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* <Text style={{ color: theme.colors.grey, ...FONTS.body3, fontFamily: fontName.medium, textAlign: 'left', width: '12%', marginLeft: 10, fontSize: 16 }}>{item.acctOpenDate.split('-')[0]}</Text> */}
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                color:
                  selectedValueTab === 'TD'
                    ? theme.colors.ligthgreenButtonColor
                    : theme.colors.buttonColor,
                ...FONTS.body3,
                fontFamily: fontName.medium,
                marginRight: 5,
                fontSize: 16,
              }}
            >
              {item.acctType}
            </Text>
            <Text
              style={{
                color: theme.colors.grey,
                ...FONTS.body3,
                fontFamily: fontName.medium,
                fontSize: 16,
              }}
            >
              {item.acctNo}
            </Text>
          </View>
          <Text
            style={{
              ...FONTS.body5,
              color: theme.colors.grey,
              fontFamily: fontName.medium,
              textAlign: 'right',
              fontSize: 12,
            }}
          >{`${item.interestRate}%`}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: Platform.OS === 'android' ? 0 : 7,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* <Text style={{ color: theme.colors.grey, ...FONTS.body3, fontFamily: fontName.medium, textAlign: 'left', width: '12%', marginLeft: 10, fontSize: 16 }}>{monthNames[parseInt(item.acctOpenDate.split('-')[1])]}</Text> */}
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => {
              setAccounNoSelected(item.acctNo)
              setShowEditShortname(true)
            }}
          >
            <Text
              style={{
                ...FONTS.body4,
                color: theme.colors.grey,
                textTransform: 'capitalize',
                fontFamily: fontName.medium,
                opacity: 0.9,
                textAlign: 'right',
                fontSize: 14,
              }}
            >
              {item.acctShortName}
            </Text>
            <Image
              source={editPen}
              style={{ marginLeft: 10, width: 10, height: 10 }}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {/* <Text style={{ ...FONTS.body2, color: theme.colors.grey, fontFamily: fontName.medium, textAlign: 'right', fontSize: fontPixel(18) }}>{selectedValueTab === "LA" ? `${(item.outstandingAmt !== null && item.outstandingAmt !== undefined) ? amountFormat(item.outstandingAmt, item.acctCcy) : ''}` : `${(item.availableBalance !== null && item.availableBalance !== undefined) ? amountFormat(item.availableBalance, item.acctCcy) : ''}`}</Text> */}
            <ShowAmountFormat
              currency={item.acctCcy}
              amount={item.availableBalance}
              color={theme.colors.grey}
              amountFontSize={20}
              currencyFontSize={14}
              amtStyle={{ fontFamily: fontName.medium }}
            />
            <Image
              style={{
                width: 15,
                height: 15,
                marginLeft: 10,
                tintColor: theme.colors.buttonColor,
              }}
              source={rightArrow}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: Platform.OS === 'android' ? 0 : 7,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* <Text style={{ color: theme.colors.grey, ...FONTS.body3, fontFamily: fontName.medium, textAlign: 'left', width: '12%', marginLeft: 10, fontSize: 16 }}>{item.acctOpenDate.split('-')[2]}</Text> */}
          <Text
            style={{
              ...FONTS.body4,
              color: theme.colors.grey,
              textTransform: 'capitalize',
              fontFamily: fontName.medium,
              opacity: 0.9,
              textAlign: 'right',
              fontSize: 14,
            }}
          >
            {item.acctBranchDesc + ' Branch'}
          </Text>
          <Text
            style={{
              ...FONTS.body5,
              color: theme.colors.grey,
              fontFamily: fontName.medium,
              textAlign: 'right',
              fontSize: 12,
            }}
          >{`${'Matures on'} ${item.maturityDate}`}</Text>
        </View>
        <View
          style={{
            height: 1,
            marginTop: 5,
            backgroundColor: '#F3F4F6',
            marginTop: 15,
          }}
        />
      </TouchableOpacity>
    )
  }
  const renderItemSavingAccount = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (selectedValueTab === ('SB' || 'CA' || 'OD')) {
            navigation.navigate(ACCOUNTS.ACCOUNT_SUMMERY, { accountItem: item })
          } else if (selectedValueTab === 'TD') {
            navigation.navigate(ACCOUNTS.VIEW_DEPOSIT_ACCOUNT_DETAILS, {
              accountItem: item,
            })
          } else if (selectedValueTab === 'LA') {
            navigation.navigate(ACCOUNTS.LOAN_ACCOUNT_DETAILS, {
              accountItem: item,
            })
          }
        }}
      >
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}
        >
          <View style={{ width: '50%' }}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => {
                setAccounNoSelected(item.acctNo)
                setShowEditShortname(true)
              }}
            >
              <Text
                style={{
                  ...FONTS.body3,
                  color: theme.colors.grey,
                  textTransform: 'capitalize',
                  fontFamily: fontName.bold,
                }}
              >
                {item.acctShortName}
              </Text>
              <Image
                source={editPen}
                style={{ marginLeft: 10, width: 10, height: 10 }}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: theme.colors.grey,
                fontFamily: fontName.medium,
                marginTop: Platform.OS === 'android' ? 0 : 7,
              }}
            >
              {item.acctType + ' ' + item.acctNo}
            </Text>

            <Text
              style={{
                color: theme.colors.grey,
                fontFamily: fontName.medium,
                marginTop: Platform.OS === 'android' ? 0 : 7,
              }}
            >
              {item.acctBranchDesc + ' Branch'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '40%',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            <ShowAmountFormat
              currency={item.acctCcy}
              amount={item.availableBalance}
              color={theme.colors.grey}
              amountFontSize={20}
              currencyFontSize={14}
              amtStyle={{ fontFamily: fontName.medium }}
            />
            {/* <Text style={{ ...FONTS.body2, color: theme.colors.grey, fontFamily: fontName.medium ,fontSize: fontPixel(18)}}>{selectedValueTab === "LA" ? `${(item.outstandingAmt !== null && item.outstandingAmt !== undefined) ? amountFormat(item.outstandingAmt, item.acctCcy) : ''}` : `${(item.availableBalance !== null && item.availableBalance !== undefined) ? amountFormat(item.availableBalance, item.acctCcy) : ''}`}</Text> */}
            <Image
              style={{
                width: 15,
                height: 15,
                marginLeft: 10,
                tintColor: theme.colors.buttonColor,
              }}
              source={rightArrow}
            />
          </View>
        </View>
        <View style={{ height: 1, marginTop: 5, backgroundColor: '#F3F4F6' }} />
      </TouchableOpacity>
    )
  }
  const editAccountShortName = useCallback(async () => {
    try {
      let request = {
        profileId: selectedProfileDetails.profileId,
        accountNo: accountNoSelected,
        accShortName: accountShortName,
      }
      setLoading(true)
      const response = await Accounts.accountShortnameEditApi(request)
      await Accounts.getAllAccountDetailsApi({
        profileId: selectedProfileDetails.profileId,
        userName: mobileNumberInApp || '',
      })
      setLoading(false)
      // navigation.navigate("MainLayoute")
      // navigation.goBack()
      setAccounShortName('')
      setAccounNoSelected('')

      showMessage({
        message: 'Nick name',
        description:
          response.message || 'Account name is updated successfully.',
        type: 'danger',
        hideStatusBar: true,
        backgroundColor: 'black', // background color
        color: 'white', // text color
      })

      console.log(JSON.stringify(response, null, 2))
    } catch (error) {
      setLoading(false)
      showMessage({
        message: '',
        description: error.message || error.error,
        type: 'danger',
        hideStatusBar: true,
        backgroundColor: 'black', // background color
        color: 'white', // text color
      })
    }
  }, [navigation, accountShortName, accountNoSelected])

  const handleSetAccountShortNameSave = (name) => {
    if (accountShortName !== '') {
      setShowEditShortname(false)
      setAccounShortNameError('')
      editAccountShortName()
    } else {
      setAccounShortNameError(t(AUTH_KEYS.MAIN_SCREEN.ACCOUNt_OVERVIEW_NICKNAME))
    }
  }

  const handleAccountListUpdate = () => {
    setSelectedAccList(
      selectedTabIndex === 0 ? casaList
        : selectedTabIndex === 1 ? depositList : loanList,
    )
  }

  React.useEffect(handleAccountListUpdate, [accountList])

  return (
    <View
      style={
        {
          flex: 1,
          backgroundColor: '#4370e7',
        }
        //, accountModelContainerAnimatedStyle]
      }
    >
      <View
        style={
          {
            flex: 1,
            backgroundColor: '#FFFF',
          }
          //, accountModelContentanimatedStyle]
        }
      >
        <View
          style={{
            backgroundColor: '#4370e7',
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 20,
            paddingBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{ alignSelf: 'flex-start' }}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <BackIcon color={'#00ffce'} />
          </TouchableOpacity>
          <Text style={FONTS.headerText}>{t(AUTH_KEYS.MAIN_SCREEN.ACCOUNT_OVERVIEW)}</Text>
        </View>

        {/* Header Tabs  Banking accounts , Deposits ,Loans */}
        <View
          style={{
            backgroundColor: '#4370e7',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}
        >
          {tabs.map((v, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedTabIndex(index)
                  setSelected(v)
                  setSelectedValue(tabsValue[index])
                  setSelectedAccList(
                    index === 0 ? casaList
                      : index === 1 ? depositList : loanList,
                  )
                }}
              >
                <View style={{
                  color: selectedTab === v ? '#00ffce' : '#FFF',
                  borderBottomWidth: selectedTab === v ? 4 : 0,
                  borderColor:
                    selectedTab === v ? '#00ffce' : '#00ffce',
                }}>
                  <Text
                    style={{
                      ...FONTS.h2,
                      paddingTop: 10,
                      color: selectedTab === v ? '#00ffce' : '#FFF',
                      paddingBottom: Platform.OS === 'android' ? 2 : 5,
                      //textDecorationLine: selectedTab === v ? 'underline' : 'none',
                    }}
                  >
                    {v}
                  </Text>
                </View>

              </TouchableOpacity>
            )
          })}
        </View>

        {selectedValueTab === 'SB' ? (
          <Image
            source={accSavings}
            style={{
              width: '80%',
              height: 200,
              opacity: 0.5,
              resizeMode: 'contain',
              position: 'absolute',
              bottom: '5%',
              alignSelf: 'center',
            }}
          />
        ) : selectedValueTab === 'TD' ? (
          <Image
            source={accDeposits}
            style={{
              width: '80%',
              height: 200,
              opacity: 0.5,
              resizeMode: 'contain',
              position: 'absolute',
              bottom: '5%',
              alignSelf: 'center',
            }}
          />
        ) : selectedValueTab === 'LA' ? (
          <Image
            source={accLoans}
            style={{
              width: '80%',
              height: 200,
              opacity: 0.5,
              resizeMode: 'contain',
              position: 'absolute',
              bottom: '5%',
              alignSelf: 'center',
            }}
          />
        ) : null}

        {/* {selectedValueTab === ('SB' || 'CA'|| "OD") ?
          <Text style={{
            
            ...FONTS.h3, textAlign: 'left',
            marginTop: 20, marginLeft: 25,
            marginBottom: 10,
            color: theme.colors.grey
          }}>Home bank accounts</Text>
          :
          null
        } */}
        {selectedAccList.length > 0 ? (
          <FlatList
            data={selectedAccList}
            extraData={selectedAccList}
            // extraData={accountList.filter(v => v.acctType === selectedValueTab)}
            keyExtractor={(item, index) => `${index}`}
            style={{ marginLeft: 10, marginTop: 10 }}
            renderItem={
              selectedValueTab === ('SB' || 'CA' || 'OD')
                ? renderItemSavingAccount
                : selectedValueTab === ('TD' || 'FD' || 'RD')
                  ? renderItemDeposits
                  : renderItemLoans
            }
          />
        ) : (
          <Text
            style={{
              ...FONTS.h3,
              opacity: 0.8,
              textAlign: 'center',
              marginTop: 50,
              color: theme.colors.textColor,
            }}
          >
            {t(AUTH_KEYS.MAIN_SCREEN.NO_DATA_FOUND)}
          </Text>
        )}

        {/* {selectedValueTab === ('SB' || 'CA'|| "OD") ?


          <MainButton noBorder btnContainerStyle={{ width: '100%', position: 'absolute', bottom: 0 }} title={t(AUTH_KEYS.REGISTER.DEBIT_CARD_SETTING_TITLE)}
            onPress={() => {
              console.log("testing")
            }
            } />

          : selectedValueTab === 'TD' ?
            <MainButton noBorder btnContainerStyle={{ width: '100%', position: 'absolute', bottom: 0 }} title={t(AUTH_KEYS.REGISTER.OPEN_DEPOSIT)}
              onPress={() => {

              }
              } />

            : selectedValueTab === "LA" ?
              null

              : null} */}
      </View>
      {showEditShortname && (
        <EditShortNameComponent
          onCancel={() => {
            setShowEditShortname(false)
            setAccounNoSelected('')
            setAccounShortNameError('')
          }}
          onSave={handleSetAccountShortNameSave}
          errors={accountShortError}
          touched={accountShortError}
          accountShortName={accountShortName}
          setAccounShortName={setAccounShortName}
        />
      )}

      {isLoading && <LoaderComponent />}
    </View>
  )
}
