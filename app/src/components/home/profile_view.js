import React, { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { FONTS, SIZES, fontName } from "../../../styles/global.config";
import { DownArrowIcon } from '../../../assets/svg'
import Animated, { interpolate, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import { AppContext } from '../../../themes/AppContextProvider';
import { profileSelector, userDetailsSelector } from '../../store/selectors';
import { useSelector } from 'react-redux';

const ProfileModel = ({ profileModelSharedValue1, profileModelSharedValue2 }) => {

    const { theme, changeTheme } = useContext(AppContext)


    const selectedProfileDetails = useSelector(profileSelector)

    const userProfile = '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'
    const filterModelContainerAnimatedStyle = useAnimatedStyle(
        () => {
            return {
                opacity: interpolate(profileModelSharedValue1.value, [SIZES.height, 0], [0, 1]),
                transform: [
                    {
                        translateY: profileModelSharedValue1.value
                    }
                ]
            }
        }
    )
    const filterModelBgAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(profileModelSharedValue2.value, [SIZES.height, 0], [0, 1])
        }
    })
    const filterModelContentanimatedStyle = useAnimatedStyle(
        () => {

            return {
                opacity: interpolate(profileModelSharedValue2.value, [SIZES.height, 0], [0, 1]),
                transform: [{
                    translateY: profileModelSharedValue2.value
                }]
            }
        }
    )
    return (
        // Main container
        <Animated.View
            style={[{
                position: 'absolute',
                top: 0,
                width: SIZES.width,
                height: SIZES.height * 0.2
            }, filterModelContainerAnimatedStyle]}
        >
            {/* Background container */}
            <Animated.View
                style={[
                    {
                        flex: 1,
                        height: SIZES.height * 0.5,
                        width: SIZES.width,
                        // backgroundColor: "rgba(0, 0, 0, 0.2)",
                    },
                    filterModelBgAnimatedStyle
                ]}
            >

            </Animated.View>

            {/* Content container */}
            <Animated.View
                style={[{
                    position: 'absolute',
                    top: 0,
                    height:Platform.OS==='android'?SIZES.height * 0.16:SIZES.height * 0.12,
                    width: SIZES.width,
                    backgroundColor: '#FFFF',

                }, filterModelContentanimatedStyle]}
            >
                {/* Header  */}
                <View
                    style={{
                        flexDirection: 'row',
                        // paddingHorizontal: SIZES.padding,
                    }}
                >
                   
                    <View style={{margin:10}}>
                        <Text style={{ color: theme.colors.grey, ...FONTS.body5, marginTop: 10 }}>
                            Welcome back!
                        </Text>
                        <Text style={{ color: theme.colors.grey, ...FONTS.h2, marginTop: 5 }}>
                        { selectedProfileDetails?.profileName}
                        </Text>
                        <Text style={{ color: '#455362', fontSize: 10, fontFamily: fontName.regular, marginTop: 10 ,paddingBottom:20}}>
                            {" Last login: " + new Date().toLocaleString()}
                        </Text>
                        
                    </View>

                    {/* a
                    <Image
                        source={{ uri: `data:image/png;base64,${userProfile}` }}
                        style={{ height: 70, width: 80, position: 'absolute', right: 20 }}
                    /> */}


                </View>
                <TouchableOpacity
                    style={{ backgroundColor: '#FFF', width: 35, height: 35, alignSelf: 'center', elevation: 5, shadowColor: "#000", borderRadius: 20, position: 'absolute', bottom: -12 }}
                    onPress={() => {
                        profileModelSharedValue2.value = withTiming(SIZES.height, { duration: 500 })
                        profileModelSharedValue1.value = withDelay(500, withTiming(SIZES.height, { duration: 100 }))
                    }}
                ><DownArrowIcon />
                </TouchableOpacity>
            </Animated.View>

        </Animated.View>
    )
}
export default ProfileModel