import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image, SafeAreaView, ImageBackground, BackHandler ,Platform} from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { HOME, PAY_PEOPLE } from '../../routes';
import {
    closeIcon,
    summarycardBottom,
    bgElement,
    reloadIcon,
    shareIcon
} from '../../../assets/icons'
import { imageBackground } from '../../../assets/images';
import { amountFormat } from '../../utils/amount-util';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { LoaderComponent} from '../../components';
import RNFetchBlob from 'rn-fetch-blob';
import Home from '../../api/dashboard';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import ZigzagView from "react-native-zigzag-view"
const AuthrizationSuccessScreen = ({ navigation, route }) => {
    const { theme, changeTheme } = useContext(AppContext)
    const { params } = route;
    const selectedProfileDetails = useSelector(profileSelector);
    const [isLoading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const backPressHandler = useCallback(() => {
        if (isFocused) {
            navigation.pop(4)
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
                    navigation.pop(4)
                }}>
                <Image
                    source={closeIcon}
                    style={{ width: 20, height: 20, tintColor: theme.colors.lightGreen, marginRight: 30 }}
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
                style={{ margin: 19, paddingBottom: 60, backgroundColor: '#ffffffff', borderRadius: 5 }}

            >

                <ImageBackground
                    source={bgElement}
                >
                    <Image
                        style={{ width: 80, height: 80, marginTop: 20, marginLeft: 10 }}
                        source={require('./../../../assets/images/success_animation.gif')} />
                </ImageBackground>
                <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, textAlign: 'center', marginBottom: 20, marginTop: 10, marginHorizontal: 10 }}>{params.message}</Text>
                {params.referenceNo !== null && (<View style={{ padding: 10, flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ ...FONTS.body4, color: colors.textColorgrey, width: '50%' }}>{`${'Reference no.'} : `}</Text>
                    <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, width: '50%' }}>{params.referenceNo}</Text>

                </View>)}
                {renderDetail(`${"Destination account"} :`, `${params.destAccountNo}`)}
                {renderDetail(`${"Source account"} :`, `${params.srcAccountNo}`)}
                {renderDetail(`${"Amount"} :`, `${amountFormat(params.amount)}`)}
                {renderDetail(`${"Remarks"} :`, `${params.remarks}`)}



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
export default AuthrizationSuccessScreen;