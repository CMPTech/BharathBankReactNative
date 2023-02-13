import * as CryptoJS from "crypto-js";
import http from "./api";
import config from "./constants";
import { store } from "../store";
import { SET_USER, SET_AUTH_TOKEN, SET_ACC_DETAILS, SET_ACC_REFRESH } from "../store/constants";
import { setRefreshAccdata } from "../store/actions/user.action";

const AES_SECRET_KEY = CryptoJS.enc.Utf8.parse(config.constants.NEO_KEY);


const getAllAccountDetailsApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_ALL_ACCOUNTS,
    {
      ...request,
      requestId: "ACCOUNTDETAILS",
    },
    {}
  );
  //store.dispatch({ type: SET_ACC_REFRESH, payload: false });
 
  store.dispatch({ type: SET_ACC_DETAILS, payload: response.data.custAccDetails });
  return response.data;
};


const getCASAAccountDetailsApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_CASA_ACCOUNTS,
    {
      ...request,
      requestId: "ACCOUNTDETAILS",
    },
    {}
  );
  //store.dispatch({ type: SET_ACC_DETAILS, payload: response.data.custAccDetails });
  return response.data;
};

const getMiniStatementApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_MINISTATEMENTS,
    {
      ...request,
      requestId: "MINISTATEMENT",
    },
    {}
  );
  return response.data;
};

const getFullStatementApi = async (request) => {
  const response = await http.post(
    config.apiRoute.GET_FULL_STATEMENT,
    {
      ...request,
      requestId: "FULLSTATEMENT",
    },
    {}
  );
  return response.data;
};
const getEditRemarksApi = async (request) => {
  const response = await http.post(
    config.apiRoute.EDIT_REMARKS,
    {
      ...request,
      module: "BENEFICIARY",
      "requestId": "ACCOUNTDETAILS",
    },
    {}
  );

  return response.data;
};
const accountShortnameEditApi = async (request) => {
  const response = await http.post(
    config.apiRoute.EDIT_ACCOUNT_SHORTNAME,
    {
      ...request,
      requestId: "GET_ACC_BAL",
    },
    {}
  );
  return response.data;
};
const Accounts = {
  getAllAccountDetailsApi,
  getMiniStatementApi,
  getFullStatementApi,
  getEditRemarksApi,
  accountShortnameEditApi,
  getCASAAccountDetailsApi

};

export default Accounts;
