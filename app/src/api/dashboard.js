import * as CryptoJS from "crypto-js";
import http from "./api";
import config from "./constants";
import { store } from "../store";
import { SET_USER, SET_AUTH_TOKEN, SET_ACC_DETAILS, SET_MPIN_DATA, SET_ACC_REFRESH } from "../store/constants";
import { NetworkInfo } from 'react-native-network-info';
import { getUniqueId } from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';
const AES_SECRET_KEY = CryptoJS.enc.Utf8.parse(config.constants.NEO_KEY);
const GCM_SECRET_KEY = CryptoJS.enc.Utf8.parse(config.constants.GCM_KEY);
import { Platform } from 'react-native'
import { setRefreshAccdata } from "../store/actions/user.action";
// const encryptAES = (text) => {
//   return CryptoJS.AES.encrypt(text, AES_SECRET_KEY, {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   }).toString();
// }
const encryptAES = (text) => {
  var data = text;
  var key = AES_SECRET_KEY;
  var iv = GCM_SECRET_KEY;
  var encrypted = CryptoJS.AES.encrypt(
    data,
    key,
    {
      iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
    });
  //console.log('encrypted: ' + encrypted);

  //var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 });
  //console.log('decrypted: ' + decrypted.toString(CryptoJS.enc.Utf8));
  return encrypted.toString()
}
const getAllAccounts = async () => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_ACCOUNTS,
    {
      userName: user.profile.userName,
      accountType: 'S',
      requestId: "ACCOUNTDETAILS",
    },
    {}
  );
  //store.dispatch(setRefreshAccdata(false))
  store.dispatch({ type: SET_ACC_DETAILS, payload: response.data.accountSummaryDetails });


  return response.data;
};

const getStatementDetailsApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_ACCOUNTS_STATEMENT,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "MINISTATEMENT",
    },
    {}
  );
  return response.data;
};

const getStatementFullStatementApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_ACCOUNTS_FULL_STATEMENT,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "FULLSTATEMENT",
    },
    {}
  );
  return response.data;
};
const getAllCurrency = async () => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_CURRENCY,
    {
      userName: user.profile.userName,
      module: "",
      requestId: "CURRENCYLIST",
    },
    {}
  );
  store.dispatch({ type: SET_USER, payload: { ...user.profile, ...response.data } });

  return response.data;
};


const getProfileImageApi = async () => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_PROFILE_IMAGE,
    {
      userName: user.profile.userName,
      requestId: "USERPROFILE",
    },
    {}
  );

  store.dispatch({ type: SET_USER, payload: { ...user.profile, ...response.data } });

  return response.data;
};
const getAllProduct = async () => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_PRODUCT,
    {
      userName: user.profile.userName,
      module: "",
      requestId: "TERMDEPOSITINTERESTRATES",
    },
    {}
  );
  return response.data;
};
const createTdgenerateOTPApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.CREATE_TD_OTP_GENERATE,
    {
      ...request,
      userName: user.profile.userName,
      module: "TERM_DEPOSITE",
      requestId: "CREATETD",
    },
    {}
  );
  return response.data;
};
const createTdConfirmApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.CREATE_TD_CONFIRM,
    {
      ...request,
      userName: user.profile.userName,
      module: "TERM_DEPOSITE",
      requestId: "CREATETDCONFIRM",
    },
    {}
  );
  return response.data;
};

const tdCalcApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.DEPOSIT_CALC,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "LOANSCALCULATOR",
      accountType: "D",
    },
    {}
  );
  return response.data;
};

const getDepositAccounts = async (accountType) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_ACCOUNTS,
    {
      userName: user.profile.userName,
      accountType: accountType ? accountType : 'D',
      requestId: "ACCOUNTDETAILS",
    },
    {}
  );
  return response.data;
};
const getDepositAccountDetail = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.DEPOSIT_ACCOUNT_DETAILS,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "DEPOSITACCOUNTDETAILS",
    },
    {}
  );
  return response.data;
};

const getPortfolioApi = async () => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_PORTFOLIO,
    {
      userName: user.profile.userName,
      module: "",
      requestId: "GETBALANCES",
    },
    {}
  );
  return response.data;
};


const getProfileDetailsApi = async () => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_PROFILE_DETAILS,
    {
      userName: user.profile.userName,
      requestId: "USERPROFILE",
    },
    {}
  );

  return response.data;
};


const applyMicroLoanApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.APPLY_MICRO_LOAN,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "GETBALANCES",

    },
    {}
  );

  return response.data;
};


const addAccountVerfiyApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.ADD_ACCOUNT,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "CREATEACCOUNTVERIFY",
      customerNo: user.profile.customerNumber,
      custidnumber: user.profile.custidnumber
    },
    {}
  );

  return response.data;
};

const addAccountConfirmApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.ADD_ACCOUNT_CONFIRM,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "CREATEACCOUNTVERIFY",
      customerNo: user.profile.customerNumber,
      custidnumber: user.profile.custidnumber
    },
    {}
  );

  return response.data;
};


const updateProfileImageApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.PROFILE_IMAGE_UPDATE,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "GETPROFILEIMAGE",
    },
    {}
  );

  return response.data;
};

const getExchangeRatesApi = async () => {
  const response = await http.postExchange(
    config.apiRoute.EXCHANGE_RATES,
    {
      userName: "DEFAULT",
      requestId: "CROSSCURRENCYRATES",
      module: "Information"
    },
    {}
  );

  return response.data;
};

const getTransactionLimitApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_TRANSACTION_LIMIT,
    {
      ...request,
      requestId: "CUSTOMERTXNLIST",
    },
    {}
  );

  return response.data;
};

const updateTransactionLimitApi = async (request) => {
  const response = await http.post(
    config.apiRoute.UPDATE_TRANSACTION_LIMIT,
    {
      ...request,
      requestId: "UPDATECUSTOMERTXNLIST",
    },
    {}
  );

  return response.data;
};

const changeMpinApi = async (request) => {

  const encryptedOldPassword = encryptAES(request.oldPassword);
  const encryptedNewPassword = encryptAES(request.newPassword);

  const response = await http.post(
    config.apiRoute.CHANGE_MPIN,
    {
      oldPassword: encryptedOldPassword,
      newPassword: encryptedNewPassword,
      requestId: "CHANGEMPIN",
    },
    {}
  );
  store.dispatch({ type: SET_MPIN_DATA, payload: encryptAES(request.newPassword) });
  return response.data;
};


const setPrimaryAccountApi = async (request) => {
  const response = await http.post(
    config.apiRoute.SET_PRIMARY_ACCOUNT,
    {
      ...request,
      requestId: "GET_ACC_BAL",
    },
    {}
  );

  return response.data;
};


const getPayeeListApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_PAYEE_LIST,
    {
      ...request,
      module: "BENEFICIARY",
      requestId: "PAYEE_LIST",
    },
    {}
  );

  return response.data;
};


const getFavListApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_FAV_LIST,
    {
      ...request,
      module: "BENEFICIARY",
      requestId: "PAYEE_FAV",
    },
    {}
  );

  return response.data;
};

const getContactListApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_CONTACT_LIST,
    {
      ...request,
      module: "BENEFICIARY",
      requestId: "GET_CONTACTS_LIST",
    },
    {}
  );

  return response.data;
};
const getBankListApi = async () => {
  const response = await http.post(
    config.apiRoute.GET_BANK_DETAILS,
    {
      "requestId": "GETALLBANKS",
      "module": "BENEFICIARY",
    },
    {}
  );

  return response.data;
};
const getBranchList = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_BRANCH_DETAILS,
    {
      "requestId": "GET_BRANCH_LIST",
      "module": "BENEFICIARY",
      ...request,
    },
    {}
  );

  return response.data;
};
const confirmAddPayee = async (request) => {
  const response = await http.post(
    config.apiRoute.ADD_PAYEE_CONFIRM,
    {
      "requestId": "PAYEE_ADD",
      "module": "BENEFICIARY",
      ...request,
    },
    {}
  );

  return response.data;
};
const verifyAddPayee = async (request) => {
  const response = await http.post(
    config.apiRoute.ADD_PAYEE_VERIFY,
    {
      "requestId": "PAYEE_ADD",
      "module": "BENEFICIARY",
      ...request,
    },
    {}
  );

  return response.data;
};
const getDeleteVerifyApi = async (request) => {
  const response = await http.post(
    config.apiRoute.DELETE_PAYEE,
    {
      ...request,
      "requestId": "PAYEE_REMOVE",
      "module": "BENEFICIARY",
    },
    {}
  );

  return response.data;
};
const getDeleteConfirmApi = async (request) => {
  const response = await http.post(
    config.apiRoute.DELETE_PAYEE_CONFIRM,
    {
      ...request,
      "requestId": "PAYEE_REMOVE",
      "module": "BENEFICIARY",
    },
    {}
  );

  return response.data;
};
const getAddToFavuoritApi = async (request) => {
  const response = await http.post(
    config.apiRoute.ADD_PAYEE_FAVIORIT,
    {
      ...request,
      "requestId": "PAYEE_REMOVE",
      "module": "BENEFICIARY",
    },
    {}
  );

  return response.data;
};
const getTransferOptions = async (request) => {
  const response = await http.post(
    config.apiRoute.TRANSFER_OPTIONS,
    {
      ...request,
      "requestId": "FUNDTRANSFER",
      "module": "TRANSFEROPTIONS",
    },
    {}
  );

  return response.data;
};
const FTVerifyApiCall = async (request) => {
  const response = await http.post(
    config.apiRoute.FT_VERIFY_CALL,
    {

      "requestId": "FTVERIFYIAT",
      "module": "FUNDTRANSFER",
      ...request,
    },
    {}
  );
  return response.data;
}
const FTConfirmApiCall = async (request) => {
  const response = await http.post(
    config.apiRoute.FT_CONFIRM_CALL,
    {
      "requestId": "FTVERIFYIAT",
      "module": "FUNDTRANSFER",
      ...request,
    },
    {}
  );
  return response.data;
}
const getBankDetailsByIFSC = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_IFSC_CODE,
    {
      "requestId": "PAYEE_ADD",
      "module": "BENEFICIARY",
      ...request,
    },
    {}
  );

  return response.data;
};

const getPaymentListApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_PAYMENT_RECORDS,
    {
      ...request,
      module: "FUNDTRANSFER",
      requestId: "TRANSFERPENDINGRECORDS",
    },
    {}
  );

  return response.data;
};
const getScheduledTransferListApi = async (request) => {
  const response = await http.post(
    config.apiRoute.SCHEDULED_TRANSFER,
    {
      ...request,
      module: "SCHEDULEDTRANSFERS",
      requestId: "VIEW_SCHEDULED_TRANSFERS",
    },
    {}
  );

  return response.data;
};
const getShareWithauthorizer = async (request) => {
  const response = await http.post(
    config.apiRoute.SEND_AUTH_USERS,
    {
      ...request,
      "module": "FUNDTRANSFER",
      "requestId": "VIEW_SCHEDULED_TRANSFERS",
    },
    {}
  );

  return response.data;
};
const paymentAuthVerify = async (request) => {
  const response = await http.post(
    config.apiRoute.PAYMENT_AUTH_VERIFY,
    {
      ...request,
      "module": "FUNDTRANSFER",
      "requestId": "FUNDTRANSFERAUTHVERIFY",
    },
    {}
  );

  return response.data;
};
const paymentAuthConfirm = async (request) => {
  const response = await http.post(
    config.apiRoute.PAYMENT_AUTH_CONFIRM,
    {
      ...request,
      "module": "FUNDTRANSFER",
      "requestId": "FUNDTRANSFERAUTHCONFIRM",
    },
    {}
  );

  return response.data;
};
const cancelScheduledTransfer = async (request) => {
  const response = await http.post(
    config.apiRoute.CANCEL_SCHEDULED_TRANSFER,
    {
      ...request,
      "module": "SCHEDULEDTRANSFERS",
      "requestId": "CANCEL_SCHEDULED_TRANSFERS",
    },
    {}
  );

  return response.data;
};
const cancelScheduledTransferConfirm = async (request) => {
  const response = await http.post(
    config.apiRoute.CANCEL_SCHEDULED_TRANSFER_CONFIRM,
    {
      ...request,
      "module": "SCHEDULEDTRANSFERS",
      "requestId": "CANCEL_SCHEDULED_TRANSFERS",
    },
    {}
  );

  return response.data;
};
const getHistoryListApi = async (request) => {
  const response = await http.post(
    config.apiRoute.PAYMENT_HISTORY,
    {
      ...request,
      module: "FUNDTRANSFER",
      requestId: "TRANSFERPENDINGRECORDS",

    },
    {}
  );

  return response.data;
};
const getAddContactFavourityApi = async (request) => {
  const response = await http.post(
    config.apiRoute.ADD_CONTACT_FAVOURIT,
    {
      ...request,
      module: "BENEFICIARY",
      "requestId": "ADD_CONTACT_FAV",
    },
    {}
  );

  return response.data;
};
const downlaodPaymentReceipt = async (request) => {
  const { auth } = store.getState()
  const dirs = RNFetchBlob.fs.dirs
  let ipv4Address = '0.0.0.0'
  console.log(request)
  var currentIPAddress = await NetworkInfo.getIPV4Address().then(ipv4Address => {
    ipv4Address = ipv4Address;
    //store.dispatch({ type: SET_IP_ADDRESS, payload: ipv4Address });
  });
  let deviceId = ''
  await getUniqueId().then(data => {
    deviceId = data
  })
  const body = {
    ...request,
    channelType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    ipAddress: ipv4Address,
    language: 'en',
    deviceId: deviceId,
    userName: deviceId,
    "module": "FUNDTRANSFER",
    "requestId": "RECEIPTDOWNLOAD",

  }
  console.log(JSON.stringify(body))
  const result = await RNFetchBlob.config({
    //path: request.format === "PDF" ? dirs.DownloadDir + `/${request.refNo}.pdf` : dirs.DownloadDir + `/${request.refNo}.jpg`,
    path: request.format === "PDF" ? dirs.CacheDir + `/${request.refNo}.pdf` : dirs.CacheDir + `/${request.refNo}.jpg`,
    useDownloadManager: true,
    // fileCache: true,
  }).fetch(
    'POST',
    config.constants.BASE_URL +
    config.apiRoute.SAVE_PAYMENT_RECEIPT,
    {
      Authorization: `Bearer ${auth.authToken}`,
      'Content-type': 'application/json',
    },
    JSON.stringify(body)
  )
  return result.path()
}
const getTopFiveFavouritesApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_TOP_FIVE_FAVOURITES,
    {
      ...request,
      module: "BENEFICIARY",
      requestId: "GET_BRANCH_LIST",
    },
    {}
  );

  return response.data;
};
const reInitiateVerifyApiCall = async (request) => {
  const response = await http.post(
    config.apiRoute.RE_INITIATE_VERIFY,
    {

      "requestId": "FTVERIFYIAT",
      "module": "FUNDTRANSFER",
      ...request,
    },
    {}
  );
  return response.data;
}
const ReInitiateConfirmApiCall = async (request) => {
  const response = await http.post(
    config.apiRoute.RE_INITIATE_CONFIRM,
    {
      "requestId": "FTVERIFYIAT",
      "module": "FUNDTRANSFER",
      ...request,
    },
    {}
  );
  return response.data;
}


const enableTouchIDApi = async (request) => {
  const response = await http.post(
    config.apiRoute.ENABLE_TOUCH_ID,
    {
      ...request,
      requestId: "TOUCHID",
      module: "TOUCHID",
    },
    {}
  );

  return response.data;
};
const downlaodAccountStatement = async (request) => {
  const { auth } = store.getState()
  const dirs = RNFetchBlob.fs.dirs
  let ipv4Address = '0.0.0.0'
  var currentIPAddress = await NetworkInfo.getIPV4Address().then(ipv4Address => {
    ipv4Address = ipv4Address;
    //store.dispatch({ type: SET_IP_ADDRESS, payload: ipv4Address });
  });
  let deviceId = ''
  await getUniqueId().then(data => {
    deviceId = data
  })
  const body = {
    ...request,
    channelType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    ipAddress: ipv4Address,
    language: 'en',
    deviceId: deviceId,
    userName: deviceId,
    "module": "FUNDTRANSFER",
    "requestId": "DONWLOAD_STATMENT",

  }
  console.log(JSON.stringify(body))
  try {
    const result = await RNFetchBlob.config({
      //path: dirs.DownloadDir + `/${request.accountNo}.pdf`,
      path: dirs.CacheDir + `/${request.accountNo}.pdf`,
      useDownloadManager: true,
      fileCache: true,
      // addAndroidDownloads: {
      //   useDownloadManager: true,
      //   title: 'Bharat Bank',
      //   description: '',
      //   mime: 'application/pdf',
      //   // mediaScannable : true,
      //   notification: true,
      // }
    }).fetch(
      'POST',
      config.constants.BASE_URL +
      config.apiRoute.DOWNLOAD_STATEMENT,
      {
        Authorization: `Bearer ${auth.authToken}`,
        'Content-type': 'application/json',
      },
      JSON.stringify(body)
    )
    return result.path()
  }
  catch (error) {
    return Promise.reject(error)
  }

}
const getFavouritListApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_FAVOURITE,
    {
      ...request,
      "module": "BENEFICIARY",
      "requestId": "FAV_LIST_ALL",
    },
    {}
  );
  return response.data;
}
const getMyActivityApi = async (request) => {
  const response = await http.post(
    config.apiRoute.MY_ACTIVITY,
    {
      ...request,
      "module": "PROFILE",
      "requestId": "MY_ACTIVITY",
    },
    {}
  );
  return response.data;
}
const getAccountFavourityApi = async (request) => {
  const response = await http.post(
    config.apiRoute.ADD_ACCOUNT_FAVOURIT,
    {
      ...request,
      // userName: user.profile.userName,
      module: "BENEFICIARY",
      "requestId": "ADD_ACCOUNT_FAV",
    },
    {}
  );

  return response.data;
};
const resendOtpApiCall = async (request) => {
  const response = await http.post(
    config.apiRoute.RESEND_OTP_CALL,
    {

      "requestId": "FTVERIFYIAT",
      "module": "FUNDTRANSFER",
      ...request,
    },
    {}
  );
  return response.data;
}
const getMyHistoryListApi = async (request) => {
  const response = await http.post(
    config.apiRoute.MY_PAYMENT_HISTORY,
    {
      ...request,
      "module": "BENEFICIARY",
      "requestId": "MY_PAYMENT_LIST",

    },
    {}
  );
  return response.data;
}
const modifyOrCancelScheduledTxnCall = async (request) => {
  const response = await http.post(
    config.apiRoute.CANCEL_MODIFY_SCHEDULED_TXN,
    {

      "requestId": "MODIFY_CANCEL_VERIFY",
      "module": "FUNDTRANSFER",
      ...request,
    },
    {}
  );
  return response.data;
}
const modifyOrCancelScheduledTxnConfirmCall = async (request) => {
  const response = await http.post(
    config.apiRoute.CONFIRM_CANCEL_MODIFY_SCHEDULED_TXN,
    {

      "requestId": "MODIFY_CANCEL_CONFIRM",
      "module": "FUNDTRANSFER",
      ...request,
    },
    {}
  );
  return response.data;
}
const Home = {
  getAllAccounts,
  getStatementDetailsApi,
  getStatementFullStatementApi,
  getAllCurrency,
  getProfileImageApi,
  getAllProduct,
  createTdgenerateOTPApi,
  createTdConfirmApi,
  getDepositAccounts,
  getDepositAccountDetail,
  getPortfolioApi,
  getProfileDetailsApi,
  applyMicroLoanApi,
  addAccountVerfiyApi,
  addAccountConfirmApi,
  updateProfileImageApi,
  tdCalcApi,
  getExchangeRatesApi,
  getTransactionLimitApi,
  updateTransactionLimitApi,
  changeMpinApi,
  setPrimaryAccountApi,
  getPayeeListApi,
  getFavListApi,
  getContactListApi,
  getBankListApi,
  getBranchList,
  confirmAddPayee,
  verifyAddPayee,
  getDeleteVerifyApi,
  getDeleteConfirmApi,
  getAddToFavuoritApi,
  getTransferOptions,
  FTVerifyApiCall,
  FTConfirmApiCall,
  getBankDetailsByIFSC,
  getPaymentListApi,
  getScheduledTransferListApi,
  getShareWithauthorizer,
  paymentAuthConfirm,
  paymentAuthVerify,
  cancelScheduledTransfer,
  cancelScheduledTransferConfirm,
  getHistoryListApi,
  getAddContactFavourityApi,
  downlaodPaymentReceipt,
  getTopFiveFavouritesApi,
  reInitiateVerifyApiCall,
  ReInitiateConfirmApiCall,
  enableTouchIDApi,
  downlaodAccountStatement,
  getFavouritListApi,
  getMyActivityApi,
  getAccountFavourityApi,
  resendOtpApiCall,
  getMyHistoryListApi,
  modifyOrCancelScheduledTxnCall,
  modifyOrCancelScheduledTxnConfirmCall
};

export default Home;
