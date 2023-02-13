import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import SplashScreen from '../screens/splash/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import { AUTH, GET_STARTED, HOME, REGISTER, SPLASH, PAY_PEOPLE, LOCATION, CALL_US, FAQS, ACCOUNTS, SETTINGS, PRIVACY_POLICY, SERVICES } from '.';
import GetStartedScreen from '../screens/getStarted/GetStartedScreen';
import RegisterOptionScreen from '../screens/getStarted/RegisterOptionScreen';
import PINRegisterScreen from '../screens/getStarted/PINRegisterScreen';
import PINSuccessScreen from '../screens/getStarted/PINSuccessScreen';
import HomeTabs from '../navigation/homeTabs';
import AccountsScreen from '../screens/home/AccountsScreen';
import ScanScreen from '../screens/home/ScanScreen';
import LimitScreen from '../screens/home/LimitScreen';
import PINLoginScreen from '../screens/auth/mpin_login';
import ChequeBookSuccessScreen from '../screens/services/ChequeBookSuccessScreen';
import SessionExpiredScreen from '../screens/auth/sessionTimeOut'
import TermsAndConditionsScreen from '../screens/getStarted/TermsAndConditionsScreen';
import {
  PayPeopleMenu,
  SendMoneyUserInputScreen,
  AddPayeeScreen,
  ConfirmAddPayeeScreen,
  FundTransferScreen,
  SearchBankList,
  SearchBranchList,
  AddPayeeSuccess,
  ConfirmPaymentScreen,
  FundTransferOTPScreen,
  PayeeDetailsScreen,
  PayeeHistory,
  PaymentRecieptScreen,
  ShareWithAuthorizerScreen,
  AuthoriztaionList,
  AuthorizationScreen,
  ScheduledTransferList,
  FundTransferAuthOTPScreen,
  ScheduleTransferDetailScreen,
  CancelScheduledPaymentOTPScreen,
  HistoryDetailScreen,
  AuthrizationSuccessScreen,
  ReInitiateFundTransferScreen,
  ReinitiateConfirmScreen,
  ReInitiateOTPScreen,
  DeletePayeeOTPScreen,
  AddPayeeOTPScreen,
  MyPaymentHistory,
  ModifyScheduledTransferScreen,
  ConfirmScheduledPaymentScreen,
  ModifyScheduledTransferOTPScreen,
  ModifyScheduledPaymentSuccessScreen
} from '../screens/pay_people'
import { LoactionAccessScreen, ATMBranchLockerScreen, LocationMapView, FaqsScreen, SearchManuallyScreen } from '../screens/getStarted'
import CallUsScreen from '../screens/getStarted/CallUsScreen';
import ConfirmPINRegisterScreen from '../screens/getStarted/ConfirmPINRegisterScreen';
import CardCodeOTPScreen from '../screens/getStarted/CardCodeOTPScreen';
import CustomDrawer from '../screens/home/CustomDrawer';
import { AccountSummeryScreen, MiniStatementScreen, DetailedStatementEpassbookScreen, EStatementRequestScreen, EStatementViewScreen, ViewEpassbookStatementScreen, DepositAccountDetailsScreen, LoanAccountScreen, EStatementView } from '../screens/accouts'
import SettingsOptionsScreen from '../screens/settings/SettingsOptionsScreen';
import ChangemPINFirstScreen from '../screens/settings/change_mPIN/ChangemPINFirstScreen';
import ChangemPINSecondScreen from '../screens/settings/change_mPIN/ChangemPINSecondScreen';
import ChangemPINConfirmScreen from '../screens/settings/change_mPIN/ChangemPINConfirmScreen';
import TouchIDScreen from '../screens/settings/TouchIDScreen';
import TransactionLimitScreen from '../screens/settings/TransactionLimitScreen';
import AccountsOverviewScreen from '../screens/home/AccountsOverviewScreen';
import SetPrimaryAccountScreen from '../screens/settings/SetPrimaryAccountScreen';
import ProfileDetailsScreen from '../screens/home/ProfileDetailsScreen';
import SecurityQuestionScreen from '../screens/settings/SecurityQuestionScreen';
import NotificationScreen from '../screens/home/NotificationScreen';
import PrivacyPolicyScreen from '../screens/getStarted/Privacypolicy.screen';
import { UpdateProfileImageScreen, MyActivityList } from '../screens/home'
import PayBillsScreen from '../screens/home/PayBillsScreen';
import SecurityQuestionAnswersScreen from '../screens/settings/SecurityQuestionAnswersScreen';
import NewChequeBookScreen from '../screens/services/NewChequeBook';
import NewChequeBookScreenConfirm from '../screens/services/NewChequeBookConfirmScreen';
import { ChequeStatus, ChequeStatusDetail, ChequebookRequestOTPScreen, DebitCardList, DebitCardLimitScreen, ChequeIssuedByMe, ChequeleafScreen } from '../screens/services'
import { navigationRef } from './../utils/RootNavigation';
import FdInterestCalculatorScreen from '../screens/settings/FdInterestCalculatorScreen';

const Stack = createNativeStackNavigator();

export const AppStack = () => (
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator initialRouteName={SPLASH}>
      <Stack.Screen
        name={SPLASH}
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={AUTH.LOGIN}
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PRIVACY_POLICY}
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={GET_STARTED}
        component={GetStartedScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={CALL_US}
        component={CallUsScreen}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={REGISTER.REGISTER_OPTION}
        component={RegisterOptionScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={REGISTER.CODE_OTP}
        component={CardCodeOTPScreen}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={REGISTER.PIN_REGISTER}
        component={PINRegisterScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={REGISTER.CONFIRM_PIN_REGISTER}
        component={ConfirmPINRegisterScreen}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={REGISTER.PIN_SUCCESS}
        component={PINSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={AUTH.M_PIN_LOGIN}
        component={PINLoginScreen}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={HOME.DASHBOARD}
        component={HomeTabs}
        options={{
          headerShown: false,
          headerLeft: null,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name={HOME.ACCOUNTS}
        component={AccountsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={HOME.SCAN}
        component={ScanScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={HOME.LIMITS}
        component={LimitScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={REGISTER.TERMS}
        component={TermsAndConditionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.MENU}
        component={PayPeopleMenu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={SendMoneyUserInputScreen}
        name={PAY_PEOPLE.SEND_MONEY_PEOPLE}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={LoactionAccessScreen}
        name={LOCATION.ACCESS_LOCATION}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ATMBranchLockerScreen}
        name={LOCATION.ATM_BRANCH_LOCKER}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={LocationMapView}
        name={LOCATION.LOCATION_MAP_VIEW}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={FaqsScreen}
        name={FAQS}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={SearchManuallyScreen}
        name={LOCATION.SEARCH_MANUALLY}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={CustomDrawer}
        name={HOME.CUSTOM_DRAWER}
        options={{
          headerShown: false,
          headerLeft: null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        component={AccountSummeryScreen}
        name={ACCOUNTS.ACCOUNT_SUMMERY}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={MiniStatementScreen}
        name={ACCOUNTS.MINI_STATEMENT}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={DetailedStatementEpassbookScreen}
        name={ACCOUNTS.EPASS_BOOK_SELECTION}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={EStatementRequestScreen}
        name={ACCOUNTS.EPAS_BOOK_REQUEST}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={EStatementViewScreen}
        name={ACCOUNTS.VIEW_E_PASS_BOOK}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ViewEpassbookStatementScreen}
        name={ACCOUNTS.VIEW_E_PASS_BOOK_STATEMENT}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ACCOUNTS.VIEW_DEPOSIT_ACCOUNT_DETAILS}
        component={DepositAccountDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ACCOUNTS.LOAN_ACCOUNT_DETAILS}
        component={LoanAccountScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SETTINGS.HOME}
        component={SettingsOptionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.ADD_PAYEE}
        component={AddPayeeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.CONFIRM_ADD_PAYEE}
        component={ConfirmAddPayeeScreen}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={SETTINGS.CHANGE_MPIN_1}
        component={ChangemPINFirstScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SETTINGS.CHANGE_MPIN_2}
        component={ChangemPINSecondScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SETTINGS.CHANGE_MPIN_3}
        component={ChangemPINConfirmScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SETTINGS.TOUCH_ID}
        component={TouchIDScreen}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={SETTINGS.TRANSACTION_LIMIT}
        component={TransactionLimitScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.FUND_TRANSFER}
        component={FundTransferScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.BANK_SELECT}
        component={SearchBankList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.BRANCH_SELECT}
        component={SearchBranchList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ACCOUNTS.ACCOUNTS_OVERVIEW}
        component={AccountsOverviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.PAY_PEOPLE_SUCCESS}
        component={AddPayeeSuccess}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SETTINGS.SET_PRIMARY_ACCOUNT}
        component={SetPrimaryAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.PAY_PEOPLE_CONFIRM_FT}
        component={ConfirmPaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.PAY_PEOPLE_OTP_SCREEN}
        component={FundTransferOTPScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.PAY_DETAILS}
        component={PayeeDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.PAYEE_HISTORY}
        component={PayeeHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={HOME.SESSION_EXPIRED}
        component={SessionExpiredScreen}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={HOME.PROFILE_DETAILS}
        component={ProfileDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ACCOUNTS.VIEW_E_STATEMENT_VIEW}
        component={EStatementView}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SETTINGS.SECURITY_QUESTIONS}
        component={SecurityQuestionScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SETTINGS.FD_INTEREST_CALCULATOR}
        component={FdInterestCalculatorScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={HOME.NOTIFICATION}
        component={NotificationScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={HOME.PAY_BILLS}
        component={PayBillsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={PAY_PEOPLE.FT_SUCCESS_SCREEN}
        component={PaymentRecieptScreen}
        options={{
          headerShown: false,
          headerLeft: null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={HOME.UPDATE_PROFILE_IMAGE}
        component={UpdateProfileImageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.SHARE_WITH_AUTHORIZER_SCREEN}
        component={ShareWithAuthorizerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.AUTHORISATION_LIST}
        component={AuthoriztaionList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.AUTHORISATION_DETAIL}
        component={AuthorizationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.SCHEDULED_TRANSFERS}
        component={ScheduledTransferList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.FT_AUTH_OTP_SCREEN}
        component={FundTransferAuthOTPScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.SCHEDULED_TRANSFERS_DETAIL}
        component={ScheduleTransferDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.SCHEDULED_TRANSFERS_OTP}
        component={CancelScheduledPaymentOTPScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.HISTORY_DETAIL}
        component={HistoryDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.PAY_AUTH_SUCCESS}
        component={AuthrizationSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.RE_INITIATE_PAYMENT}
        component={ReInitiateFundTransferScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.CONFIRM_REINITIATE}
        component={ReinitiateConfirmScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.RE_INITIATE_OTP}
        component={ReInitiateOTPScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={SETTINGS.SECURITY_QUESTIONS_ANSWERS}
        component={SecurityQuestionAnswersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.DELETE_PAYEE_OTP}
        component={DeletePayeeOTPScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={PAY_PEOPLE.ADD_PAYEE_OTP}
        component={AddPayeeOTPScreen}
        options={{ headerShow: false }}
      />
      <Stack.Screen
        name={HOME.MY_ACTIVITY}
        component={MyActivityList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SERVICES.NEW_CHEQUE_BOOK}
        component={NewChequeBookScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SERVICES.NEW_CHEQUE_BOOK_CONFIRM}
        component={NewChequeBookScreenConfirm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SERVICES.NEW_CHEQUE_BOOK_SUCCESS_SCREEN}
        component={ChequeBookSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SERVICES.CHEQUE_STATUS}
        component={ChequeStatus}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SERVICES.CHEQUE_STATUS_DETAILS}
        component={ChequeStatusDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SERVICES.CHEQUE_BOOK_REQUEST_OTP}
        component={ChequebookRequestOTPScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SERVICES.DEBIT_CARD}
        component={DebitCardList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SERVICES.DEBIT_CARD_LIMIT}
        component={DebitCardLimitScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SERVICES.CHEQUE_ISSUED_BY_ME}
        component={ChequeIssuedByMe}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SERVICES.CHEQUE_LEAF}
        component={ChequeleafScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={PAY_PEOPLE.MY_PAYMENT_HISTORY}
        component={MyPaymentHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.MODIFY_SCHEDULED_TXN}
        component={ModifyScheduledTransferScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.MODIFY_SCHEDULED_TXN_CONFIRM}
        component={ConfirmScheduledPaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.MODIFY_SCHEDULED_TXN_OTP}
        component={ModifyScheduledTransferOTPScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAY_PEOPLE.MODIFY_SCHEDULED_TXN_SUCCESS}
        component={ModifyScheduledPaymentSuccessScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export const navigationOptions = {
  header: null,
  animationEnabled: false,
  swipeEnabled: false,
};
