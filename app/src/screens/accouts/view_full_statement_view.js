import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image, ImageBackground, Dimensions, Platform, Modal } from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors, monthNames } from "../../../styles/global.config";
import { BackIcon, MoreInfoIcon, } from "../../../assets/svg";
import LinearGradient from 'react-native-linear-gradient';
import {
    ReceiveIcon,
    SendIcon, ArrowDown, ArrowUp, SelectDownArrowIcon
} from '../../../assets/svg';
import { showMessage, hideMessage } from "react-native-flash-message";
import Accounts from '../../api/accounts';
import { EditRemarksComponent, LoaderComponent, EditRemarksWithIconsComponent, DateShortComponent } from '../../components'
import Home from '../../api/dashboard';
import { AppContext } from '../../../themes/AppContextProvider';
import {
    remarksBill,
    remarksBusiness,
    remarksEntertainment,
    remarksfood,
    remarksHelth,
    remarksOthers,
    remarksShopping,
    remarksTravel,
    remarksInvestment,
} from '../../../assets/icons';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import RNFetchBlob from 'rn-fetch-blob';
import { Overlay } from 'react-native-elements';
import StyleTextView from "../../components/input/StyleTextView";
import PlainButton from "../../components/button/PlainButton";
import { t } from 'i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
export default function EStatementView({ navigation, route }) {
    const [showInfoView, setShowInfoView] = useState(false)
    const remarksTag = {
        "FOOD": remarksfood,
        "ENTERTAINMENT": remarksEntertainment,
        "BILLS": remarksBill,
        "TRAVEL": remarksTravel,
        "HELTH": remarksHelth,
        "INVESTMENT": remarksInvestment,
        "SHOPPING": remarksShopping,
        "BUSINESS": remarksBusiness,
        "OTHERS": remarksOthers
    }
    const [editRemarksShow, setEditRemaks] = useState({ show: false, itemToEdit: null, showWithoutIcon: false })
    const [value, setRemarksValue] = useState('');
    const [lastTrxn, setLastTrxn] = useState({
        "lastBalAmt": '',
        "lastBalCcy": '',
        "lastPstdDate": '',
        "lastTxnDate": '',
        "lastTxnId": '',
        "lastTxnSrlNo": '',
        "hasMoreData": "N"
    });
    const { params } = route;
    const { height } = Dimensions.get('window');
    const selectedProfileDetails = useSelector(profileSelector);
    const [hasNext, setHasNext] = useState(true);
    const [page, setPage] = useState(0)
    const [isLoading, setLoading] = useState(false);
    const [miniStatementList, setMiniStatmentList] = useState([])
    const [remarksTagValue, setRemarksTagValue] = useState('')
    const { theme, changeTheme } = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorPopUp, setErrorPopUp] = useState({ show: false, message: '' });
    const [order, setOrder] = useState('A');
    useEffect(() => {
        getAccountFullStatment()
    }, []);//[miniStatementList]
    const getAccountFullStatment = useCallback(async () => {
        try {
            let requestBody = {
                ...params.requestParams,
                "page": page,
                "size": 10,
                "lastBalAmt": lastTrxn.lastBalAmt,
                "lastBalCcy": lastTrxn.lastBalCcy,
                "lastPstdDate": lastTrxn.lastPstdDate,
                "lastTxnDate": lastTrxn.lastTxnDate,
                "lastTxnId": lastTrxn.lastTxnId,
                "lastTxnSrlNo": lastTrxn.lastTxnSrlNo,
                "hasMoreData": lastTrxn.hasMoreData,
            }
            if (hasNext) {
                setLoading(true);
                const response = await Accounts.getFullStatementApi(requestBody);
                setHasNext(response.hasMoreData === "Y" ? true : false);
                setLastTrxn({
                    "lastBalAmt": response.lastBalAmt,
                    "lastBalCcy": response.lastBalCcy,
                    "lastPstdDate": response.lastPstdDate,
                    "lastTxnDate": response.lastTxnDate,
                    "lastTxnId": response.lastTxnId,
                    "lastTxnSrlNo": response.lastTxnSrlNo,
                    "hasMoreData": response.hasMoreData,
                })
                setPage(page + 1)
                setMiniStatmentList([...miniStatementList, ...response.fullStmtPaginationrRecords])

                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            showMessage({
                message: "Error message",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [lastTrxn, page, hasNext, miniStatementList, order]
    );
    const updateFullStatement = useCallback(async () => {
        try {
            let requestBody = {
                ...params.requestParams,
                "page": page,
                "size": 10,
                "lastBalAmt": '',
                "lastBalCcy": '',
                "lastPstdDate": '',
                "lastTxnDate": '',
                "lastTxnId": '',
                "lastTxnSrlNo": '',
                "hasMoreData": "N",
                "sortIn": order,
            }
            setLoading(true);
            const response = await Accounts.getFullStatementApi(requestBody);
            setPage(page + 1)
            setHasNext(response.hasMoreData === "Y" ? true : false);
            setLastTrxn({
                "lastBalAmt": response.lastBalAmt,
                "lastBalCcy": response.lastBalCcy,
                "lastPstdDate": response.lastPstdDate,
                "lastTxnDate": response.lastTxnDate,
                "lastTxnId": response.lastTxnId,
                "lastTxnSrlNo": response.lastTxnSrlNo,
                "hasMoreData": response.hasMoreData,
            })
            setMiniStatmentList([...response.fullStmtPaginationrRecords])
            setLoading(false);
        } catch (error) {
            setLoading(false);
            showMessage({
                message: "Error message",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [lastTrxn, page, hasNext, miniStatementList, order]
    );
    const getEditRemarks = useCallback(async () => {
        const { itemToEdit } = editRemarksShow
        try {
            let request = {
                "profileId": selectedProfileDetails.profileId,
                "referenceNumber": itemToEdit.txnId,
                "remarks": value,
                "srcAccount": params.downloadRequest.accountNo,
                "remarksTag": remarksTagValue,
            }
            setLoading(true);
            const response = await Accounts.getEditRemarksApi(request);
            const dummyData = miniStatementList
            let arr = dummyData.map((items, ind) => {
                if (items.txnId === itemToEdit.txnId) {
                    items.remarksTag = remarksTagValue
                    items.remarks = value
                }

                return { ...items }
            })
            setMiniStatmentList(arr)
            setLoading(false);
            setEditRemaks({
                show: false,
                itemToEdit: null,
                showWithoutIcon: false
            })
            setRemarksTagValue('')
            setRemarksValue('')
        } catch (error) {
            setLoading(false);
            setEditRemaks({
                show: false,
                itemToEdit: null
            })
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
        [navigation, editRemarksShow, value, remarksTagValue, miniStatementList]
    );
    const renderHeader = () => {
        return (<LinearGradient
            useAngle={true}
            angle={170}
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={["#4370e7", "#4370e7", "#479ae8", "#4ad4e8"]}>
            <View style={{
                flexDirection: 'row',
                marginTop: 20,
                alignItems: 'center',
                // justifyContent: 'space-between',
                marginBottom: 10
            }}>
                <TouchableOpacity
                    style={{ alignItems: 'center', marginLeft: 10 }}
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <BackIcon />
                </TouchableOpacity>
                <Text style={FONTS.headerText}>{t(AUTH_KEYS.MAIN_SCREEN.STATEMNT_VIEW)}
                    {/* ${params.requestParams.accountNo}`
                     } */}
                </Text>
                <TouchableOpacity style={{ position: 'absolute', top: 10, right: 55 }}
                    onPress={saveReceipt}
                >
                    <Text style={FONTS.headerText}>{t(AUTH_KEYS.MAIN_SCREEN.DOWNLOAD)}
                        {/* ${params.requestParams.accountNo}`
                     } */}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, position: 'absolute', right: -20, bottom: -30, flexDirection: 'column', padding: 40 }}
                    onPress={() => {
                        setShowInfoView(!showInfoView)
                    }} >
                    <MoreInfoIcon color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </LinearGradient>)
    }
    const renderItem = ({ item, index }) => {
        const date = new Date(item.txnDate);
        return (<TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10 }}
            activeOpacity={1}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ width: '15%', marginRight: 5, ...FONTS.h5, paddingLeft: 10 }}>
                    <Text style={{ ...FONTS.h5, textAlign: 'center', color: theme.colors.grey, }}>{date.getDate() <= 9 ? ('0' + date.getDate()) : date.getDate()}</Text>
                    <Text style={{ ...FONTS.h5, textAlign: 'center', color: theme.colors.grey, }}>{monthNames[date.getMonth()]}</Text>
                    <Text style={{ ...FONTS.h5, textAlign: 'center', color: theme.colors.grey, }}>{date.getFullYear() % 100}</Text>
                </View>
                <View style={{ width: '45%', paddingLeft: 10, }}>
                    <Text style={{ ...FONTS.h5, textAlign: 'left', color: theme.colors.grey, }} >{item.txnDesc}</Text>
                    <TouchableOpacity
                        style={{
                            alignSelf: 'baseline',
                            //backgroundColor: '#479ae833', 
                            alignItems: 'center',
                            padding: 5, marginTop: 10, borderRadius: 5, paddingHorizontal: 10, flexDirection: 'row'
                        }}
                        onPress={() => {
                            if (item.txnType === "D") {
                                setEditRemaks({ show: true, itemToEdit: item, showWithoutIcon: false })
                            }
                            else {
                                setEditRemaks({ show: false, itemToEdit: item, showWithoutIcon: true })
                            }
                        }}
                    >
                        {item.remarksTag !== '' && item.remarksTag !== null && <Image
                            source={remarksTag[item.remarksTag]}
                            resizeMode='contain'
                            style={{ width: 20, height: 20, marginRight: 10 }}
                        />}
                        {item.remarks !== "" && item.remarks !== null && <Text style={{ ...FONTS.body5, textAlign: 'center', color: colors.textColorgrey, marginRight: 10 }}>{`${item.remarks !== "" ? " " + item.remarks + " - " : ""} `}</Text>}
                        <Text style={{ ...FONTS.body5, textAlign: 'center', color: colors.buttonColor, }}>{t(AUTH_KEYS.MAIN_SCREEN.EDIT)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '40%', paddingRight: 15, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text style={{ textAlign: 'right', ...FONTS.h3, marginRight: 5, color: theme.colors.grey, }}>{`${item.txnAmtValueCcy === 'INR' ? '₹' : item.txnAmtValueCcy} ${item.txnAmtValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`}</Text>
                    {item.txnType === "D" ? <SendIcon /> : <ReceiveIcon />}

                </View>
            </View>

            <View style={{ height: 1, marginTop: 5, backgroundColor: '#bdbdbd' }} />
        </TouchableOpacity>)
    }
    const saveReceipt = useCallback(
        async () => {
            setLoading(true)
            try {
                let request = {
                    ...params.downloadRequest,
                }
                const receipt = await Home.downlaodAccountStatement(request)
                setLoading(false)
                if (Platform.OS === 'ios') {
                    setTimeout(function () {
                        RNFetchBlob.ios.openDocument(receipt)
                    }, 1000);
                } else if (Platform.OS === 'android') {
                    RNFetchBlob.android.actionViewIntent(receipt, 'application/pdf')
                }
            } catch (error) {
                setLoading(false)

            }
        },
        []
    )
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 90; //Distance from the bottom you want it to trigger.
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    const overlayInfoComponent = () => {

        return (
            <Overlay
                isVisible={showInfoView}
                onBackdropPress={() => setShowInfoView(!showInfoView)}
                height='auto'
                overlayStyle={{
                    color: theme.colors.mainBackground1,
                    margin: 10,
                    borderRadius: 10,
                    width: '80%'
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                    <StyleTextView value={t(AUTH_KEYS.MAIN_SCREEN.LOOKING_YOUR_STATEMENT)} style={{
                        fontSize: fontSize.header3,
                        fontFamily: fontName.regular,
                        color: theme.colors.headingTextColor,
                        textAlign: 'center',
                        lineHeight: Platform.OS === 'android' ? 23 : 20
                    }} />

                    <StyleTextView value={t(AUTH_KEYS.MAIN_SCREEN.E_PASSBOOK_DESCRIPTION)} style={{
                        fontSize: fontSize.textNormal,
                        fontFamily: fontName.regular,
                        color: theme.colors.grey,
                        textAlign: 'center',
                        marginTop: 10,
                        lineHeight: Platform.OS === 'android' ? 22 : 18
                    }} />
                    <View style={{ borderTopWidth: 1, width: '100%', marginTop: 30, paddingTop: 20, opacity: 0.2 }} />



                    <PlainButton title={t(AUTH_KEYS.MAIN_SCREEN.GOT_IT)} onPress={() => setShowInfoView(!showInfoView)} />
                </View>
            </Overlay>
        );
    }
    return (
        <View style={{ flex: 1, width: '100%', height: height }}>
            {/* Header */}
            {renderHeader()}
            {overlayInfoComponent()}
            {/* Mini Statement */}
            {/* Last 10 transactions*/}
            <View style={{
                flexDirection: 'row', marginTop: 20,
                left: 25,
                marginBottom: 10,
                marginLeft: 150,
                alignItems:'center'
            }}>
                <View>
                    <Text style={{ textAlign: 'right', ...FONTS.h3, marginRight: 15, color: theme.colors.grey, }}>Sort by:</Text>
                </View>
                <View style={{ flexDirection: 'row',alignItems:'center' }}>
                    <Text style={{ textAlign: 'right', ...FONTS.h3, marginRight: 5, color: theme.colors.textColor, }}>Date</Text>
                    {/* {order === "D" ? <ArrowDown color={theme.colors.grey} /> <ArrowUp color={theme.colors.grey} />} */}
                    {/* {order === "D" ? [<ArrowDown color={theme.colors.grey} />] : [<ArrowUp color={theme.colors.grey} />]} */}
                </View>
                <View style={{
                    height: '10%',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    //top: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    marginHorizontal: 25,
                    marginVertical: 10,
                    marginLeft: 100,
                }}>
                    <TouchableOpacity onPress={() => setErrorPopUp({
                        show: true,
                        message: '',
                    })}>
                        <SelectDownArrowIcon color={'#1A70FF'} />
                    </TouchableOpacity>
                    <DateShortComponent
                        showError={errorPopUp.show}
                        errorMessage={errorPopUp.message}
                        setErrorPopUp={setErrorPopUp}
                        onPressA={() => {
                            if (order !== 'A') {
                                setOrder('A')
                                updateFullStatement()
                            }
                            setErrorPopUp({
                                show: false,
                                message: ''
                            })
                        }}
                        onPressD={() => {
                            if (order !== 'D') {
                                setOrder('D')
                                updateFullStatement()
                            }
                            setErrorPopUp({
                                show: false,
                                message: ''
                            })
                        }}
                        order={order}
                    />
                </View>
            </View>
            <FlatList
                data={miniStatementList}
                extraData={miniStatementList}
                keyExtractor={(item, index) => `${index}`}
                renderItem={renderItem}
                ListEmptyComponent={() => {
                    return (<View>
                        <Text style={{ ...FONTS.h5, color: '#000', opacity: 0.8, textAlign: 'center', marginTop: 50 }}>{t(AUTH_KEYS.MAIN_SCREEN.NO_TRANSACTION_FOUND)}</Text>
                    </View>)
                }}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        if (hasNext) {
                            setHasNext(false)
                            getAccountFullStatment()
                        }
                    }
                }}
                scrollEventThrottle={1000}

            />
            {editRemarksShow.show && <EditRemarksWithIconsComponent
                value={value}
                setRemarksTagValue={setRemarksTagValue}
                setRemarksValue={setRemarksValue}
                onSave={() => {
                    getEditRemarks()
                }}
                onCancel={() => {
                    setEditRemaks({
                        show: false,
                        itemToEdit: null
                    })
                }}

            />}
            {editRemarksShow.showWithoutIcon && <EditRemarksComponent
                value={value}
                setRemarksValue={setRemarksValue}
                onSave={() => {
                    getEditRemarks()
                }}
                onCancel={() => {
                    setRemarksValue('')
                    setEditRemaks({
                        show: false,
                        itemToEdit: null
                    })
                }}

            />
            }
            {isLoading && <LoaderComponent />}
        </View>

    )
}