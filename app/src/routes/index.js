const SPLASH = "SPLASH";


const GET_STARTED = "GetStarted";
const FAQS = "FAQS";
const CALL_US = "callUs";
const PRIVACY_POLICY = "PrivacyPolicy"

const LOCATION = {
  ACCESS_LOCATION: 'AccessLocation',
  ATM_BRANCH_LOCKER: 'ATMBranchLocker',
  LOCATION_MAP_VIEW: 'LocationMAPVIEW',
  SEARCH_MANUALLY: 'SearchManually'
}

const REGISTER = {
  REGISTER_OPTION: "RegisterOption",
  CODE_OTP: "CardCodeOTP",
  PIN_REGISTER: 'PINRegister',
  CONFIRM_PIN_REGISTER: 'ConfirmPINRegister',
  PIN_SUCCESS: 'PINSuccess',
  TERMS: 'TermsAndConditions'
}

const AUTH = {
  LOGIN: 'LoginScreen',
  M_PIN_LOGIN: 'PINLoginScreen',
  CHANGE_PASSWORD: 'ChangePassword',
  SIGNUP_SELECTION: "SignupSelection",
  REGISTER_STEP_1: "RegisterStep1",
  REGISTER_MOBILE_OTP: "RegisterMobileOTP",
  REGISTER_EMAIL: "RegisterEmail",
  REGISTER_EMAIL_OTP: "RegisterEmailOTP",
  REGISTER_TERMS: "RegisterTerms",
  REGISTER_ID_VERIFY: "RegisterIdVerify",
  REGISTER_FACE_LIVENESS: "RegisterFaceLiveness",
  REGISTER_ID_CAPTURE: "RegisterIdCapture",
  REGISTER_BASIC_DETAILS: "RegisterBasicDetails",
  REGISTER_FAMILY_DETAILS: "RegisterFamilyDetails",
  REGISTER_ADDRESS_DETAILS: "RegisterAddressDetails",
  REGISTER_SIGNATURE_CAPTURE: "RegisterSignatureCapture",
  REGISTER_REVIEW: "RegisterReview",
  REGISTER_FINAL_OTP: "RegisterFinalOtp",
  REGISTER_SUCCESSS: "RegisterSuccess",
  OTP: 'LoginOTP',
  REGISTER_ACCOUNT_FEATURES_SCREEN: "RegisterAccountFeatures",
};


const HOME = {
  DASHBOARD: "Dashboard",
  CUSTOM_DRAWER: 'CustomDrawer',
  ACCOUNTS: 'Accounts',
  SCAN: "Scan",
  LIMITS: 'Limits',
  MYREQUEST: "MyRequest",
  SESSION_EXPIRED: "SessionExpiredScreen",
  PROFILE_DETAILS: 'ProfileDetails',
  NOTIFICATION: "NotificationScreen",
  UPDATE_PROFILE_IMAGE: "UpdateProfileImage",
  PAY_BILLS: 'PayBills',
  MY_ACTIVITY: 'MyActivity',
}

const SERVICES = {
  NEW_CHEQUE_BOOK: "NewChequeBookScreen",
  NEW_CHEQUE_BOOK_CONFIRM: "NewChequeBookScreenConfirm",
  NEW_CHEQUE_BOOK_SUCCESS_SCREEN: "ChequeBookSuccessScreen",
  CHEQUE_STATUS: "CHEQUE_STATUS",
  CHEQUE_STATUS_DETAILS: "CHEQUE_STATUS_DETAILS",
  CHEQUE_BOOK_REQUEST_OTP: "CHEQUE_BOOK_REQUEST_OTP",
  DEBIT_CARD: "DEBIT_CARD",
  DEBIT_CARD_LIMIT: 'DEBIT_CARD_LIMIT',
  DEPOSITED_BY_ME: 'DEPOSITED_BY_ME',
  CHEQUE_ISSUED_BY_ME: 'CHEQUE_ISSUED_BY_ME',
  CHEQUE_LEAF: 'CHEQUE_LEAF'
}

const PAY_PEOPLE = {
  MENU: 'PayPeopleMenu',
  SEND_MONEY_PEOPLE: 'SendMoneyUserInputScreen',
  ADD_PAYEE: 'AddPayee',
  CONFIRM_ADD_PAYEE: 'ConfirmAddPayee',
  PAY_DETAILS: 'PayeeDetailsScreen',
  PAYEE_HISTORY: 'PayeeHistory',
  ADD_PAYEE: 'AddPayee',
  CONFIRM_ADD_PAYEE: 'ConfirmAddPayee',
  FUND_TRANSFER: 'FundTransfer',
  BRANCH_SELECT: 'BranchSelect',
  BANK_SELECT: 'BankSelect',
  PAY_PEOPLE_SUCCESS: 'PayPeopleSuccess',
  PAY_PEOPLE_CONFIRM_FT: 'FundTransferConfirm',
  PAY_PEOPLE_OTP_SCREEN: 'PayPeopleOTPScreen',
  FT_SUCCESS_SCREEN: 'FTSuccessScreen',
  SHARE_WITH_AUTHORIZER_SCREEN: 'ShareWithAuthorizerScreen',
  AUTHORISATION_LIST: 'Authorisationlist',
  AUTHORISATION_DETAIL: 'AuthorisationDetail',
  SCHEDULED_TRANSFERS: 'ScheduledTransfers',
  FT_AUTH_OTP_SCREEN: 'FtAuthOtpScreen',
  SCHEDULED_TRANSFERS_DETAIL: 'ScheduledTransfersDetail',
  SCHEDULED_TRANSFERS_OTP: 'ScheduledTransfersOtp',
  HISTORY_DETAIL: 'HistoryDetail',
  PAY_AUTH_SUCCESS: 'PayAuthSuccess',
  RE_INITIATE_PAYMENT: 'ReInitiatePayment',
  CONFIRM_REINITIATE: 'ConfirmReinitiate',
  RE_INITIATE_OTP: 'ReInitiateOtp',
  DELETE_PAYEE_OTP: 'DeletePayeeOtp',
  ADD_PAYEE_OTP: 'AddPayeeOtp',
  MY_PAYMENT_HISTORY: ' MyPaymentHistory',
  MODIFY_SCHEDULED_TXN:'ModifySchduledTxn',
  MODIFY_SCHEDULED_TXN_CONFIRM:'ModifySchduledTxnConfirm',
  MODIFY_SCHEDULED_TXN_OTP:'ModifySchduledTxnOtp',
  MODIFY_SCHEDULED_TXN_SUCCESS:'ModifySchduledTxnSuccess',
}
const ACCOUNTS = {
  ACCOUNTS_OVERVIEW: 'AccountsOverview',
  ACCOUNT_SUMMERY: 'AccountSummary',
  MINI_STATEMENT: 'MiniStatement',
  EPASS_BOOK_SELECTION: 'EPassbookSelection',
  EPAS_BOOK_REQUEST: 'EPassbookRequest',
  VIEW_E_PASS_BOOK: 'ViewEpassbook',
  VIEW_E_PASS_BOOK_STATEMENT: 'ViewEpassbookStatement',
  VIEW_DEPOSIT_ACCOUNT_DETAILS: 'ViewDepositAccountDetails',
  LOAN_ACCOUNT_DETAILS: 'LoanAccountDetails',
  VIEW_E_STATEMENT_VIEW: 'ViewEstatementStatementView'

}


const SETTINGS = {
  HOME: 'SettingsOptions',
  CHANGE_MPIN_1: 'ChangemPINFirst',
  CHANGE_MPIN_2: 'ChangemPINSecond',
  CHANGE_MPIN_3: 'ChangemPINConfirm',
  TOUCH_ID: 'TouchID',
  TRANSACTION_LIMIT: 'TransactionLimit',
  SET_PRIMARY_ACCOUNT: 'SetPrimaryAccount',
  SECURITY_QUESTIONS: 'SecurityQuestion',
  SECURITY_QUESTIONS_ANSWERS: 'SecurityQuestionAnswers',
  FD_INTEREST_CALCULATOR:'FdInterestCalculator'
}

export {
  AUTH,
  SPLASH,
  GET_STARTED,
  REGISTER,
  HOME,
  PAY_PEOPLE,
  LOCATION,
  FAQS,
  CALL_US,
  ACCOUNTS,
  SETTINGS,
  PRIVACY_POLICY,
  SERVICES,

};
