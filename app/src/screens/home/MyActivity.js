import React, { useContext, useEffect, useState, useCallback } from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import {
    settingMenu
} from '../../../assets/icons'
import { LoaderComponent, BottomButton, AlerComponent, AuthHeader, MainButton } from '../../components';
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from '../../components/input/StyleTextView';
import { fontName, fontSize, FONTS, SIZES, currencyValue, colors } from "../../../styles/global.config";
import { amountFormat } from '../../utils/amount-util'
import { PAY_PEOPLE } from "../../routes";
import Home from '../../api/dashboard';
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import moment from "moment";
const MyActivityList = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);
    const { theme, changeTheme } = useContext(AppContext);
    const selectedProfileDetails = useSelector(profileSelector);
    const [page, setPage] = useState(0)
    const [activityList, setActivityList] = useState([]);
    const [hasNext, setHasNext] = useState(true);
    const statusType = {
        "P": "Pending",
        "R": "Approved",
        "R": "Rejected",
        "V": "Pending",
        "RN": "Return"
    }
    useEffect(() => {
        getMyActivityList();
    }, [])

    const getMyActivityList = useCallback(async () => {
        try {
            if (hasNext) {
                let request = {
                    "profileId": selectedProfileDetails.profileId,
                    "page": page,
                    "size": 10


                };
                setLoading(true);
                const response = await Home.getMyActivityApi(request);
                setActivityList([...activityList, ...response.items]);
                setHasNext(response.hasNext);
                setPage(page + 1)
                setLoading(false);
            }


        } catch (error) {
            setLoading(false);
            showMessage({
                message: "",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation, page, hasNext, activityList]

    );

    const renderItem = ({ item, index }) => {
        return (
            // <TouchableOpacity
            //     style={{ backgroundColor: theme.colors.white, borderRadius: 5, padding: 10 }}
            //     onPress={() => {

            //     }}
            // >
            //     <StyleTextView value={`${'Payment to '} ${item.activity}`}
            //         style={{
            //             fontSize: fontSize.textSmall,
            //             fontFamily: fontName.medium,
            //             color: theme.colors.grey,
            //             paddingTop: 5,



            //         }} />

            // ...FONTS.h2, textAlign: 'center', alignSelf: 'center', color: theme.colors.textColor, marginBottom: 30, fontFamily: fontName.medium

            <View style={{
                flex: 1, textAlign: 'center', flexWrap: 'wrap', marginHorizontal: 20
            }}>

                <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 50,
                    backgroundColor: theme.colors.buttonColor,
                    overflow: 'hidden',
                    textAlign: 'center',
                    paddingLeft: 5,
                    paddingTop: 5,
                    marginHorizontal: -8,





                }}><View style={{
                    width: 10,
                    height: 10,
                    borderRadius: 50,
                    backgroundColor: '#FFFFFF',
                    marginBottom: -30

                }} />
                </View>

                <View style={{
                    flex: 1, width: '100%',
                    borderLeftWidth: 2,
                    borderLeftColor: theme.colors.buttonColor,
                    paddingLeft: 10,


                }}>
                    <View style={{ flex: 1, marginVertical: 5, marginTop: -25, marginLeft: 15, }}>
                        <StyleTextView value={`${'Activity'}  ${item.activity}`}
                            style={{
                                fontSize: fontSize.header3,
                                fontFamily: fontName.bold,
                                color: theme.colors.grey,
                                paddingTop: 5,


                            }} />

                        <StyleTextView value={`${'Date :'} ${moment(new Date(item.createdDate)).format('DD/MM/YYYY LT')}`}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                color: theme.colors.grey,
                                paddingTop: 5,
                            }} />
                        <StyleTextView value={`${'Description'} ${item.description}`}
                            style={{
                                fontSize: fontSize.textSmall,
                                fontFamily: fontName.medium,
                                color: theme.colors.grey,
                                paddingTop: 5,

                            }} />
                        <StyleTextView value={`${'Ref no : '} ${item.referenceNumber}`}
                            style={{
                                fontSize: 10,
                                fontFamily: fontName.medium,
                                color: theme.colors.grey,
                                paddingTop: 5,

                            }} />
                    </View>
                </View>
            </View>
        )
    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 90; //Distance from the bottom you want it to trigger.
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    return (<SafeAreaView
        style={{
            flex: 1,
            backgroundColor: theme.colors.white,
        }}
    >
        <View style={{
            flex: 1,
        }}>
            <AuthHeader
                title={"Other activity"}
                navigation={navigation}
            />



            <FlatList
                data={activityList}
                extraData={activityList}
                style={{ marginTop: 20 }}
                ListEmptyComponent={() => {
                    return (<StyleTextView value={"No activity found"}
                        style={{
                            fontSize: fontSize.textLarge,
                            fontFamily: fontName.medium,
                            textAlign: 'center',
                            margin: 20,
                            color: theme.colors.headingTextColor,

                        }} />)
                }}
                renderItem={renderItem}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        if (hasNext) {
                            getPaymentList();

                        }
                    }
                }}
                scrollEventThrottle={1000}
            />
        </View>
        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
export default MyActivityList;