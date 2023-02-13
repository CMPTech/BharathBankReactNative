import React, { useEffect, useContext, useState, useRef, useCallback } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity, Animated,
    Image,
    FlatList,
    ImageBackground

} from "react-native";
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';
import { getAccountDetailsSelector } from '../../store/selectors';
import { settingMenu, summarycardBottom, staticIcon } from '../../../assets/icons';
import { useSelector } from "react-redux";
import { PAY_PEOPLE } from "../../routes";
import Home from '../../api/dashboard';
import { LoaderComponent } from '../../components';
import { showMessage } from "react-native-flash-message";
import { profileSelector } from '../../store/selectors';
import { amountFormat } from '../../utils/amount-util';
import moment from "moment";
import StyleTextView from '../../components/input/StyleTextView';
import { BackIcon, } from "../../../assets/svg";
import { AUTH_KEYS } from "../../../assets/translations/constants";
const screens = {
    all: i18n.t(AUTH_KEYS.PAY_PEOPLE.ALL),
    within_bank: i18n.t(AUTH_KEYS.PAY_PEOPLE.WITHIN_BANK),
    neft: i18n.t(AUTH_KEYS.PAY_PEOPLE.PAY_NEFT),
    imps: i18n.t(AUTH_KEYS.PAY_PEOPLE.PAY_IMPS),
    rtgs: i18n.t(AUTH_KEYS.PAY_PEOPLE.PAY_RTGS)
}
const tabs_list = [
    {
        id: 0,
        label: screens.all,
        value: ""
    },
    {
        id: 1,
        label: screens.within_bank,
        value: "IAT"
    },
    {
        id: 2,
        label: screens.neft,
        value: "NEFT"
    },
    {
        id: 3,
        label: screens.imps,
        value: "IMPS"
    },
    {
        id: 4,
        label: screens.rtgs,
        value: "RTGS"
    }
].map((tabs_list) => ({
    ...tabs_list,
    ref: React.createRef()
}))
export default function MyPaymentHistory({ navigation, route }) {
    const { params } = route;
    const { t, i18n } = useTranslation();
    const { theme, changeTheme } = useContext(AppContext);
    const flatListRef = useRef();
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
    const selectedProfileDetails = useSelector(profileSelector);
    const scrollX = React.useRef(new Animated.Value(0)).current
    const [currentIndex, setCurrentIndex] = useState(0);
    const [page, setPage] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [historyList, setHistoryList] = useState([]);
    const [hasNext, setHasNext] = useState(true);
    const [transferType, setTransferType] = useState('')
    const onViewChangeRef = useRef(({ viewableItems, changed }) => {
        if (viewableItems.length > 0) {
            setTransferType(viewableItems[0].item.value)
            setCurrentIndex(viewableItems[0].index)
            setHasNext(true);
            setHistoryList([]);
            getMyHistorytList(viewableItems[0].item.value);
        }
    })
    const TabIndicator = ({ measureLayout, scrollX }) => {
        const inputRange = tabs_list.map((_, i) => i * SIZES.width)
        const tabIndicatorWidth = scrollX.interpolate({
            inputRange,
            outputRange: measureLayout.map(measure => measure.width)
        })
        const translateX = scrollX.interpolate({
            inputRange,
            outputRange: measureLayout.map(measure => measure.x)
        })

        return (<Animated.View
            style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: '10%',
                width: tabIndicatorWidth,
                backgroundColor: '#00ffce',
                transform: [{ translateX }]
            }}
        />)
    }
    const Tabs = ({ scrollX, onBottomTabPress }) => {
        const containerRef = React.useRef();
        const [measureLayout, setMeasureLayout] = React.useState([])

        React.useEffect(() => {
            let ml = []
            tabs_list.forEach(bottom_tab => {
                bottom_tab?.ref?.current?.measureLayout(containerRef.current, (x, y, width, height) => {
                    ml.push({ x, y, width, height })
                    if (ml.length === tabs_list.length) {
                        setMeasureLayout(ml)
                    }
                })
            })

        }, [containerRef.current, currentIndex])

        return (<View
            ref={containerRef}
            style={{
                flex: 1,
                flexDirection: 'row'
            }}>
            {/* Tab Indicator */}
            {measureLayout.length > 0 &&
                <TabIndicator
                    measureLayout={measureLayout}
                    scrollX={scrollX}
                />
            }
            {tabs_list.map((item, index) => {
                return (<TouchableOpacity
                    key={`Tab-${index}`}

                    style={{ flex: 1, marginHorizontal: 15, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => onBottomTabPress(index)}
                    ref={item.ref}
                // onScroll={
                //     Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })
                // }
                >

                    <Text style={{ color: currentIndex === index ? '#00ffce' : "#FFF", ...FONTS.body5, fontFamily: fontName.bold }}>
                        {`${item.label}`}
                    </Text>
                </TouchableOpacity>)
            })}
        </View>)
    }
    const onBottomTabPress = React.useCallback(bottomTabIndex => {
        flatListRef?.current?.scrollToOffset({
            offset: bottomTabIndex * SIZES.width
        })
    })
    const renderTab = () => {
        return (
            <View style={{ height: 50, width: SIZES.width }}>
                <Tabs scrollX={scrollX}
                    onBottomTabPress={onBottomTabPress}
                />
            </View>
        )

    }
    useEffect(() => {
        getMyHistorytList('');
    }, [])

    const getMyHistorytList = useCallback(async (type) => {
        try {
            setTransferType(type)
            if (hasNext) {
                let request = {
                    userName: params.item.payeeName,
                    "payeeId": params.item.payeeId,
                    "page": page,
                    transferType:type,
                    "size": 10,
                };
                setLoading(true);
                const response = await Home.getMyHistoryListApi(request);
                setHistoryList([...historyList, ...response.transferRecords]);
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
        [navigation, page, hasNext, historyList, transferType]
    );
    const renderHeader = () => {
        return (<LinearGradient
            useAngle={true}
            angle={45}
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={["#4370e7", "#479ae8", "#4ad4e8"]}>
            <View style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => { navigation.goBack() }}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={{
                        color: colors.textColorWhite,
                        fontSize: fontSize.header2,
                        fontFamily: fontName.medium,
                        padding: 10
                    }}>My Payment History</Text>

                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <TouchableOpacity>
                        <Image
                            style={{ width: 18, height: 20, marginRight: 10, tintColor: colors.textColorWhite }}
                            source={settingMenu}
                        />
                    </TouchableOpacity>
                </View>

            </View>
            {renderTab()}
        </LinearGradient>)
    }
    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                navigation.navigate(PAY_PEOPLE.HISTORY_DETAIL, item)
            }}
            style={{ backgroundColor: theme.colors.white, marginVertical: 20, padding: 10, marginHorizontal: 20, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
        >
            <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 10, marginLeft: 20, marginRight: 10 }}>
                <Text style={{ color: theme.colors.grey, width: '45%' }}>{item.txnDate != null ? moment(new Date(item.txnDate)).format('DD-MM-YYYY') : "-"}</Text>
                <Text style={{ ...FONTS.h4, opacity: 0.8, width: '45%', color: item.transferStatus === "SUCCESS" ? '#4370e7' : 'red' }}>{`${item.transferStatus === "SUCCESS" ? t(AUTH_KEYS.PAY_PEOPLE.SUCCESSFULL) : t(AUTH_KEYS.PAY_PEOPLE.FAILED)}`}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 10, marginLeft: 20, marginRight: 10, paddingBottom: 30 }}>
                <Text style={{ ...FONTS.h3, width: '45%', color: theme.colors.headingTextColor, opacity: 0.8 }}>{item.payeeName}</Text>
                <Text style={{ ...FONTS.h3, width: '45%', color: theme.colors.headingTextColor, opacity: 0.8 }}>{amountFormat(item.amount)}</Text>
            </View>
            <Image
                source={summarycardBottom}
                style={{ width: SIZES.width * 0.903, position: 'absolute', bottom: -18 }}

            />
        </TouchableOpacity>
    )
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 90; //Distance from the bottom you want it to trigger.
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#479ae8" }}>
            {/* Header */}

            {renderHeader()}
            <Animated.FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled
                snapToAlignment={'center'}
                // scrollEnabled={false}
                snapToInterval={SIZES.width}
                decelerationRate='fast'
                scrollEventThrottle={16}
                disableIntervalMomentum={true}
                showsHorizontalScrollIndicator={false}
                data={tabs_list}
                onViewableItemsChanged={onViewChangeRef.current}
                viewabilityConfig={viewConfigRef.current}
                keyExtractor={item => `Main-${item.id}`}
                onScroll={
                    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })
                }
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ height: SIZES.height, width: SIZES.width }}>
                            <FlatList
                                data={historyList}
                                style={{ width: SIZES.width }}
                                extraData={historyList}
                                showsVerticalScrollIndicator={true}
                                renderItem={renderItem}
                                contentContainerStyle={{
                                    paddingBottom: 100
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
                                onScroll={({ nativeEvent }) => {
                                    if (isCloseToBottom(nativeEvent)) {
                                        if (hasNext) {
                                            getMyHistorytList(transferType);

                                        }
                                    }
                                }}
                                scrollEventThrottle={1000}
                            /></View>)
                }} />
            {isLoading && <LoaderComponent />}
        </SafeAreaView>
    );
}