import * as CryptoJS from "crypto-js";
import http from "./api";
import config from "./constants";
import { store } from "../store";
import { SET_USER, SET_AUTH_TOKEN, SET_META_DATA, SET_MPIN_DATA, SET_SELECTED_RANDOM_KEY, RESET_AUTH, RESET_USER } from "../store/constants";

const AES_SECRET_KEY = CryptoJS.enc.Utf8.parse(config.constants.NEO_KEY);
const GCM_SECRET_KEY = CryptoJS.enc.Utf8.parse(config.constants.GCM_KEY);

// const encryptAES = (text) => {
//   return CryptoJS.AES.encrypt(text, AES_SECRET_KEY, {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   }).toString();
// }



const encryptAES1 = (text) => {

  var truncHexKey = CryptoJS.SHA256(AES_SECRET_KEY).toString().substr(0, 32); // hex encode and truncate
  var truncHexIV = CryptoJS.SHA256(GCM_SECRET_KEY).toString().substr(0, 16); // hex encode and truncate 
  var key = CryptoJS.enc.Utf8.parse(truncHexKey);
  var iv = CryptoJS.enc.Utf8.parse(truncHexIV);
  var ciphertext = CryptoJS.AES.encrypt(text, key, { iv: iv }); // default values: CBC, PKCS#7 padding

  return ciphertext.toString()
}


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


//---------------------------------------------------
const getMetaDataApi = async () => {
  // const response = await http.post(
  //  config.apiRoute.GET_META_DATA,
  //  {
  //    userName: "SUPERADMIN",
  //    requestId: "META_DATA",
  //  },
  //  {}
  // );
  let respData = {};
  await fetch(config.apiRoute.GET_META_DATA, {
    method: "POST",
    body: {
      userName: "SUPERADMIN",
      requestId: "META_DATA",
    },
    sslPinning: {
      certs: ["bharatbank"],
    },
  })
    .then((response) => {
      respData = response;
      console.log(respData);
    })
    .catch((err) => {
      respData = err;
      console.log(respData);
    });

  store.dispatch({ type: SET_META_DATA, payload: respData });
  return respData;
};
//----------------------------------------------------------------



const getFaqDataApi = async () => {
  const response = await http.post(
    config.apiRoute.GET_FAQ_DATA,
    {
      userName: 'test',
      requestId: "FAQ",
      module: "INFO",
    },
    {}
  );
  return response.data;
};

const getSecurityQuestionApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_SECURITY_QUESTIONS,
    {
      ...request,
      requestId: "SECURITYQUESTATIONS",
      module: "INFO",
    },
    {}
  );
  return response.data;
};


const getSecurityQuestionAnswerApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_SECURITY_QUESTIONS_ANSWERS,
    {
      ...request,
      requestId: "SECURITYQUESTATIONS",
      module: "INFO",
    },
    {}
  );
  return response.data;
};


const setSecurityQuestionApi = async (request) => {
  const response = await http.post(
    config.apiRoute.SET_SECURITY_QUESTIONS,
    {
      ...request,
      requestId: "SECURITYQUESTATIONS",
      module: "INFO",
    },
    {}
  );
  return response.data;
};

const getAppDataCheckApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_APP_DATA,
    {
      ...request,
      requestId: "REGISTUSER",
      
    },
    {}
  );
  return response.data;
};



const registrationVerifyApi = async (request) => {
  const response = await http.post(
    config.apiRoute.REGISTRATION_VERFIY,
    {
      ...request,
    },
    {}
  );
  return response.data;
};

const registrationConfirmApi = async (request) => {
  const response = await http.post(
    config.apiRoute.REGISTRATION_CONFIRM,
    {
      ...request,
    },
    {}
  );
  store.dispatch({ type: SET_SELECTED_RANDOM_KEY, payload: response.data.randomKey });
  return response.data;
};

const createmPINApi = async (request) => {
  const response = await http.post(
    config.apiRoute.UPDATE_MPIN,
    {
      ...request,
    },
    {}
  );
  store.dispatch({ type: SET_MPIN_DATA, payload: encryptAES(request.mpin) });
  return response.data;
};

const loginUser = async (request) => {

  store.dispatch({ type: RESET_USER })

  const encryptedPassword = encryptAES(request.password);
  const response = await http.post(
    config.apiRoute.LOGIN,
    {
      ...request,
      password: request.isEncrypted ? request.password : encryptedPassword,
      requestId: "MPINLOGIN",
     
    },
    {}
  );

  // store.dispatch({ type: SET_USER, payload: response.data });
  return response.data;
};

const getTermsLinkApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_TERMS_LINK,
    {
      ...request,
      requestId: "TERMS",
    },
    {}
  );
  return response.data;
};
const logoutApi = async () => {
  const response = await http.post(
    config.apiRoute.LOGOUT,
    {
      requestId: "MPINLOGIN",
    },
    {}
  );
  return response.data;
};

const getProfileDetailsApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_PROFILE_DETAILS,
    {
      ...request,
      requestId: "USERPROFILE",
      module: "PROFILE",

    },
    {}
  );
  return response.data;
};

const getPrivacyPolicyApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_PRIVACY_POLICY,
    {
      ...request,
      requestId: "PRIVACYPOLICY",
      module: "LOGIN",

    },
    {}
  );
  return response.data;
};

const Auth = {
  getAppDataCheckApi,
  getMetaDataApi,
  loginUser,
  registrationVerifyApi,
  registrationConfirmApi,
  createmPINApi,
  getFaqDataApi,
  getTermsLinkApi,
  logoutApi,
  getSecurityQuestionApi,
  setSecurityQuestionApi,
  getProfileDetailsApi,
  getPrivacyPolicyApi,
  getSecurityQuestionAnswerApi

};

export default Auth;
