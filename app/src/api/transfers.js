import http from "./api";
import config from "./constants";
import { store } from "../store";



const getAllBeneficiariesApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_BENE_LIST,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "BENE_LIST",
      module: "Beneficary"
    },
    {}
  );
  return response.data;
};

const addInternalBeneficiaryApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.ADD_INTERNAL_BENE,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "BENE_VERIFY",
      module: "Beneficary",
      favorites: "N",
      active: "Y",
    },
    {}
  );
  return response.data;
};

const addInternalBeneficiaryConfirmApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.ADD_INTERNAL_BENE_CONFIRM,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "BENE_VERIFY",
      module: "Beneficary",
      favorites: "N",
      active: "Y",
      beneType:'IAT'
    },
    {}
  );
  return response.data;
};

const getRemarksApi = async () => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.GET_REMARKS_LIST,
    {
      userName: user.profile.userName,
      requestId: "REMARKLIST",
      module: "REMARKLIST",
    },
    {}
  );
  return response.data;
};

const ftIATVerifyApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.FT_VERIFY,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "FTVERIFYIAT",
      module: "FUNDTRANSFER",
    },
    {}
  );
  return response.data;
};

const ftIATConfirmApi = async (request) => {
  const { user } = store.getState();
  const response = await http.post(
    config.apiRoute.FT_CONFIRM,
    {
      ...request,
      userName: user.profile.userName,
      requestId: "FTCONFIRMIAT",
      module: "FUNDTRANSFER",
    },
    {}
  );
  return response.data;
};


const Transfers = {
  getAllBeneficiariesApi,
  addInternalBeneficiaryApi,
  addInternalBeneficiaryConfirmApi,
  ftIATVerifyApi,
  ftIATConfirmApi,
  getRemarksApi
};

export default Transfers;
