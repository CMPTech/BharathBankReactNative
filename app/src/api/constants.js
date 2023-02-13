const constants = {
  NEO_KEY: '20E38214tC181205',
  GCM_KEY: 'BCBINDIAVER12022',
  // BASE_URL: 'http://223.31.79.93:9090/apigateway',//PUBLIC IP
  //BASE_URL: 'http://114.143.50.155:9090/apigateway',//TATA IP

  BASE_URL: 'http://nexanew.bharatbank.com:9090/apigateway',//TATA IP

};

const apiRoute = {

  //Get Started Screen
  GET_META_DATA: "/smart-service/public/metadata",
  GET_FAQ_DATA: "/smart-service/public/userfaq",
  GET_APP_DATA: "/smart-service/public/userRegistration/findPage",
  LOCATION: '/smart-service/public/getLocations ',
  REGISTRATION_VERFIY: "/smart-service/public/userRegistration/verify",
  REGISTRATION_CONFIRM: "/smart-service/public/userRegistration/confirm",
  CREATE_MPIN: "/smart-service/public/userRegistration/validateMPINDetails",
  GET_NEAR_BY_LOCATION: '/smart-service/public/getLocationsNearMe',
  UPDATE_MPIN: '/smart-service/public/userRegistration/updateMPINDetails',

  //login
  LOGIN: "/smart-service/public/login",


  //accounts

  GET_ALL_ACCOUNTS: "/smart-service/accounts/getAll",
  GET_CASA_ACCOUNTS: "/smart-service/accounts/getProfileAccounts",

  GET_MINISTATEMENTS: "/smart-service/accounts/getAccountMiniStatement",
  GET_FULL_STATEMENT: '/smart-service/accounts/fullStatementPagination',


  GET_TRANSACTION_LIMIT: '/smart-service/customerTxn/getCustomerTxnList',
  UPDATE_TRANSACTION_LIMIT: '/smart-service/customerTxn/updateCustomerTxnLimit',
  UPDATE_TRANSACTION_LIMIT: '/smart-service/customerTxn/updateCustomerTxnLimits',

  CHANGE_MPIN: '/smart-service/profile/changeMpin',

  SET_PRIMARY_ACCOUNT: '/smart-service/accounts/setPrimaryAccount',
  ADD_PAYEE_VERIFY: '/smart-service/payee/addPayeeVerify',
  ADD_PAYEE_CONFIRM: '/smart-service/payee/addPayeeConfirm',

  GET_TERMS_LINK: "/smart-service/public/gettermsAndConditions",


  LOGOUT: "/smart-service/logout",

  GET_PAYEE_LIST: "/smart-service/payee/getAllPayee",
  GET_CONTACT_LIST: "/smart-service/payee/payContactList",
  GET_FAV_LIST: "/smart-service/payee/getAllPayee",
  GET_BANK_DETAILS: '/smart-service/payee/getBankDetails',
  GET_BRANCH_DETAILS: '/smart-service/payee/getBranchList',
  GET_SECURITY_QUESTIONS: "/smart-service/public/securityquestions",
  SET_SECURITY_QUESTIONS: "/smart-service/profile/setQestions",
  GET_SECURITY_QUESTIONS_ANSWERS: "/smart-service/profile/getQestionsAndAnswers",

  DELETE_PAYEE: "/smart-service/payee/deletePayee",
  DELETE_PAYEE_CONFIRM: '/smart-service/payee/deletePayeeConfirm',
  ADD_PAYEE_FAVIORIT: '/smart-service/payee/addFavouritePayee',
  TRANSFER_OPTIONS: '/smart-service/fundtransfer/transferOptions',

  GET_PROFILE_DETAILS: "/smart-service/profile/profileDetails",

  GET_PRIVACY_POLICY: "/smart-service/public/getprivacypolicy",
  FT_VERIFY_CALL: '/smart-service/fundtransfer/verify',
  FT_CONFIRM_CALL: '/smart-service/fundtransfer/confirm',
  UPDATE_PROFILE_IMAGE: '/smart-service/profile/updateProfileImage',
  GET_IFSC_CODE: '/smart-service/payee/getIfscCode',
  GET_PAYMENT_RECORDS: '/smart-service/fundtransfer/getPendingRecords',
  SCHEDULED_TRANSFER: '/smart-service/fundtransfer/viewScheduledTransfers',
  SEND_AUTH_USERS: '/smart-service/fundtransfer/sendAuthUsers',
  PAYMENT_AUTH_VERIFY: '/smart-service/fundtransfer/authVerify',
  PAYMENT_AUTH_CONFIRM: '/smart-service/fundtransfer/authConfirm',
  CANCEL_SCHEDULED_TRANSFER: '/smart-service/fundtransfer/cancelScheduledTransferVerify',
  CANCEL_SCHEDULED_TRANSFER_CONFIRM: '/smart-service/fundtransfer/cancelScheduledTransferConfirm',
  PAYMENT_HISTORY: '/smart-service/fundtransfer/paymentHistory',
  ADD_CONTACT_FAVOURIT: "/smart-service/payee/addFavouriteContact",
  SAVE_PAYMENT_RECEIPT: '/smart-service/receipt/download',
  EDIT_REMARKS: '/smart-service/accounts/editMinistatement',
  EDIT_ACCOUNT_SHORTNAME: '/smart-service/accounts/editAccShortName',
  GET_TOP_FIVE_FAVOURITES: '/smart-service/payee/getTopFiveRecords',
  RE_INITIATE_VERIFY: '/smart-service/fundtransfer/reSubmitTransferVerify',
  RE_INITIATE_CONFIRM: '/smart-service/fundtransfer/reSubmitTransferConfirm',

  ENABLE_TOUCH_ID: '/smart-service/profile/touchIdAlert',
  DOWNLOAD_STATEMENT: '/smart-service/receipt/statement',
  GET_FAVOURITE: '/smart-service/payee/getFavouriteList',
  MY_ACTIVITY: '/smart-service/profile/getMyActivity',
  GET_CHEQUE_STATUS: '/smart-service/cheque/chequeBookChequesStatus',
  CHEQUE_DETAILS_API: '/smart-service/cheque/chequeDetails',
  LEVES_LIST: '/smart-service/cheque/leavesList',
  CHEQUE_BOOK_VERIFICATION: '/smart-service/cheque/chequeBookVerification',
  CHEQUE_BOOK_CONFIRMATION: '/smart-service/cheque/chequeBookConfirmation',
  DEBIT_CARD: '/smart-service/debitCard/cardDetails',
  ADD_ACCOUNT_FAVOURIT: '/smart-service/payee/addFavOwnAccount',
  RESEND_OTP_CALL: '/smart-service/userActivity/resendOtp',
  CHEQUE_ISSUED_BY_ME: '/smart-service/cheque/chqIssuedByMeSummary',
  CHEQUE_DEPOSITED_BY_ME: '/smart-service/cheque/chqDepositedByMeDetails',
  CHEQUE_BOOK_REMARKS: '/smart-service/cheque/chequeBookRemarks',
  CHEQUE_BOOK_PASSED_DETAIL: '/smart-service/cheque/getPassedChqDtls',
  CHEQUE_BOOK_STOPED_DETAIL: '/smart-service/cheque/getStopChqDtlInq',
  STOP_CHEQUE_LEAVE_REQUEST: '/smart-service/cheque/stopCheque',
  STOP_CHEQUE_REASONS: '/smart-service/cheque/getStopChequeReasonList',
  MY_PAYMENT_HISTORY: '/smart-service/payee/myPayments',
  CANCEL_MODIFY_SCHEDULED_TXN: '/smart-service/fundtransfer/modifyOrCancelScheduledTransferVerify',
  CONFIRM_CANCEL_MODIFY_SCHEDULED_TXN: '/smart-service/fundtransfer/modifyOrCancelScheduledTransferConfirm',
  CHEQUE_ISSUED_BY_ME_DETAILS: '/smart-service/cheque/chqIssuedByMeDetails'
};

const config = {
  constants,
  apiRoute,
};

export default config;
