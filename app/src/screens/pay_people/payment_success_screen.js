import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image, SafeAreaView, ImageBackground, BackHandler, Platform } from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { PAY_PEOPLE } from '../../routes';
import {
    closeIcon,
    download,
    bgElement,
    reloadIcon,
    shareIcon
} from '../../../assets/icons'
import { imageBackground } from '../../../assets/images';
import { amountFormat } from '../../utils/amount-util';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { LoaderComponent } from '../../components';
import RNFetchBlob from 'rn-fetch-blob';
import Home from '../../api/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import ZigzagView from "react-native-zigzag-view"
import Accounts from '../../api/accounts';
import { setRefreshAccdata } from '../../store/actions/user.action';
import Share from 'react-native-share';
import moment from "moment";
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { showMessage } from "react-native-flash-message";
const PaymentRecieptScreen = ({ navigation, route }) => {
    const { theme, changeTheme } = useContext(AppContext)
    const { params } = route;
    const ref = useRef();
    const selectedProfileDetails = useSelector(profileSelector);
    const [isLoading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const dispatch = useDispatch()

    const transferType = { "IAT": "Within Bank", "IMPS": "IMPS Instant (chrg:Rs+GST)", "NEFT": "NEFT(24X7) 30 min+", "RTGS": "RTGS(24X7) Instant" }


    dispatch(setRefreshAccdata(true))

    const backPressHandler = useCallback(() => {

        dispatch(setRefreshAccdata(true))

        if (isFocused) {
            navigation.navigate(PAY_PEOPLE.MENU)
        }
        return true
    }, [navigation])

    const useBackHandler = (backHandler) => {
        useFocusEffect(() => {
            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                backHandler
            )
            return () => subscription.remove()
        })
    }
    useBackHandler(backPressHandler)
    const headerComponet = () => {
        return (<View style={{
            flexDirection: 'row',
            marginTop: 30,
            alignItems: 'center',
            marginLeft: 30,
            marginBottom: 10,

        }}>
            <TouchableOpacity
                onPress={() => {
                    //navigation.goBack()
                    dispatch(setRefreshAccdata(true))

                    navigation.navigate(PAY_PEOPLE.MENU)
                }}>
                <Image
                    source={closeIcon}
                    style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, marginRight: 10 }}
                />
            </TouchableOpacity>
            <Text style={FONTS.headerText}>{"Summary"}</Text>
        </View>)
    }

    useEffect(() => {
        //getAllAccountDetails()

    }, []);

    const getAllAccountDetails = useCallback(async () => {

        try {
            let request = {
                //userName: mobileNumberInApp || "",
                profileId: selectedProfileDetails.profileId,
            }
            setLoading(true);
            const response = await Accounts.getAllAccountDetailsApi(request);
            setLoading(false);

        } catch (error) {
            setLoading(false);

        }
    }, []);

    const saveReceipt = useCallback(
        async () => {

            // setLoading(true)
            try {
                // let request = {
                //     "refNo": params.referenceNo,
                //     "profileId": selectedProfileDetails.profileId,
                //     format: "PDF",
                // }
                // const receipt = await Home.downlaodPaymentReceipt(request)
                // setLoading(false)
                // if (Platform.OS === 'ios') {
                //     setTimeout(function () {
                //         RNFetchBlob.ios.openDocument(receipt)
                //     }, 1000);
                // } else if (Platform.OS === 'android') {
                //     RNFetchBlob.android.actionViewIntent(receipt, 'application/pdf')
                // }
                ref.current.capture().then(uri => {
                    const downloadDirectory = Platform.OS==='ios'?RNFS.LibraryDirectoryPath:RNFS.DownloadDirectoryPath;
                    
                    const path = downloadDirectory + '/BCB/';
                    RNFS.mkdir(path)
                    RNFS.copyFile(uri, `${path} ${params.referenceNo} ${new Date().getTime()}${".jpg"}`).then(() => {
                        showMessage({
                            message: "",
                            description: "Receip saved to successfully",
                            type: "danger",
                            hideStatusBar: true,
                            backgroundColor: "black", // background color
                            color: "white", // text color
                        });
                    });
                    // Share.open({
                    //     title: "",
                    //     // message: "Message:",
                    //     url: uri,//"file:///storage/emulated/0/demo/test.pdf",
                    //     subject: "Report",
                    // })
                })
            } catch (error) {
                setLoading(false)

            }
        },
        []
    )
    const onImageLoad = useCallback(
        async () => {
            setLoading(true)
            try {
                let request = {
                    "refNo": params.referenceNo,
                    "profileId": selectedProfileDetails.profileId,
                    format: "JPG",
                }
                const receipt = await Home.downlaodPaymentReceipt(request)
                console.log(receipt)
                setLoading(false)
                Share.open({
                    title: "",
                    // message: "Message:",
                    url: "file://" + receipt,//"file:///storage/emulated/0/demo/test.pdf",
                    subject: "Report",
                })
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
    const shareReceipt = useCallback(() => {
        ref.current.capture().then(uri => {
            Share.open({
                title: "",
                // message: "Message:",
                url: uri,//"file:///storage/emulated/0/demo/test.pdf",
                subject: "Report",
            })
        })
    }, []);
    const renderDetail = (label, value) => {
        if (value === null || value === undefined || value == "") {
            return null
        }
        return (<>
            <View style={{ padding: 5, flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ ...FONTS.body4, color: colors.textColorgrey, textAlign: 'left', width: '50%' }}>{label}</Text>
                <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, width: '50%' }}>{value}</Text>

            </View>
            <View style={{ height: 0.5, opacity: 0.5, backgroundColor: colors.dividerColor, marginTop: 10 }} />
        </>)
    }
    return (<SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
            source={imageBackground}
            style={{ flex: 1 }}>
            {/* Header */}
            {headerComponet()}
            <ScrollView style={{ flex: 1, paddingBottom: 100 }}>

                <ViewShot ref={ref} options={{ format: "jpg", quality: 0.9 }}>
                    <ImageBackground
                        source={imageBackground}
                        style={{ flex: 1,paddingBottom:20 }}>
                        <ZigzagView
                            backgroundColor="transparent"
                            surfaceColor="#FFF"
                            top={false}
                            // style={{ marginHorizontal: 20, borderTopLeftRadius: 5, borderTopRightRadius: 5, marginTop: 20, maxHeight: '90%' }}
                            style={{ marginHorizontal: 20, borderTopLeftRadius: 5, borderTopRightRadius: 5, marginTop: 20, maxHeight: '90%', marginBottom: 10 }}


                        >
                            <View
                                style={{ marginHorizontal: 20, paddingBottom: '10%', backgroundColor: '#ffffffff', borderRadius: 5 }}

                            >

                                <ImageBackground
                                    source={bgElement}
                                >
                                    <Image
                                        style={{ width: 80, height: 70, marginTop: 20, marginLeft: 10 }}
                                        source={params.transferStatus === "FAIL" ? require('./../../../assets/images/failed_animation.gif') : require('./../../../assets/images/success_animation.gif')} />
                                </ImageBackground>
                                <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginBottom: 5, marginTop: 5, marginHorizontal: 10 }}>{params.message}</Text>
                                {params.referenceNo !== null && (<View style={{ padding: 5, flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={{ ...FONTS.body4, color: colors.textColorgrey, width: '50%' }}>{`${'Reference no.'} : `}</Text>
                                    <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, width: '50%' }}>{params.referenceNo}</Text>

                                </View>)}
                                {/* <ScrollView> */}
                                <View style={{ height: 0.5, opacity: 0.5, backgroundColor: colors.dividerColor, marginTop: 5, marginBottom: 5 }} />
                                {renderDetail(`${"Destination account"} :`, `${params.destAccountNo}`)}
                                {renderDetail(`${"Source account"} :`, `${params.srcAccountNo}`)}
                                {renderDetail(`${"Amount"} :`, `${amountFormat(params.amount)}`)}
                                {renderDetail(`${"Remarks"} :`, `${params.remarks.split(':')[2]}`)}
                                {renderDetail(`${"Date of Transaction"} :`, `${moment(new Date(params.txnDate)).format('DD/MM/YYYY  LT')}`)}
                                {renderDetail(`${"Send Via"} :`, `${transferType[params.transferType]}`)}


                                {/* </ScrollView> */}
                                {/* {renderDetail(`${"Remarks"} :`, `${params.remarks}`)} */}


                                {/* <Image
                    source={summarycardBottom}
                    style={{ position: 'absolute', bottom: -30, left: 0, width: SIZES.width * 0.903 }}
                /> */}
                            </View>

                        </ZigzagView>
                    </ImageBackground>

                </ViewShot>
                {params.authUsers.length > 0 ? <TouchableOpacity style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', marginLeft: 20 }}
                    onPress={() => navigation.navigate(PAY_PEOPLE.SHARE_WITH_AUTHORIZER_SCREEN, params)}>
                    <Image
                        style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, }}
                        source={shareIcon}
                    />
                    <Text style={{ ...FONTS.h3, color: theme.colors.lightGreen, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginHorizontal: 10 }}>{"Share with Authoriser"}</Text>
                </TouchableOpacity> : <>
                    {params.showReceipt && <>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', marginLeft: 20 }}
                            onPress={() => navigation.pop(3)}>
                            <Image
                                style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, }}
                                source={reloadIcon}
                            />
                            <Text style={{ ...FONTS.h3, color: theme.colors.lightGreen, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginHorizontal: 10, }}>{"Re-initiate payment"}</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: -15 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', marginLeft: 20 }}
                                onPress={saveReceipt}>
                                <Image
                                    style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, marginBottom: 15 }}
                                    source={download}
                                />
                                <Text style={{ ...FONTS.h3, color: theme.colors.lightGreen, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginHorizontal: 10, marginBottom: 15 }}>{"Save receipt"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 10 }}
                                onPress={shareReceipt}>
                                <Image
                                    style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, marginBottom: 15 }}
                                    source={shareIcon}
                                />
                                <Text style={{ ...FONTS.h3, color: theme.colors.lightGreen, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginHorizontal: 10, marginBottom: 15 }}>{"Share Receipt"}</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    }

                    {/* Your content here */}

                </>}

            </ScrollView>
        </ImageBackground>

        {isLoading && <LoaderComponent />}
    </SafeAreaView>
    )

}
export default PaymentRecieptScreen;