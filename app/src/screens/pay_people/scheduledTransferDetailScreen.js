import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ImageBackground, } from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import {
    closeIcon,
    summarycardBottom,
    bgElement,
} from '../../../assets/icons'
import { imageBackground } from '../../../assets/images';
import { amountFormat } from '../../utils/amount-util';
import { LoaderComponent, } from '../../components';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import Home from '../../api/dashboard';
import { showMessage } from "react-native-flash-message";
import { PAY_PEOPLE } from '../../routes';
import ZigzagView from "react-native-zigzag-view"

const ScheduleTransferDetailScreen = ({ navigation, route }) => {
    const { theme, changeTheme } = useContext(AppContext)
    const { params } = route;
    const [isLoading, setLoading] = useState(false);
    const selectedProfileDetails = useSelector(profileSelector);
    const cancelScheduledTransfer = useCallback(async () => {

        try {
            let request =
            {
                "scheduledId": params.id,
                "scheduledDate": params.scheduledDate,
                "amount": params.amount,
                "remarks": "",
                "remarksTag": "",
                "numberOfInstallments": params.pendingInstallments,
                "frequency": params.frequency,
                "actionType": "C",   // actionType shouble be 'M' for modification and 'C' for cancel.
                "profileId": selectedProfileDetails.profileId,
                "requestId": "MODIFY_CANCEL_VERIFY",
                "module": "FUNDTRANSFER"
            }
            // {
            //     "id": params.id,
            //     "profileId": selectedProfileDetails.profileId,
            // }
            setLoading(true);
            const response = await Home.modifyOrCancelScheduledTxnCall(request);
            if (response.otpEnabled) {
                navigation.navigate(PAY_PEOPLE.MODIFY_SCHEDULED_TXN_OTP, { requestData: request })
            }
            else {
                nextStep()
            }
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
        [navigation]
    );
    const modifyScheduledTransfer = useCallback(async () => {
        navigation.navigate(PAY_PEOPLE.MODIFY_SCHEDULED_TXN, { ...params })

    }, [navigation]);
    const nextStep = useCallback(async () => {
        try {
            setLoading(true);
            let request = {
                "scheduledId": params.id,
                "scheduledDate": params.scheduledDate,
                "amount": params.amount,
                "remarks": "",
                "remarksTag": "",
                "numberOfInstallments": params.pendingInstallments,
                "frequency": params.frequency,
                "actionType": "C",   // actionType shouble be 'M' for modification and 'C' for cancel.
                "profileId": selectedProfileDetails.profileId,
                "requestId": "MODIFY_CANCEL_VERIFY",
                "module": "FUNDTRANSFER"
            }
            request.otp = "123456"
            const response = await Home.modifyOrCancelScheduledTxnConfirmCall(request);
            showMessage({
                message: "",
                description: response.message,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
            navigation.navigate(PAY_PEOPLE.SCHEDULED_TRANSFERS)
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
        [navigation,]
    );
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
                    style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, marginRight: 10 }}
                />
            </TouchableOpacity>
            <Text style={FONTS.headerText}>{"Summary"}</Text>
            {(params.scheduledStatus === "PENDING" || params.scheduledStatus === "MODIFY") &&
                (
                    <View style={{ flexDirection: 'row', position: 'absolute', right: 20 }}>
                        {params.scheduledStatus === "MODIFY" && (<TouchableOpacity style={{ marginRight: 20 }}
                            onPress={modifyScheduledTransfer}
                        >
                            <Text style={{
                                color: theme.colors.lightGreen,
                                fontSize: fontSize.header3,
                                fontFamily: fontName.medium,
                            }}>{"Modify"}</Text>
                        </TouchableOpacity>)

                        }

                        <TouchableOpacity style={{}}
                            onPress={cancelScheduledTransfer}
                        >
                            <Text style={{
                                color: theme.colors.lightGreen,
                                fontSize: fontSize.header3,
                                fontFamily: fontName.medium,
                            }}>{"Cancel"}</Text>
                        </TouchableOpacity>
                    </View>
                )

            }

        </View>)
    }

    const renderDetail = (label, value) => {
        if (value === null || value === undefined || value == "") {
            return null
        }
        return (<>
            <View style={{ padding: 10, flexDirection: 'row', marginTop: 10 }}>
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

            <ZigzagView
                backgroundColor="transparent"
                surfaceColor="#FFF"
                top={false}
                style={{ marginHorizontal: 20, borderTopLeftRadius: 5, borderTopRightRadius: 5, marginTop: 20 }}
            >
                <View
                    style={{ marginLeft: 20, marginRight: 20, paddingBottom: 60, backgroundColor: '#ffffffff' }}>

                    <ImageBackground
                        source={bgElement}
                    >
                        <Image
                            style={{ width: 80, height: 80, marginTop: 20, marginLeft: 10 }}
                            source={require('./../../../assets/images/success_animation.gif')} />
                    </ImageBackground>
                    <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginBottom: 20, marginTop: 10, marginHorizontal: 10 }}>{params.message}</Text>
                    {params.referenceNo !== null && (<View style={{ padding: 10, flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, width: '50%' }}>{`${'Reference no.'} : `}</Text>
                        <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, width: '50%' }}>{params.referenceNo}</Text>

                    </View>)}
                    {renderDetail(`${"Destination account"} :`, `${params.destAccount}`)}
                    {renderDetail(`${"Source account"} :`, `${params.srcAccountNo}`)}
                    {renderDetail(`${"Amount"} :`, `${amountFormat(params.amount)}`)}
                    {/* {renderDetail(`${"Progress"} :`, `${params.transferStatus}`)} */}
                    {renderDetail(`${"Ends on"} :`, `${params.scheduledDate}`)}
                    {renderDetail(`${"Status"} :`, `${params.currentStatus}`)}
                    {/* <Image
                    source={summarycardBottom}
                    style={{ position: 'absolute', bottom: -30, left: 0, width: SIZES.width * 0.903 }}
                /> */}
                </View>
            </ZigzagView>
        </ImageBackground>
        {isLoading && <LoaderComponent />}
    </SafeAreaView>
    )

}
export default ScheduleTransferDetailScreen;