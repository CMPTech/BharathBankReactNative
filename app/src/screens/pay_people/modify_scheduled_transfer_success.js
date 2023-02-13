import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image, SafeAreaView, ImageBackground, BackHandler, Platform } from 'react-native';
import { fontName, FONTS, colors } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { PAY_PEOPLE } from '../../routes';
import {
    closeIcon,
    bgElement,
} from '../../../assets/icons'
import { imageBackground } from '../../../assets/images';
import { amountFormat } from '../../utils/amount-util';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { LoaderComponent } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import ZigzagView from "react-native-zigzag-view"
import { setRefreshAccdata } from '../../store/actions/user.action';
import moment from "moment";
const ModifyScheduledPaymentSuccessScreen = ({ navigation, route }) => {
    const { theme, changeTheme } = useContext(AppContext)
    const { params } = route;
    const [isLoading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
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

                    navigation.pop(5)
                }}>
                <Image
                    source={closeIcon}
                    style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, marginRight: 10 }}
                />
            </TouchableOpacity>
            <Text style={FONTS.headerText}>{"Summary"}</Text>
        </View>)
    }
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
                        {renderDetail(`${"Remarks"} :`, `${params.remarks}`)}
                        {/* {renderDetail(`${"Scheduled date"} :`, `${moment(params.scheduledDate).format('DD/MM/YYYY  LT')}`)} */}
                        {/* {renderDetail(`${"Send Via"} :`, `${transferType[params.transferType]}`)} */}

                    </View>

                </ZigzagView>
            </ScrollView>
        </ImageBackground>
        {isLoading && <LoaderComponent />}
    </SafeAreaView>
    )

}
export default ModifyScheduledPaymentSuccessScreen;