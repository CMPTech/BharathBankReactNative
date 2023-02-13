import React, { useContext, useEffect, useState, useCallback } from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
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
import { imageBackground } from '../../../assets/images';
import {
    summarycardBottom,
} from '../../../assets/icons'
import ZigzagView from "react-native-zigzag-view"
import AuthNoGradientHeader from "../../components/base/AuthNoGradientHeader";

const ScheduledTransferList = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);
    const { theme, changeTheme } = useContext(AppContext);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const selectedProfileDetails = useSelector(profileSelector);
    const [authList, setAuthList] = useState([]
    )
    useEffect(() => {
        getScheduledPaymentList();
    }, [])
    const getScheduledPaymentList = useCallback(async (arr) => {

        try {
            if (hasMore) {
                let request = {
                    "profileId": selectedProfileDetails.profileId,
                    "page": page,
                    "size": 10
                };
                setLoading(true);
                const response = await Home.getScheduledTransferListApi(request);
                setAuthList([...authList, ...response.items])
                setHasMore(response.hasNext)
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
        [navigation, page, hasMore,]
    );
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(PAY_PEOPLE.SCHEDULED_TRANSFERS_DETAIL, item)
                }}
                activeOpacity={1}
            >
                <ZigzagView
                    backgroundColor="transparent"
                    surfaceColor="#FFF"
                    top={false}
                    style={{ marginHorizontal: 20, borderTopLeftRadius: 5, borderTopRightRadius: 5, marginTop: 20 }}
                >


                    <View style={{ backgroundColor: theme.colors.white, paddingHorizontal: 20, paddingVertical: 30 }}>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <StyleTextView value={`${item.scheduledDate} `}
                                style={{
                                    fontSize: fontSize.textLarge,
                                    fontFamily: fontName.medium,
                                    color: theme.colors.grey,
                                    width: '50%'

                                }} />
                            <StyleTextView value={` ${item.transferStatus}`}
                                style={{
                                    fontSize: fontSize.textLarge,
                                    fontFamily: fontName.medium,
                                    color: theme.colors.headingTextColor,
                                    width: '50%'

                                }} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                            <StyleTextView value={`${item.destAccount}`}
                                style={{
                                    fontSize: fontSize.textLarge,
                                    fontFamily: fontName.medium,
                                    color: theme.colors.headingTextColor,
                                    paddingTop: 5,
                                    width: '50%'

                                }} />
                            <StyleTextView value={`${amountFormat(item.amount)}`}
                                style={{
                                    fontSize: fontSize.textLarge,
                                    fontFamily: fontName.medium,
                                    color: theme.colors.headingTextColor,
                                    paddingTop: 5,
                                    width: '50%'

                                }} />
                        </View>

                    </View>
                </ZigzagView>
                {/* <Image
                    source={summarycardBottom}
                    style={{ width: SIZES.width * 0.9, marginHorizontal: 20 }}
                /> */}
            </TouchableOpacity>)
    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 90; //Distance from the bottom you want it to trigger.
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    return (<ImageBackground
        source={imageBackground}
        style={{
            flex: 1,
        }}
    >
        <View style={{
            flex: 1,
        }}>
            <AuthNoGradientHeader

                title={"Scheduled Transfer"}
                navigation={navigation}
            />
            {/* <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 150
                }}
            > */}

            <FlatList
                data={authList}
                extraData={authList}
                renderItem={renderItem}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        if (hasMore) {
                            getScheduledPaymentList();

                        }
                    }
                }}
                ListEmptyComponent={() => {
                    return (<View>
                        {isLoading === false && (<StyleTextView value={`${'No record found'}`}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                color: theme.colors.white,
                                textAlign: 'center',
                                marginTop: 60,
                                padding: 5,
                            }} />)

                        }

                    </View>
                    )
                }}
                scrollEventThrottle={1000}
            />

            {/* </ScrollView> */}
        </View>
        {isLoading && <LoaderComponent />}
    </ImageBackground>)
}
export default ScheduledTransferList;