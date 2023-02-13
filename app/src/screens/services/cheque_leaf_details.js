import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { SafeAreaView, View, TouchableOpacity, Image, FlatList, ImageBackground, Animated, StyleSheet } from 'react-native';
import {
    chequeLeaf
} from '../../../assets/images'
import { LoaderComponent, AccountDropDownView, BCBDropDownView, AuthHeader, MainButton, } from '../../components';
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from '../../components/input/StyleTextView';
import { fontName, fontSize, FONTS, SIZES, currencyValue, colors } from "../../../styles/global.config";
import Services from '../../api/Services'
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { profileSelector, getAccountDetailsSelector } from '../../store/selectors';
import LinearGradient from 'react-native-linear-gradient';
import { TickIcon } from '../../../assets/svg';
import { nexaLogo, rightArrow, flipIcon } from '../../../assets/icons';
import { Overlay } from 'react-native-elements';
import PlainButton from "../../components/button/PlainButton";
import AuthCommentComponent from '../pay_people/AuthComment'
import { sentenceCase, amountFormat } from '../../utils/amount-util'
import { t } from "i18next";
import { AUTH_KEYS } from "../../../assets/translations/constants";
var converter = require('number-to-words');
const ChequeleafScreen = ({ navigation, route }) => {
    const { params } = route;
    const scrollX = useRef(new Animated.Value(0)).current;
    const [isLoading, setLoading] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reasonError, setReasonError] = useState('');
    const accDetailsData = useSelector(getAccountDetailsSelector);
    const { theme, changeTheme } = useContext(AppContext);
    const selectedProfileDetails = useSelector(profileSelector);
    const [page, setPage] = useState(0);
    let chequesList1 = [];
    const [showVerticle, setShowVerticle] = useState(true);
    const [chequeList, setChequeList] = useState([]);
    const [stopChequeReasonList, setStopChequeReasonList] = useState([]);
    const [chequeBookList, setChequeBookList] = useState(params.chequeBookList.map(v => {
        return { label: `${v.beginCheque} - ${parseInt(v.beginCheque) + parseInt(v.numberOfLeaves) - 1}`, ...v }
    }) || [])
    const [chequeNo, setChequeNo] = useState(params.beginCheque)
    const [chequeNoValue, setChequeNoValue] = useState(`${params.beginCheque} - ${parseInt(params.beginCheque) + parseInt(params.numberOfLeaves) - 1}`)
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
    const flatListRef = useRef();
    const accountTypes = ["CA", "SB", "OD"];
    const [srcAccount, setSrcAccount] = useState(params.srcAccount);
    const [showReasonView, setReasonView] = useState(false)
    const [selectedItemToStop, setsetSelectedItemTostop] = useState(null);
    const [stopedChequeDetails, setStopChequeDetails] = useState(null)
    const [accountList, setAccountList] = useState(accDetailsData.length > 0 ? accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1) : []);
    const onViewChangeRef = useRef(async ({ viewableItems, changed }) => {
        if (viewableItems.length > 0) {
            const { index, item } = viewableItems[0];
            setCurrentIndex(index);
            setStopChequeDetails(null)
            if (item.chequeStatus === "Paid") {
                loadPaidChequeDetails(item)
            }
            else if (item.chequeStatus === "Stopped") {
                loadStopedChequeDetails(item, chequesList1)
            }
        }
    }, [chequesList1])
    useEffect(() => {
        let request = {
            "accountNo": params.srcAccount,
            "beginChqNo": params.beginCheque,
            "branchId": params.brnCode,
            "noOfCheques": params.numberOfLeaves
        };
        loadChequeList(request);
        //stopChequeLeavesReasons();
    }, [])
    const loadChequeBookList = useCallback(async (account) => {
        try {

            let request = {
                "accountNo": account,

            };
            setLoading(true);
            const response = await Services.getChequeDetailApi(request);

            setChequeNo(response[0]?.beginCheque)
            setChequeNoValue(`${response[0].beginCheque} - ${parseInt(response[0].beginCheque) + parseInt(response[0].numberOfLeaves) - 1}`)
            setChequeBookList(response.map(v => {
                return { label: `${v.beginCheque} - ${parseInt(v.beginCheque) + parseInt(v.numberOfLeaves) - 1}`, ...v }
            }));
            const brnCode = accountList.find(v => v.acctNo === srcAccount).acctBranchID || ''
            let requestCheque = {
                "accountNo": account,
                "beginChqNo": response[0].beginCheque,
                "branchId": brnCode,
                "noOfCheques": response[0].numberOfLeaves
            };
            loadChequeList(requestCheque);

            // setHasNext(response.hasNext);
            setLoading(false);
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
        [navigation, chequeBookList, srcAccount, chequeNo, chequeNoValue]
    );
    const stopChequeLeavesReasons = useCallback(async () => {
        try {

            let request = {

            };
            setLoading(true);
            const response = await Services.stopChequeReasonApi(request);
            setStopChequeReasonList(response);
            setLoading(false);
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
        [navigation, stopChequeReasonList]
    );
    const loadChequeList = useCallback(async (request) => {
        try {


            setLoading(true);
            const response = await Services.getChequeStatusApi(request);
            setChequeList(response);
            chequesList1 = response
            // setHasNext(response.hasNext);
            setLoading(false);
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
        [navigation, chequeList]
    );
    const loadPaidChequeDetails = useCallback(async (item) => {
        try {
            let request = {
                "chequeNumber": item.chequeNo,
                "accountNo": item.accountNumber
            };
            setLoading(true);
            const response = await Services.chequePassedDetailsApi(request);
            const dummyData = chequesList1
            let arr = dummyData.map((items, ind) => {
                if (items.chequeNo == item.chequeNo) {
                    items.bankName = response.bankName
                    items.branchName = response.branchName
                    items.payeeName = response.payeeName
                    items.chequeAmt = response.chequeAmt
                    items.chequeDate = response.chequeDate
                }
                return { ...items }
            })
            setChequeList(arr)
            chequesList1 = arr
            setLoading(false);
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
        [navigation, chequeList, chequesList1]
    );
    const loadStopedChequeDetails = useCallback(async (item, chequeLists, stopped) => {
        try {
            let request = {
                "chequeNumber": item.chequeNo,
                "accountNo": item.accountNumber
            };
            setLoading(true);
            const response = await Services.chequeStopedDetailsApi(request);
            const dummyData = chequeLists
            let arr = dummyData.map((items, ind) => {
                if (items.chequeNo == item.chequeNo) {
                    items.stopReason = response.stopReason
                    items.stopChequeDate = response.stopChequeDate
                    items.chequeStatus = "Stopped"
                    // selectedValue = (items[dropDownlabel])
                }
                return { ...items }
            })
            setChequeList(arr)
            setLoading(false);
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
        [navigation, chequeList, selectedItemToStop, stopedChequeDetails]
    );
    const callStopeChequeApi = useCallback(async (item, chequeLists) => {
        try {
            // const resonCode = stopChequeReasonList.find(v => v.isSelected === true).reasonCode
            let request = {
                "acctNo": item.accountNumber,
                "chequeNumber": item.chequeNo,
                "noOfLeaves": "1",
                remarks: remarks,
                // "reason": resonCode,
                "reason": "002"
            };
            setLoading(true);
            setRemarks('')
            const response = await Services.stopChequeLeaveApi(request);
            if (response.status === "SUCCESS") {
                showMessage({
                    message: "",
                    description: "Cheque Stopped Succussfully",
                    type: "danger",
                    hideStatusBar: true,
                    backgroundColor: "black", // background color
                    color: "white", // text color
                });
            }
            loadStopedChequeDetails(item, chequeLists, true)
            setLoading(false);
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
        [navigation, chequeList, selectedItemToStop, stopChequeReasonList, remarks]
    );

    const overlayStopChequeReasonsComponent = () => {
        return (
            <Overlay
                isVisible={showReasonView}
                onBackdropPress={() => setReasonView(!showReasonView)}
                height='auto'
                overlayStyle={{
                    color: theme.colors.mainBackground1,
                    margin: 10,
                    width: '80%'
                }}>
                <View style={{ justifyContent: 'center', padding: 15 }}>
                    <StyleTextView value={`${"Please select a reason to stop cheque no."} ${selectedItemToStop !== null ? selectedItemToStop.chequeNo : ''}`} style={{
                        fontSize: fontSize.textNormal,
                        fontFamily: fontName.medium,
                        color: theme.colors.grey,
                        textAlign: 'left',
                        paddingTop: 10
                    }} />
                    <FlatList
                        data={stopChequeReasonList}
                        extraData={stopChequeReasonList}
                        numColumns={1}
                        style={{ width: '100%', height: 'auto', marginBottom: 50, maxHeight: 200, paddingRight: 10 }}
                        key={({ index }) => index.toString()}
                        ListEmptyComponent={() => {
                            return (<StyleTextView value={`${"Sorry! no records"}`} style={{
                                fontSize: fontSize.textNormal,
                                fontFamily: fontName.regular,
                                color: theme.colors.black,
                                textAlign: 'left',
                                paddingTop: 10
                            }} />)
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            const dummyData = stopChequeReasonList
                                            let arr = dummyData.map((items, ind) => {
                                                if (ind == index) {
                                                    items.isSelected = true
                                                    // selectedValue = (items[dropDownlabel])
                                                }
                                                else {
                                                    items.isSelected = false
                                                }

                                                return { ...items }
                                            })
                                            setStopChequeReasonList(arr);

                                        }}

                                        style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}>

                                        <View style={{ width: '90%' }}>

                                            <StyleTextView value={item.reason} style={{
                                                fontSize: fontSize.textNormal,
                                                fontFamily: fontName.regular,
                                                color: theme.colors.black,
                                                textAlign: 'left',
                                                paddingTop: 10
                                            }} />

                                        </View>


                                        <View style={{ width: '10%', alignSelf: 'flex-end' }}>
                                            {item.isSelected ? <TickIcon /> :
                                                null
                                            }
                                        </View>


                                    </TouchableOpacity>

                                    {index + 1 < stopChequeReasonList.length
                                        ?
                                        <View style={{
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            borderColor: theme.colors.dividerColor,
                                            opacity: .2
                                        }} />
                                        :
                                        null}
                                </View>
                            )
                        }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <PlainButton
                            title={"Cancel"}
                            onPress={() => {
                                setRemarks('')
                                setReasonView(!showReasonView)
                            }}
                            style={{ color: theme.colors.grey, fontFamily: fontName.medium }}
                        />

                        <PlainButton
                            title={"Stop this cheque"}
                            onPress={() => {
                                const validate = stopChequeReasonList.find(v => v.isSelected === true)

                                if (validate !== undefined) {
                                    setReasonView(!showReasonView)
                                    callStopeChequeApi(selectedItemToStop)
                                }

                            }}
                            style={{ color: theme.colors.pinkColor, fontFamily: fontName.medium, marginLeft: 20 }}
                        />
                    </View>

                </View>
            </Overlay>
        );
    }
    const renderItem = ({ item, index }) => {
        let arr = ['', '', '', '', '', '', '', '']
        if (item.stopChequeDate !== undefined && item.stopChequeDate !== null) {
            arr = []
            item.stopChequeDate.split("-").map(v => {
                arr = [...arr, ...v.split('')]
            })
        }
        if (item.chequeDate !== undefined && item.chequeDate !== null) {
            arr = []
            item.chequeDate.split("-").map(v => {
                arr = [...arr, ...v.split('')]
            })
        }
        return (
            <View>
                <View style={{ width: SIZES.width, marginTop: 30, marginTop: 80 }}>
                    <View style={{ marginHorizontal: 10, backgroundColor: theme.colors.white, borderWidth: 0.5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Image
                                source={nexaLogo}
                                resizeMode='contain'
                                style={{ width: 100, height: 60 }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10, marginVertical: 5, marginTop: 5 }}>
                                {
                                    arr.map(v => {
                                        return (<StyleTextView
                                            value={v}
                                            style={{
                                                borderWidth: 0.5, width: 20, fontSize: fontSize.textSmall,
                                                fontFamily: fontName.regular,
                                                textAlign: 'center',
                                                height: 20,
                                            }}
                                        />)
                                    })

                                }
                            </View>
                        </View>
                        <ImageBackground
                            source={chequeLeaf}
                            style={{ width: '100%', height: 150 }}
                        >
                            <View style={{
                                borderTopWidth: item.chequeStatus === "Unused" ? 0 : 2, width: 120, position: 'absolute', borderBottomWidth: item.chequeStatus === "Unused" ? 0 : 2, transform: [
                                    { rotate: '325deg' },
                                ],
                                alignSelf: 'center',
                                margin: 20,
                                opacity: 0.5,
                                borderColor: theme.colors.red,
                                justifyContent: 'center'
                            }}>
                                <StyleTextView
                                    value={`${item.chequeStatus}`}
                                    style={{
                                        fontSize: 24,
                                        fontFamily: fontName.medium,
                                        color: item.chequeStatus === "Paid" ? theme.colors.buttonColor : item.chequeStatus === "Stopped" ? theme.colors.red : theme.colors.grey,
                                        paddingVertical: 5,
                                        textAlign: 'center',
                                    }}
                                />

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, marginHorizontal: 10, borderBottomColor: theme.colors.grey, paddingVertical: 5 }}>
                                <StyleTextView
                                    value={'Pay'}
                                    style={{
                                        fontSize: fontSize.textNormal,
                                        fontFamily: fontName.regular,
                                        textAlign: 'center',
                                        marginRight: 10,

                                    }}
                                />
                                <StyleTextView
                                    value={(item.payeeName === undefined || item.payeeName === null) ? '' : `${sentenceCase(item?.payeeName)}`}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',

                                    }}
                                />

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, marginHorizontal: 10, borderBottomColor: theme.colors.grey, paddingVertical: 5 }}>
                                <StyleTextView
                                    value={'Rupees'}
                                    style={{
                                        fontSize: fontSize.textNormal,
                                        fontFamily: fontName.regular,
                                        textAlign: 'center',
                                        marginRight: 10,

                                    }}
                                />
                                <StyleTextView
                                    value={(item.chequeAmt === undefined || item.chequeAmt === null) ? '' : converter.toWords(parseFloat(item.chequeAmt))}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',

                                    }}
                                />

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, marginHorizontal: 10, borderBottomColor: theme.colors.grey, justifyContent: 'flex-end' }}>

                                <StyleTextView
                                    value={'₹'}
                                    style={{
                                        fontSize: fontSize.textNormal,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',
                                        borderWidth: 0.5, width: 30,
                                        paddingVertical: 5,
                                        borderColor: theme.colors.grey,

                                    }}
                                />
                                <StyleTextView
                                    value={(item.chequeAmt === undefined || item.chequeAmt === null) ? '' : amountFormat(item.chequeAmt)}
                                    style={{
                                        fontSize: fontSize.textNormal,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',
                                        width: '40%',
                                        borderWidth: 0.5,
                                        paddingVertical: 5.56,
                                        borderColor: theme.colors.grey,

                                    }}
                                />



                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, borderBottomColor: theme.colors.grey, justifyContent: 'flex-start', marginTop: 10 }}>

                                <StyleTextView
                                    value={'A/C No.'}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.regular,
                                        textAlign: 'center',
                                        borderWidth: 0.5, width: 60,
                                        paddingVertical: 5,
                                        height: 35,
                                        borderColor: theme.colors.grey,

                                    }}
                                />
                                <StyleTextView
                                    value={item.accountNumber}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.medium,
                                        borderColor: theme.colors.grey,
                                        paddingVertical: 5,
                                        borderWidth: 0.5,
                                        width: '50%',
                                        textAlign: 'center',
                                        height: 35,

                                    }}
                                />



                            </View>
                        </ImageBackground>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <StyleTextView
                                value={item.chequeNo}
                                style={{
                                    fontSize: fontSize.textSmall,
                                    fontFamily: fontName.regular,
                                    borderColor: theme.colors.grey,
                                    paddingVertical: 5,
                                    textAlign: 'center',
                                }}
                            />
                            {item.chequeStatus === 'Unused' && (<TouchableOpacity onPress={() => {
                                setReasonView(!showReasonView)
                                setsetSelectedItemTostop(item)
                                // callStopeChequeApi(item)
                            }}>
                                <StyleTextView
                                    value={`${'Stop cheque'}`}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.medium,
                                        color: theme.colors.buttonColor,
                                        paddingVertical: 5,
                                        textAlign: 'center',
                                    }}
                                />
                            </TouchableOpacity>)

                            }
                            {item.chequeStatus === "Stopped" && item.stopReason !== undefined && (
                                <StyleTextView
                                    value={`${'Reason'} : ${sentenceCase(item.stopReason)}`}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.medium,
                                        color: theme.colors.buttonColor,
                                        paddingVertical: 5,
                                        textAlign: 'center',
                                    }}
                                />
                            )
                            }
                        </View>
                        <TouchableOpacity style={{ position: 'absolute', right: 0, bottom: 5 }}
                            onPress={() => {
                                setShowVerticle(!showVerticle)
                            }}
                        >
                            <StyleTextView
                                value={'Flip to view\nverticle'}
                                style={{
                                    fontSize: 6,
                                    fontFamily: fontName.medium,
                                    textAlign: 'center',
                                    padding: 5,
                                    marginBottom: 10,
                                    transform: [{ rotate: '295deg' }],
                                    borderColor: theme.colors.grey,

                                }}
                            />
                            <Image
                                source={flipIcon}
                                resizeMode='contain'
                                style={{ transform: [{ rotate: '250deg' }], width: 60, height: 55, position: 'absolute', right: 0, top: -15 }}
                            />
                        </TouchableOpacity>
                    </View>

                </View>
                <TouchableOpacity
                    style={{ marginHorizontal: 30, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
                    onPress={() => {
                        if (currentIndex < chequeList.length - 1) {
                            flatListRef?.current?.scrollToIndex(
                                {
                                    index: currentIndex + 1,
                                    animated: true
                                })
                        }
                    }}

                >
                    <StyleTextView
                        value={`${'Cheque'} ${index + 1} / ${chequeList.length}`}
                        style={{
                            fontSize: fontSize.textSmall,
                            fontFamily: fontName.medium,
                            textAlign: 'center',
                            paddingVertical: 5,

                            height: 35,
                            color: theme.colors.buttonColor,

                        }}
                    />
                    <Image
                        style={{ width: 10, marginBottom: 10, height: 10, marginLeft: 10, tintColor: theme.colors.buttonColor }}
                        source={rightArrow}
                    />
                </TouchableOpacity>

            </View>
        )
    }
    const renderItemVerticle = ({ item, index }) => {
        let arr = ['', '', '', '', '', '', '', '']
        if (item.stopChequeDate !== undefined && item.stopChequeDate !== null) {
            arr = []
            item.stopChequeDate.split("-").map(v => {
                arr = [...arr, ...v.split('')]
            })
        }
        if (item.chequeDate !== undefined && item.chequeDate !== null) {
            arr = []
            item.chequeDate.split("-").map(v => {
                arr = [...arr, ...v.split('')]
            })
        }
        return (
            <>
                <View style={{ width: SIZES.width, justifyContent: 'center', }}>
                    <View style={{
                        width: SIZES.height * 0.65,
                        height: SIZES.width * 0.75,
                        alignSelf: 'center',
                        marginHorizontal: 10, backgroundColor: theme.colors.white, borderWidth: 0.5, transform: [
                            { rotate: '90deg' },
                        ],
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Image
                                source={nexaLogo}
                                resizeMode='contain'
                                style={{ width: 120, height: 60 }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10, marginVertical: 5, marginTop: 5 }}>
                                {
                                    arr.map(v => {
                                        return (<StyleTextView
                                            value={v}
                                            style={{
                                                borderWidth: 0.5, width: 25, fontSize: fontSize.textSmall,
                                                fontFamily: fontName.regular,
                                                textAlign: 'center',
                                                height: 25,
                                            }}
                                        />)
                                    })

                                }
                            </View>
                        </View>
                        <ImageBackground
                            source={chequeLeaf}
                            style={{ width: '100%', height: 200 }}
                        >

                            <View style={{
                                borderTopWidth: item.chequeStatus === "Unused" ? 0 : 2, width: 120, position: 'absolute', borderBottomWidth: item.chequeStatus === "Unused" ? 0 : 2, transform: [
                                    { rotate: '325deg' },
                                ],
                                alignSelf: 'center',
                                margin: 20,
                                opacity: 0.5,
                                borderColor: theme.colors.red,
                                justifyContent: 'center'
                            }}>
                                <StyleTextView
                                    value={`${item.chequeStatus}`}
                                    style={{
                                        fontSize: 24,
                                        fontFamily: fontName.medium,
                                        color: item.chequeStatus === "Paid" ? theme.colors.buttonColor : item.chequeStatus === "Stopped" ? theme.colors.red : theme.colors.grey,
                                        paddingVertical: 5,
                                        textAlign: 'center',
                                    }}
                                />

                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, marginHorizontal: 10, borderBottomColor: theme.colors.grey, paddingVertical: 5 }}>
                                <StyleTextView
                                    value={'Pay'}
                                    style={{
                                        fontSize: fontSize.textNormal,
                                        fontFamily: fontName.regular,
                                        textAlign: 'center',
                                        marginRight: 10,

                                    }}
                                />
                                <StyleTextView
                                    value={(item.payeeName === undefined || item.payeeName === null) ? '' : `${sentenceCase(item?.payeeName)}`}
                                    style={{
                                        fontSize: fontSize.textNormal,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',

                                    }}
                                />

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, marginHorizontal: 10, borderBottomColor: theme.colors.grey, paddingVertical: 10 }}>
                                <StyleTextView
                                    value={'Rupees'}
                                    style={{
                                        fontSize: fontSize.textNormal,
                                        fontFamily: fontName.regular,
                                        textAlign: 'center',
                                        marginRight: 10,

                                    }}
                                />
                                <StyleTextView
                                    value={(item.chequeAmt === undefined || item.chequeAmt === null) ? '' : converter.toWords(parseFloat(item.chequeAmt))}
                                    style={{
                                        fontSize: fontSize.textNormal,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',

                                    }}
                                />

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, marginHorizontal: 10, borderBottomColor: theme.colors.grey, justifyContent: 'flex-end', }}>

                                <StyleTextView
                                    value={'₹'}
                                    style={{
                                        fontSize: fontSize.textNormal,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',
                                        borderWidth: 0.5, width: 30,
                                        paddingVertical: 5,
                                        borderColor: theme.colors.grey,

                                    }}
                                />
                                <StyleTextView
                                    value={(item.chequeAmt === undefined || item.chequeAmt === null) ? '' : amountFormat(item.chequeAmt)}
                                    style={{
                                        fontSize: fontSize.textNormal,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',
                                        width: '40%',
                                        borderWidth: 0.5,
                                        paddingVertical: 5.56,
                                        borderColor: theme.colors.grey,

                                    }}
                                />



                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, borderBottomColor: theme.colors.grey, justifyContent: 'flex-start', marginTop: 10 }}>

                                <StyleTextView
                                    value={'A/C No.'}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.regular,
                                        textAlign: 'center',
                                        borderWidth: 0.5, width: 60,
                                        paddingVertical: 5,
                                        height: 35,
                                        borderColor: theme.colors.grey,

                                    }}
                                />
                                <StyleTextView
                                    value={item.accountNumber}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.medium,
                                        borderColor: theme.colors.grey,
                                        paddingVertical: 5,
                                        borderWidth: 0.5,
                                        width: '50%',
                                        textAlign: 'center',
                                        height: 35,

                                    }}
                                />

                                <TouchableOpacity
                                    style={{ marginHorizontal: 30, alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        if (currentIndex < chequeList.length - 1) {
                                            flatListRef?.current?.scrollToIndex(
                                                {
                                                    index: currentIndex + 1,
                                                    animated: true
                                                })
                                        }
                                    }}

                                >
                                    <StyleTextView
                                        value={`${'Cheque'} ${index + 1} / ${chequeList.length}`}
                                        style={{
                                            fontSize: fontSize.textSmall,
                                            fontFamily: fontName.medium,
                                            textAlign: 'center',
                                            paddingVertical: 5,

                                            height: 35,
                                            color: theme.colors.buttonColor,

                                        }}
                                    />
                                    <Image
                                        style={{ width: 10, marginBottom: 10, height: 10, marginLeft: 10, tintColor: theme.colors.buttonColor }}
                                        source={rightArrow}
                                    />
                                </TouchableOpacity>

                            </View>
                        </ImageBackground>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <StyleTextView
                                value={item.chequeNo}
                                style={{
                                    fontSize: fontSize.textSmall,
                                    fontFamily: fontName.regular,
                                    borderColor: theme.colors.grey,
                                    paddingVertical: 5,
                                    textAlign: 'center',
                                }}
                            />

                            {item.chequeStatus === 'Unused' && (<TouchableOpacity onPress={() => {
                                setReasonView(!showReasonView)
                                setsetSelectedItemTostop(item)
                                // callStopeChequeApi(item)
                            }}>
                                <StyleTextView
                                    value={`${'Stop cheque'}`}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.medium,
                                        color: theme.colors.buttonColor,
                                        paddingVertical: 5,
                                        textAlign: 'center',
                                    }}
                                />
                            </TouchableOpacity>)

                            }
                            {item.chequeStatus === "Stopped" && item.stopReason !== undefined && (
                                <StyleTextView
                                    value={`${'Reason'} : ${sentenceCase(item.stopReason)}`}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.medium,
                                        color: theme.colors.buttonColor,
                                        paddingVertical: 5,
                                        textAlign: 'center',
                                    }}
                                />
                            )
                            }
                        </View>
                    </View>

                    <TouchableOpacity style={{ position: 'absolute', left: 50, bottom: 60 }}
                        onPress={() => {
                            setShowVerticle(!showVerticle)
                        }}
                    >
                        <StyleTextView
                            value={'Flip to view\nhorizontal'}
                            style={{
                                fontSize: 6,
                                fontFamily: fontName.medium,
                                textAlign: 'center',
                                padding: 10,
                                marginBottom: 20,
                                transform: [{ rotate: '45deg' }],
                                borderColor: theme.colors.grey,

                            }}
                        />
                        <Image
                            source={flipIcon}
                            resizeMode='contain'
                            style={{ width: 60, height: 60, position: 'absolute', top: -18, }}
                        />
                    </TouchableOpacity>
                </View>


            </>
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
        }}
    >
        <AuthHeader
            title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_STATUS)}
            navigation={navigation}
        />
        <AuthCommentComponent
            isVisible={showReasonView}
            title="Reason to Stop Cheque"
            subtitle="Are you sure you want to  stop this cheque ? Please enter a reasons "
            label="Reason"
            cancelTitle="Cancel"
            rejectComentError={reasonError}
            maxLength={30}
            approveTitle="Stop this Cheque"
            remarks={remarks}
            setRemarks={setRemarks}
            onCancel={() => {
                setReasonView(false);
            }}
            onApprove={() => {
                if (remarks.length > 0) {
                    setReasonView(false);
                    callStopeChequeApi(selectedItemToStop, chequeList)
                }
                else {
                    setReasonError("Please enter reason to stop this cheque")
                }

            }}
            setVisible={setReasonView}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <AccountDropDownView
                data={accountList}
                placeholder={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ACCOUNT_NO)}
                dropDownlabel={'acctNo'}
                dropDownValue={"acctNo"}
                hintStyle={{ marginLeft: 20 }}
                value={srcAccount}
                editable={false}
                inputViewStyle={{ fontSize: 14 }}
                textInputConatinerStyle={{ width: SIZES.width * 0.45, marginLeft: 20 }}
                // touched={sendViaError}
                returnKeyType='done'
                keyboardType='phone-pad'
                arrowStyle={{ bottom: 5, right: -10 }}
                // errors={sendViaError}
                onChangeText={(text) => {
                    setSrcAccount(text)
                    loadChequeBookList(text)
                }} />
            <BCBDropDownView
                data={chequeBookList}
                placeholder={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_NO)}
                dropDownlabel={"label"}
                dropDownValue={"label"}
                selectedValue={chequeNoValue}
                value={chequeNoValue}
                inputViewStyle={{ fontSize: 14 }}
                hintStyle={{ marginLeft: 20 }}
                textInputConatinerStyle={{ width: SIZES.width * 0.40, marginLeft: 20 }}
                editable={false}
                arrowStyle={{ bottom: 5, right: 20 }}
                onChangeText={(text) => {
                    const chequeDetail = chequeBookList.find(v => v.label === text)
                    setChequeNoValue(text)
                    setChequeNo(chequeDetail.beginCheque)
                    const brnCode = accountList.find(v => v.acctNo === srcAccount).acctBranchID || ''
                    let request = {
                        "accountNo": srcAccount,
                        "beginChqNo": chequeDetail.beginCheque,
                        "branchId": brnCode,
                        "noOfCheques": chequeDetail.numberOfLeaves
                    };
                    loadChequeList(request);

                }}
            />
        </View>
        <Animated.FlatList
            ref={flatListRef}
            data={chequeList}
            extraData={chequeList}
            pagingEnabled
            horizontal
            snapToAlignment='center'
            snapToInterval={SIZES.width}
            decelerationRate='fast'
            scrollEventThrottle={16}
            viewabilityConfig={viewConfigRef.current}
            disableIntervalMomentum={true}
            onViewableItemsChanged={onViewChangeRef.current}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([
                {
                    nativeEvent: {
                        contentOffset: { x: scrollX }
                    }
                }
            ], {
                useNativeDriver: false
            })}
            renderItem={showVerticle ? renderItemVerticle : renderItem}
            keyExtractor={(item, index) => `${index}`}
        />
        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
export default ChequeleafScreen;