import React, { useEffect, useContext, useState, useRef, useCallback } from "react";
import { View, Animated, Text, Keyboard, TouchableOpacity, SafeAreaView, Dimensions, TextInput, ImageBackground, Image } from "react-native";//
import { fontName, fontSize, FONTS, SIZES } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import {
  EyeHideIcon, EyeOpenIcon, SearchIcon, LogouteIcon, HelpIcon, NotificationIcon,
  PayPeopleIcon,
  RechageBiilsIcon,
  EPassbookIcon,
  DepositIcon,
  DebitCardIcons,
  TaxesIcon,
  MoreIcon
} from "../../../assets/svg";
import { card1, card2, card3, card4, } from '../../../assets/images';
import { FlatList } from "react-native-gesture-handler";
import { currencyFormat } from "../../utils/amount-util";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { GET_STARTED, HOME, PAY_PEOPLE } from "../../routes";


const imageBg = [card1, card2, card3, card4,];
import { ProfileModel } from '../../components';
import ReAnimated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
export default function DashboardScreen({ navigation, route }) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { height } = Dimensions.get('window');
  const UNFOCUSED_HEIGHT = (height * 57) / 100;
  const FOCUSED_HEIGHT = (height * 87) / 100;
  const { width: screenWidth } = Dimensions.get('window');
  const profileModelSharedValue1 = useSharedValue(SIZES.height * 0.1);
  const profileModelSharedValue2 = useSharedValue(SIZES.height * 0.1);
  const { theme, changeTheme } = useContext(AppContext);
  const [viewBalance, setViewBalance] = useState(false);
  const [upComing, setUpComing] = useState('payment')
  const [accountList, setAccountList] = useState([{ accountNumber: '1008971019230', balance: 1234.68, accountName: 'Sagar J Kakanoor' }, { accountNumber: '100867192334', balance: 15674334443.68, accountName: 'Sathish kumar C' }, { accountNumber: '100098765443', balance: 128834.68, accountName: 'Rakesh M B' }, { accountNumber: '12000123444455', balance: 3344344.68, accountName: 'Shashank Roy' }, { accountNumber: '200112344445555', balance: 671234.68, accountName: 'Meena A' },]);

  let today = new Date();

  let currentDate = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();


  const flatListRef = useRef();
  const [menuList, setMenuList] = useState([{ name: "Pay People", image: <PayPeopleIcon />, route: PAY_PEOPLE.MENU }, { name: "Recharge/Bills", image: <RechageBiilsIcon />, route: PAY_PEOPLE.MENU }, { name: "ePassbook", image: <EPassbookIcon />, route: PAY_PEOPLE.MENU }, { name: "Open FD", image: <DepositIcon />, route: PAY_PEOPLE.MENU }, { name: "Cards", image: <DebitCardIcons />, route: PAY_PEOPLE.MENU }, { name: "Taxes", image: <TaxesIcon />, route: PAY_PEOPLE.MENU }, { name: "More", image: <MoreIcon />, route: PAY_PEOPLE.MENU }])
  const [transactionItem, setTransactionItem] = useState([{
    "account": "0013050000375",
    "amount": 50023434,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-12",
    "debitOrCredit": "Credit",
    "descAccNo": null,
    "instrumentCode": "007BKIF180610008",
    "module": "PCC",
    "narration": null,
    "refNo": null,
    "slNo": "135018611",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "BALANCE TRANSFER",
    "txnValuedDate": "12-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640001",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135382657",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "Cr NEFT NIRMALDAS BHIKHCHAND",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 600.44,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640004",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135461269",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "Charges for NEFT : 000001421658",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": null,
    "module": "RT",
    "narration": "Cash Withdrawal",
    "refNo": "001CHWL180640082",
    "slNo": "135529064",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "CASH WITHDRAWAL",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2021-02-03",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001OPEX210340011",
    "module": "PCD",
    "narration": "E BANKING FUND TRANSFER",
    "refNo": "001BUPC210340028",
    "slNo": "381622563",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "Dr. NEFT LUXOR WRITING 01732100000462 KKBK0000173",
    "txnValuedDate": "03-FEB-2021"
  }, {
    "account": "0013050000375",
    "amount": 5000.5,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-02",
    "debitOrCredit": "Credit",
    "descAccNo": null,
    "instrumentCode": "007BKIF180610008",
    "module": "PCC",
    "narration": null,
    "refNo": null,
    "slNo": "135018611",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "Dr. RTGS ADD PENS PRIV 10187214222 SBIN0004760",
    "txnValuedDate": "02-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640001",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135382657",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "KUMAR PAPER BPRODUCTS HP-460",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 600.44,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640004",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135461269",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": null,
    "module": "RT",
    "narration": "Cash Withdrawal",
    "refNo": "001CHWL180640082",
    "slNo": "135529064",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "CASH WITHDRAWAL",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2021-02-03",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001OPEX210340011",
    "module": "PCD",
    "narration": "E BANKING FUND TRANSFER",
    "refNo": "001BUPC210340028",
    "slNo": "381622563",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "03-FEB-2021"
  }, {
    "account": "0013050000375",
    "amount": 5000.5,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-02",
    "debitOrCredit": "Credit",
    "descAccNo": null,
    "instrumentCode": "007BKIF180610008",
    "module": "PCC",
    "narration": null,
    "refNo": null,
    "slNo": "135018611",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "02-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640001",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135382657",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "BY CLG/ZN CTS0/SET 54",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 600.44,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640004",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135461269",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "Dr. NEFT LUXOR WRITING 01732100000462 KKBK0000173",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": null,
    "module": "RT",
    "narration": "Cash Withdrawal",
    "refNo": "001CHWL180640082",
    "slNo": "135529064",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "CASH WITHDRAWAL",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2021-02-03",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001OPEX210340011",
    "module": "PCD",
    "narration": "E BANKING FUND TRANSFER",
    "refNo": "001BUPC210340028",
    "slNo": "381622563",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "03-FEB-2021"
  }, {
    "account": "0013050000375",
    "amount": 5000.5,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-02",
    "debitOrCredit": "Credit",
    "descAccNo": null,
    "instrumentCode": "007BKIF180610008",
    "module": "PCC",
    "narration": null,
    "refNo": null,
    "slNo": "135018611",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "02-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640001",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135382657",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 600.44,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640004",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135461269",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": null,
    "module": "RT",
    "narration": "Cash Withdrawal",
    "refNo": "001CHWL180640082",
    "slNo": "135529064",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "CASH WITHDRAWAL",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2021-02-03",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001OPEX210340011",
    "module": "PCD",
    "narration": "E BANKING FUND TRANSFER",
    "refNo": "001BUPC210340028",
    "slNo": "381622563",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "03-FEB-2021"
  }, {
    "account": "0013050000375",
    "amount": 5000.5,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-02",
    "debitOrCredit": "Credit",
    "descAccNo": null,
    "instrumentCode": "007BKIF180610008",
    "module": "PCC",
    "narration": null,
    "refNo": null,
    "slNo": "135018611",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "02-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640001",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135382657",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 600.44,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640004",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135461269",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": null,
    "module": "RT",
    "narration": "Cash Withdrawal",
    "refNo": "001CHWL180640082",
    "slNo": "135529064",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "CASH WITHDRAWAL",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2021-02-03",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001OPEX210340011",
    "module": "PCD",
    "narration": "E BANKING FUND TRANSFER",
    "refNo": "001BUPC210340028",
    "slNo": "381622563",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "03-FEB-2021"
  }, {
    "account": "0013050000375",
    "amount": 5000.5,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-02",
    "debitOrCredit": "Credit",
    "descAccNo": null,
    "instrumentCode": "007BKIF180610008",
    "module": "PCC",
    "narration": null,
    "refNo": null,
    "slNo": "135018611",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "02-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640001",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135382657",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 600.44,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640004",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135461269",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": null,
    "module": "RT",
    "narration": "Cash Withdrawal",
    "refNo": "001CHWL180640082",
    "slNo": "135529064",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "CASH WITHDRAWAL",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2021-02-03",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001OPEX210340011",
    "module": "PCD",
    "narration": "E BANKING FUND TRANSFER",
    "refNo": "001BUPC210340028",
    "slNo": "381622563",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "03-FEB-2021"
  }, {
    "account": "0013050000375",
    "amount": 5000.5,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-02",
    "debitOrCredit": "Credit",
    "descAccNo": null,
    "instrumentCode": "007BKIF180610008",
    "module": "PCC",
    "narration": null,
    "refNo": null,
    "slNo": "135018611",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "02-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640001",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135382657",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 600.44,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001BKOF180640004",
    "module": "PCD",
    "narration": null,
    "refNo": null,
    "slNo": "135461269",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1500,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2022-03-05",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": null,
    "module": "RT",
    "narration": "Cash Withdrawal",
    "refNo": "001CHWL180640082",
    "slNo": "135529064",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "CASH WITHDRAWAL",
    "txnValuedDate": "05-MAR-2022"
  }, {
    "account": "0013050000375",
    "amount": 1,
    "branch": "Kalyan Nagar Branch",
    "branchCode": "001",
    "date": "2021-02-03",
    "debitOrCredit": "Debit",
    "descAccNo": null,
    "instrumentCode": "001OPEX210340011",
    "module": "PCD",
    "narration": "E BANKING FUND TRANSFER",
    "refNo": "001BUPC210340028",
    "slNo": "381622563",
    "srcAccount": null,
    "txnCurrency": "INR",
    "txnTypeDes": "E BANKING FUND TRANSFER",
    "txnValuedDate": "03-FEB-2021"
  }])
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewChangeRef = useRef(({ viewableItems, changed }) => {
    if (changed && changed.length > 0) {
      setCurrentIndex(changed.index + 1)
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
          outputRange: [8, 40, 8],
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
  const callApi = useCallback(() => {
    profileModelSharedValue1.value = withTiming(
      0, { duration: 300 }
    )
    profileModelSharedValue2.value = withDelay(300, withTiming(0, { duration: 1000 }))

    setTimeout(function () {
      profileModelSharedValue2.value = withTiming(SIZES.height, { duration: 500 })
      profileModelSharedValue1.value = withDelay(500, withTiming(SIZES.height, { duration: 100 }))
    }, 3000);
  }, [])
  useEffect(() => {
    callApi();
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
  const renderMenuItem = ({ item, index }) => {
    return (<TouchableOpacity style={{ padding: 10 }}
      onPress={() => {
        navigation.navigate(item.route)

      }}
    >
      <View style={{ alignItems: 'center' }}>{item.image}</View>

      <Text style={{ textAlign: 'left', padding: 5, ...FONTS.body5, color: '#111827' }}>{item.name}</Text>

    </TouchableOpacity>)
  }
  const renderTransactionItem = ({ item, index }) => {
    return (<TouchableOpacity style={{ padding: 10 }}
      onPress={() => {
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ textAlign: 'left', ...FONTS.body5, color: '#111827', width: '50%' }}>{item.txnTypeDes}</Text>
        <Text style={{ ...FONTS.h5, color: item.debitOrCredit === 'Credit' ? '#2FA2B9' : '#FF7888', width: '50%', textAlign: 'right' }}>{currencyFormat(item.amount)}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ textAlign: 'left', ...FONTS.body5, color: '#6B7280', width: '50%' }}>{item.branch}</Text>
        <Text style={{ ...FONTS.body5, color: '#6B7280', width: '50%', textAlign: 'right' }}>{item.txnValuedDate}</Text>
      </View>
      <View
        style={{
          height: 2,
          width: '100%',
          backgroundColor: '#F3F4F6',
        }}
      />
    </TouchableOpacity>)
  }
  const renderItem = ({ item, index }) => {

    return (<TouchableOpacity style={{ width: SIZES.width }}>
      <ImageBackground
        source={imageBg[index] || imageBg[(index / 4 - 1)]}
        style={{ width: SIZES.width * 0.9, marginLeft: 20 }}
        imageStyle={{ borderRadius: 20 }}
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
            <Text style={{ color: '#FFFFFF', ...FONTS.h2, alignSelf: 'center', textAlign: 'center' }}>{viewBalance ? "₹ " + "XXXXXX" : currencyFormat(item.balance)}</Text>
            <Text style={{ color: '#FFFFFF', ...FONTS.body5, textAlign: 'center' }}>{`${'as on '} ${new Date().toLocaleString()}`}</Text>
            <Text style={{ color: '#FFFFFF', ...FONTS.h5, textAlign: 'center' }}>{`${item.accountNumber}`}</Text>
            <Text style={{ color: '#FFFFFF', ...FONTS.body5, textAlign: 'center' }}>{`${item.accountName} - ${'Kalyan Nagar'}`}</Text>
          </View>
          <View style={{ height: '30%', flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 5, }}>
            <Text style={{ marginTop: 5, paddingHorizontal: 10, color: '#FFFFFF', ...FONTS.h4, width: '30%' }}>{"Statement"}</Text>
            <Text style={{ marginTop: 5, paddingHorizontal: 10, color: '#FFFFFF', ...FONTS.h4, width: '30%' }}>{"Cheques"}</Text>
            <Text style={{ marginTop: 5, paddingHorizontal: 10, color: '#FFFFFF', ...FONTS.h4, width: '30%' }}>{"More"}</Text>
          </View>
        </View></ImageBackground></TouchableOpacity>)
  }
  const headerComponent = () => {
    return (<View style={{ top: 10, flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 }}>
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
          <NotificationIcon onPress={() => {
            navigation.navigate(HOME.NOTIFICATION)
          }}/>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 15 }}>
          <HelpIcon />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 15 }}
          onPress={() => {
            navigation.navigate(GET_STARTED)
          }}
        >
          <LogouteIcon />
        </TouchableOpacity>
      </View>
    </View>)
  }

  const renderItem1 = ({ item, index }) => {
    return (
      <View>

        <ImageBackground
          source={imageBg[index] || imageBg[(index / 4 - 1)]}
          style={{ width: SIZES.width * 0.9, height: 200 }}
          imageStyle={{ borderRadius: SIZES.radius }}
        >


          <View style={{ width: SIZES.width * 0.9, height: SIZES.height / 4, borderRadius: 10, marginTop: 10 }}>
            <View style={{ width: SIZES.width * 0.9, marginTop: 10 }}>
              <Text style={{ color: '#FFFFFF', ...FONTS.h2, alignSelf: 'center', textAlign: 'center' }}>{viewBalance ? "₹ " + "XXXXXX" : currencyFormat(item.balance)}</Text>
              <Text style={{ color: '#FFFFFF', ...FONTS.body5, textAlign: 'center' }}>{`${'as on '} ${currentDate}`}</Text>
              <Text style={{ color: '#FFFFFF', ...FONTS.h5, textAlign: 'center', marginTop: 5 }}>{`${item.accountNumber}`}</Text>
              <Text style={{ color: '#FFFFFF', ...FONTS.body5, textAlign: 'center' }}>{`${item.accountName} - ${'Kalyan Nagar'}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', marginTop: 25 }}>
              <Text style={{ marginTop: 5, paddingHorizontal: 5, color: '#FFFFFF', ...FONTS.h4, width: '30%', textAlign: 'center' }}>{"Statement"}</Text>
              <Text style={{ marginTop: 5, paddingHorizontal: 5, color: '#FFFFFF', ...FONTS.h4, width: '30%', textAlign: 'center' }}>{"Cheques"}</Text>
              <Text style={{ marginTop: 5, paddingHorizontal: 5, color: '#FFFFFF', ...FONTS.h4, width: '30%', textAlign: 'center' }}>{"Services"}</Text>
            </View>
          </View>
        </ImageBackground>

        <TouchableOpacity
          style={{ position: 'absolute', right: 10, top: 0, margin: 10 }}
          onPress={() => {
            setViewBalance(!viewBalance)

          }}>
          {viewBalance ? <EyeOpenIcon /> : <EyeHideIcon />}
        </TouchableOpacity>
      </View>


    );
  }
  const [activeSlide, setActiveSlide] = useState(0)

  const slideChange = useCallback(index => {
    setActiveSlide(index)
    //store.dispatch({ type: DEFAULT_ACC_INDEX, payload: index });
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: isKeyboardVisible ? FOCUSED_HEIGHT : UNFOCUSED_HEIGHT,
        backgroundColor: '#FFFF'
      }}>
      <LinearGradient
        colors={['rgba(92, 187, 255, 0)', '#5CBBFF']}
        style={{ width: SIZES.width, paddingBottom: 10 }}
        useAngle={true}
        angle={175}>
        {headerComponent()}
        <View style={{ marginTop: 15 }}>
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

        {/* <Carousel
          // ref={(c) => { this._carousel = c; }}
          data={accountList}
          renderItem={renderItem1}
          layout={'default'}
          sliderWidth={screenWidth}
          itemWidth={screenWidth - 40}
          hasParallaxImages={true}
          firstItem={0}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          loop={false}
          loopClonesPerSide={1}
          autoplay={false}
          onSnapToItem={slideChange}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { x: scrollX }
              }
            }
          ], {
            useNativeDriver: false
          })}
        />
        <Dots /> */}
      </LinearGradient>
      <View style={{ height: 80 }}>
        <FlatList
          data={menuList}
          horizontal
          style={{ marginLeft: 20, borderWidth: 1, borderColor: "#1A70FF", marginTop: 10, borderBottomLeftRadius: 20, borderTopLeftRadius: 20 }}
          showsHorizontalScrollIndicator={false}
          extraData={menuList}
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderMenuItem}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, marginBottom: 20 }}>
        <TouchableOpacity onPress={() => {
          setUpComing('payment')
        }}>
          <Text style={{ color: "#1A70FF", ...FONTS.h5 }}>Upcoming Payments</Text>
          <View style={{ width: '100%', height: 3, backgroundColor: upComing === 'payment' ? "#1A70FF" : "#DADADA", marginTop: 5, borderTopRightRadius: 2, borderTopLeftRadius: 2 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setUpComing('income')
        }}
        >
          <Text style={{ color: '#199C03', ...FONTS.h5 }}>Upcoming Incomes</Text>
          <View style={{ width: '100%', height: 3, backgroundColor: upComing === 'income' ? '#199C03' : "#DADADA", marginTop: 5, borderTopRightRadius: 2, borderTopLeftRadius: 2 }} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={transactionItem}
        extraData={transactionItem}
        keyExtractor={(item, index) => `${index}`}
        renderItem={renderTransactionItem}
      />
      <ProfileModel
        profileModelSharedValue1={profileModelSharedValue1}
        profileModelSharedValue2={profileModelSharedValue1}
      />
    </SafeAreaView>

  );
}
