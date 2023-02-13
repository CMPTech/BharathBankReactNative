import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image, Platform } from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import {
    rightArrow, closeIcon
} from '../../../assets/icons'
import Animated, { interpolate, useAnimatedStyle, withDelay, withTiming, useSharedValue, } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon } from '../../../assets/svg';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { useTranslation } from 'react-i18next';
import { AppContext } from "../../../themes/AppContextProvider";
const GetIFSCTab = ({ navigation, route, ifscModelSharedValue1, ifscModelSharedValue2, ifscList, onBranchClick, onBankClick, bankName, branchName }) => {
    const { theme, changeTheme } = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const ifscModelContainerAnimatedStyle = useAnimatedStyle(
        () => {
            return {
                opacity: interpolate(ifscModelSharedValue1.value, [SIZES.height, 0], [0, 1]),
                transform: [
                    {
                        translateY: ifscModelSharedValue1.value
                    }
                ]
            }
        }
    )
    const ifscModelContentanimatedStyle = useAnimatedStyle(
        () => {

            return {
                opacity: interpolate(ifscModelSharedValue2.value, [SIZES.height, 0], [0, 1]),
                transform: [{
                    translateY: ifscModelSharedValue2.value
                }]
            }
        }
    )
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
                padding: 20
            }}>
                <TouchableOpacity
                    style={{ alignItems: 'center', }}
                    onPress={() => {
                        ifscModelSharedValue2.value = withTiming(SIZES.height, { duration: 500 })
                        ifscModelSharedValue1.value = withDelay(500, withTiming(SIZES.height, { duration: 100 }))
                    }}
                >
                    <Image
                        source={closeIcon}
                        style={{ width: 15, height: 15, tintColor: theme.colors.lightGreen, marginHorizontal: 10 }}
                    />
                </TouchableOpacity>
                <Text style={{ ...FONTS.h2, color: '#FFF', fontFamily: fontName.medium }}>{t(AUTH_KEYS.PAY_PEOPLE.GET_IFSC)}</Text>

            </View>
        </LinearGradient>)
    }
    const RenderItem = ({ label, value, onPress }) => {
        return (<TouchableOpacity style={{ marginTop: 30, marginLeft: 20, marginRight: 20, }}
            onPress={onPress}
        >
            {value !== "" && (<Text style={{ fontFamily: fontName.regular, padding: 5, fontSize: fontSize.textNormal, color: theme.colors.black, opacity: 0.8 }}>{label}</Text>)}
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                {value !== undefined && <Text style={{ fontFamily: value == "" ? fontName.medium : fontName.regular, padding: 5, fontSize: value == "" ? fontSize.textNormal : fontSize.header3, color: value == "" ? theme.colors.grey : theme.colors.textConfirmation }}>{value == "" ? label : value}</Text>}
                <Image
                    source={rightArrow}
                    style={{ width: 20, height: 20, tintColor: theme.colors.buttonColor }}
                />
            </View>

            <View style={{ height: 1, backgroundColor: colors.dividerColor }} />
        </TouchableOpacity>)
    }
    return (
        <Animated.View
            style={[{
                position: 'absolute',
                bottom: 0,
                width: SIZES.width,
                height: Platform.OS === 'android' ? SIZES.height : SIZES.height * .9,
                // backgroundColor: "#4370e7",
            }, ifscModelContainerAnimatedStyle]}
        >
            <Animated.View
                style={[{
                    position: 'absolute',
                    bottom: 0,
                    height: Platform.OS === 'android' ? SIZES.height : SIZES.height * .9,
                    width: SIZES.width,
                    backgroundColor: '#FFFF',

                }, ifscModelContentanimatedStyle]}
            >

                {/*Header  */}
                {renderHeader()}
                {/*Flat List*/}
                <RenderItem
                    label={t(AUTH_KEYS.PAY_PEOPLE.PAYEE_BANK)}
                    value={bankName}
                    onPress={onBankClick}
                />
                <RenderItem
                    label={t(AUTH_KEYS.PAY_PEOPLE.BRANCH_NAME)}
                    value={branchName}
                    onPress={onBranchClick}
                />


            </Animated.View>
        </Animated.View>
    )

}
export default GetIFSCTab;