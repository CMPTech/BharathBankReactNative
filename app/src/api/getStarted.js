import http from "./api";
import config from "./constants";
import { store } from "../store";
const LoactionApi = async () => {
    const response = await http.post(
        config.apiRoute.LOCATION,
        {
            locationType: "ALL",
            username: "DEFAULT",
        },
        {}
    );
    return response.data;
};
const googleMapApi = async (request) => {
    const response = await http.getMap(request)
    return response.data;
}
const getNearByLoactionApi = async (request) => {
    const response = await http.post(
        config.apiRoute.GET_NEAR_BY_LOCATION,
        {
            ...request,
            requestId: "LOCATIONS"
        },
        {}
    );
    return response.data;
};
const GetStarted = {
    LoactionApi,
    googleMapApi,
    getNearByLoactionApi
};

export default GetStarted;