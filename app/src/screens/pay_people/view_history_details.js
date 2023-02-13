import React, { useState, useContext, useCallback, useEffect,useRef } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ImageBackground, Platform } from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { t } from 'i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import {
    closeIcon,
    reloadIcon,
    bgElement,
    download,
    shareIcon
} from '../../../assets/icons'
import { imageBackground } from '../../../assets/images';
import { amountFormat } from '../../utils/amount-util';
import { LoaderComponent } from '../../components';
import { PAY_PEOPLE } from '../../routes';
import moment from 'moment';
import Home from '../../api/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import { ScrollView } from 'react-native-gesture-handler';
import ZigzagView from "react-native-zigzag-view"
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import { setRefreshAccdata } from '../../store/actions/user.action';
import { CLOSE_DRAWER } from 'react-navigation-drawer/lib/typescript/src/routers/DrawerActions';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { showMessage } from "react-native-flash-message";
const HistoryDetailScreen = ({ navigation, route }) => {
    const { theme, changeTheme } = useContext(AppContext)
    const { params } = route;
    const selectedProfileDetails = useSelector(profileSelector);
    const [isLoading, setLoading] = useState(false);
    const { fin, nfin } = params.req
    const dispatch = useDispatch()
    const ref = useRef();
    dispatch(setRefreshAccdata(true))

    const backPressHandler = useCallback(() => {

        dispatch(setRefreshAccdata(true))

        if (isFocused) {
            navigation.navigate(PAY_PEOPLE.MENU)
        }
        return true
    }, [navigation])
    const paymentTypes = {
        "ONCE": "One Time",
        "RECURRING": "Recurring SI",
        "SCHEDULED": "One Time -Scheduled"
    }
    const transferType = { "IAT": "WITHIN BANK", "IMPS": "IMPS Instant (chrg:Rs+GST)", "NEFT": "NEFT(24X7) 30 min+", "RTGS": "RTGS(24X7) Instant" }
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
                    navigation.goBack()
                }}>
                <Image
                    source={closeIcon}
                    style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, marginRight: 30 }}
                />
            </TouchableOpacity>
            <Text style={{
                color: theme.colors.white,
                fontSize: fontSize.header2,
                fontFamily: fontName.medium,
            }}>{t(AUTH_KEYS.PAY_PEOPLE.SUMMARY)}</Text>
        </View>)
    }
    const saveReceipt = useCallback(
        async () => {
           // setLoading(true)
            try {
                // let request = {
                //     "refNo": params.refNo,
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
                    RNFS.copyFile(uri, `${path} ${params.refNo===null?"Failed":params.refNo} ${new Date().getTime()} ${".jpg"}`).then(() => {

                        showMessage({
                            message: "",
                            description: "Receip saved to successfully",
                            type: "danger",
                            hideStatusBar: true,
                            backgroundColor: "black", // background color
                            color: "white", // text color
                        });
                    });
                })
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
    const shareReceipt1 = useCallback(
        async () => {
            setLoading(true)
            try {
                let request = {
                    "refNo": params.refNo,
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
    const renderDetail = (label, value) => {

        if (value === null || value === undefined || value == "" || value == "0") {
            return null
        }
        return (<>
            <View style={{ padding: 8, flexDirection: 'row', marginTop: 5 }}>
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
            <ScrollView>
                <ViewShot ref={ref} options={{ format: "jpg", quality: 0.9 }}>
                    <ImageBackground
                        source={imageBackground}
                        style={{ flex: 1 }}>
                        <ZigzagView
                            backgroundColor="transparent"
                            surfaceColor="#FFF"
                            top={false}
                            style={{ marginHorizontal: 20, borderTopLeftRadius: 5, borderTopRightRadius: 5, marginTop: 20 }}
                        >
                            <View
                                style={{ marginLeft: 20, marginRight: 20, paddingBottom: '10%', backgroundColor: '#ffffffff' }}

                            >
                                <ImageBackground
                                    source={bgElement}
                                    style={{ height: 60 }}
                                >
                                    <Image
                                        style={{ width: 50, height: 50, marginTop: 15, marginLeft: 10 }}
                                        source={params.transferStatus === "SUCCESS" ? require('./../../../assets/images/success_animation.gif') : require('./../../../assets/icons/failed_animation.gif')} />
                                </ImageBackground>
                                <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginHorizontal: 10 }}>{params.message}</Text>
                                {params.refNo !== null && (<View style={{ padding: 5, paddingLeft: 10, flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={{ ...FONTS.body4, color: colors.textColorgrey, width: '50%' }}>{`${t(AUTH_KEYS.PAY_PEOPLE.REFERENCE_No)} : `}</Text>
                                    <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, width: '50%' }}>{params.refNo}</Text>

                                </View>)}
                                <ScrollView
                                    showsVerticalScrollIndicator
                                >
                                    {(!nfin.payeeMobile) && renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.DESTINATION_ACCOUNT)} :`, `${fin.destAccount}`)}
                                    {renderDetail(`${t(AUTH_KEYS.REGISTER.MOBILE_NUMBER)} :`, `${nfin.payeeMobile}`)}
                                    {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.SOURCE_ACCOUNT)} :`, `${fin.srcAccount}`)}
                                    {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.AMOUNT)} :`, `${amountFormat(params.amount)}`)}
                                    {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.PAYMENT_TYPE)} :`, `${paymentTypes[fin.paymentType]}`)}
                                    {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.NO_OF_INSTALMENT)} :`, `${fin.numberOfInstallments}`)}
                                    {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.FREQUENCY)} :`, `${fin.frequency}`)}
                                    {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.DATE)} :`, `${moment(new Date(fin.txnDate)).format('DD-MM-YYYY')}`)}
                                    {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.REMARKS)} :`, fin.remarks.includes(':') ? `${fin.remarks.split(":")[2]}` : `${fin.remarks}`)}
                                    {/* {renderDetail(`${'Transfer Via'} :`, `${transferType[nfin.transferType]}`)} */}
                                    {/* {renderDetail(`${'Remarks'} :`, `${fin.remarks}`)}
                            // RTGS
                        {/* <Image
                            source={summarycardBottom}
                            style={{ position: 'absolute', bottom: -30, left: 0, width: SIZES.width * 0.903 }}
                        /> */}
                                </ScrollView>
                            </View>
                        </ZigzagView>
                    </ImageBackground>

                </ViewShot>
                <TouchableOpacity style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', marginLeft: 20 }}
                    onPress={() => {
                        navigation.navigate(PAY_PEOPLE.RE_INITIATE_PAYMENT, { ...params, isHistory: true })
                    }}>
                    <Image
                        style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, }}
                        source={reloadIcon}
                    />
                    <Text style={{ ...FONTS.h3, color: theme.colors.lightGreen, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginHorizontal: 10 }}>{t(AUTH_KEYS.PAY_PEOPLE.REINITIATE_PAYMENT)}</Text>
                </TouchableOpacity>
                {/* {params.showReceipt && <> */}
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', marginLeft: 20 }}
                        onPress={saveReceipt}>
                        <Image
                            style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, }}
                            source={download}
                        />
                        <Text style={{ ...FONTS.h3, color: theme.colors.lightGreen, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginHorizontal: 10 }}>{t(AUTH_KEYS.PAY_PEOPLE.SAVE_RECEIPT)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 10 }}
                        onPress={shareReceipt}>
                        <Image
                            style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, }}
                            source={shareIcon}
                        />
                        <Text style={{ ...FONTS.h3, color: theme.colors.lightGreen, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginHorizontal: 10 }}>{t(AUTH_KEYS.PAY_PEOPLE.SHARE_RECEIPT)}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
        {isLoading && <LoaderComponent />}
    </SafeAreaView>
    )

}
export default HistoryDetailScreen;