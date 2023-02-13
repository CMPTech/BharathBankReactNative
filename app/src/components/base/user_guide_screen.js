import React, { useEffect, useState, useContext, useRef } from "react";
import {
    View,
    Text,
    Dimensions,
    Image,
    Animated,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { colors, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import {
    helpOne,
    helpTwo,
    helpThree,
    helpFoure
} from '../../../assets/images'
import { useDispatch } from 'react-redux';
import { setUserFirstLogin } from '../../store/actions/app.action'
export default function UserGuideComponent({ }) {
    const { theme, changeTheme } = useContext(AppContext);
    const dispatch = useDispatch()
    const imageList = [helpOne,
        helpTwo,
        helpThree,
        helpFoure]
    const scrollX = useRef(new Animated.Value(0)).current;
    const Dots = () => {
        const dotPosition = Animated.divide(scrollX, SIZES.width)
        return (<View style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 30,
            justifyContent: 'center'
        }}>
            {imageList.map((item, index) => {
                const dotOpacity = dotPosition.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0.9, 1, 0.9],
                    extrapolate: 'clamp'
                })
                const dotColor = dotPosition.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: ['#FFFF', '#00ffce', '#FFFF'],
                    extrapolate: 'clamp'
                })
                return (
                    <Animated.View
                        key={`dot-${index}`}
                        style={{
                            borderRadius: 5,
                            marginHorizontal: 6,
                            width: 8,
                            height: 8,
                            opacity: dotOpacity,
                            backgroundColor: dotColor,
                        }}
                    />
                )
            })

            }
        </View>)
    }
    const renderItem = ({ item, index }) => {
        return (<ImageBackground
            style={{ width: SIZES.width }}
            source={item}
        >
            <Dots />
            <TouchableOpacity style={{ alignItems: 'center', position: 'absolute', top: 30, right: 30 }}
                onPress={() => {
                    dispatch(setUserFirstLogin(false))
                }}
            >
                <Text style={{ color: '#FFF', alignSelf: 'flex-end', }}>{`${index === imageList.length - 1 ? 'Done' : 'Skip'}`}</Text>
            </TouchableOpacity>
        </ImageBackground>)
    }
    return (
        <View style={{
            height: '100%',
            position: "absolute",
            left: 0,
            right: 0,
            //top: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: 'rgba(52, 52, 52, 0.8)'
        }}>
            <Animated.FlatList
                // ref={flatListRef}
                data={imageList}
                extraData={imageList}
                pagingEnabled
                horizontal
                snapToAlignment='center'
                snapToInterval={SIZES.width}
                decelerationRate='fast'
                scrollEventThrottle={16}
                disableIntervalMomentum={true}
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
                renderItem={renderItem}
                keyExtractor={(item, index) => `${index}`}
            />
            {/* Dots  */}
            {/* <Dots /> */}
        </View>
    )

}
