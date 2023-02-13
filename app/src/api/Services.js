import http from "./api";
import config from "./constants";
import { store } from "../store";
const getChequeStatusApi = async (request) => {
    const response = await http.post(
        config.apiRoute.GET_CHEQUE_STATUS,
        {
            ...request,
            requestId: "CHEQUESTATUS",
            module: "",

        },
        {}
    );
    return response.data;
};
const getChequeDetailApi = async (request) => {
    const response = await http.post(
        config.apiRoute.CHEQUE_DETAILS_API,
        {
            ...request,
            requestId: "CHEQUESTATUS",
            module: "",

        },
        {}
    );
    return response.data;
};
const getLeavesListApi = async (request) => {
    const response = await http.post(
        config.apiRoute.LEVES_LIST,
        {
            ...request,
            requestId: "LEAVELIST",
            module: "",

        },
        {}
    );
    return response.data;
};
const getChequeBookVerifyApi = async (request) => {
    const response = await http.post(
        config.apiRoute.CHEQUE_BOOK_VERIFICATION,
        {
            ...request,
            requestId: "CHEQUEBOOKREQ",
            module: "",

        },
        {}
    );
    return response.data;
};
const getChequeBookConfirmApi = async (request) => {
    const response = await http.post(
        config.apiRoute.CHEQUE_BOOK_CONFIRMATION,
        {
            ...request,
            requestId: "CHEQUEBOOKREQ",
            module: "",

        },
        {}
    );
    return response.data;
};
const getDebitDetailApi = async (request) => {
    const response = await http.post(
        config.apiRoute.DEBIT_CARD,
        {
            ...request,
            requestId: "DEBIT_CARD_DETAILS",
            module: "",

        },
        {}
    );
    return response.data;
};
const getChequeIssuedByMeApi = async (request) => {
    const response = await http.post(
        config.apiRoute.CHEQUE_ISSUED_BY_ME,
        {
            ...request,
            requestId: "LEAVELIST",
            module: "",

        },
        {}
    );
    return response.data;
};
const getChequeDepositedByMeApi = async (request) => {
    const response = await http.post(
        config.apiRoute.CHEQUE_DEPOSITED_BY_ME,
        {
            ...request,
            requestId: "LEAVELIST",
            module: "",

        },
        {}
    );
    return response.data;
};
const chequeBookRemarks = async (request) => {
    const response = await http.post(
        config.apiRoute.CHEQUE_BOOK_REMARKS,
        {
            ...request,
            "module": "CHEQUEBOOK",
            "requestId": "CHEQUEBOOKREMARKS",

        },
        {}
    );
    return response.data;
}
const chequePassedDetailsApi = async (request) => {
    const response = await http.post(
        config.apiRoute.CHEQUE_BOOK_PASSED_DETAIL,
        {
            ...request,
            "module": "CHEQUEBOOK",
            "requestId": "GET_PASSED_CHQ_DETAILS",

        },
        {}
    );
    return response.data;
}
const chequeStopedDetailsApi = async (request) => {
    const response = await http.post(
        config.apiRoute.CHEQUE_BOOK_STOPED_DETAIL,
        {
            ...request,
            "module": "CHEQUEBOOK",
            "requestId": "GET_STOP_CHQ_DETAILS",

        },
        {}
    );
    return response.data;
}
const stopChequeLeaveApi = async (request) => {
    const response = await http.post(
        config.apiRoute.STOP_CHEQUE_LEAVE_REQUEST,
        {
            ...request,
            "module": "CHEQUEBOOK",
            "requestId": "STOPCHEQUEBOOK",

        },
        {}
    );
    return response.data;
}
const stopChequeReasonApi = async (request) => {
    const response = await http.post(
        config.apiRoute.STOP_CHEQUE_REASONS,
        {
            ...request,
            "module": "CHEQUEBOOK",
            "requestId": "STOPCHEQUEREASONLIST",

        },
        {}
    );
    return response.data;
}
const getChequeIssuedByMeDetailApi = async (request) => {
    const response = await http.post(
        config.apiRoute.CHEQUE_ISSUED_BY_ME_DETAILS,
        {
            ...request,
            requestId: "CHEQUESTATUS",
            module: "",

        },
        {}
    );
    return response.data;
};
const Services = {
    getChequeStatusApi,
    getChequeDetailApi,
    getLeavesListApi,
    getChequeBookVerifyApi,
    getChequeBookConfirmApi,
    getDebitDetailApi,
    getChequeIssuedByMeApi,
    getChequeDepositedByMeApi,
    chequeBookRemarks,
    chequePassedDetailsApi,
    chequeStopedDetailsApi,
    stopChequeLeaveApi,
    stopChequeReasonApi,
    getChequeIssuedByMeDetailApi
};

export default Services;