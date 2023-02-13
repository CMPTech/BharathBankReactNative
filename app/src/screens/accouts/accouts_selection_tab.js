import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { fontName, fontSize, FONTS, SIZES } from "../../../styles/global.config";
import {
    rightArrow
} from '../../../assets/icons'
import Animated, { interpolate, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import { CrossIcon } from '../../../assets/svg';
import { currencyFormat } from "../../utils/amount-util";
import { ACCOUNTS } from '../../routes';
const AccountsTab = ({ navigation, route, accountModelSharedValue1, accountModelSharedValue2, accountList }) => {
    const [selectedTab, setSelected] = useState('Banking accounts')

    const [selectedValueTab, setSelectedValue] = useState('SBA')
    const tabs = ['Banking accounts', 'Deposits', 'Loans']

    const tabsValue = ['SBA', 'TDA', "LAA"]

    const accountModelContainerAnimatedStyle = useAnimatedStyle(
        () => {
            return {
                opacity: interpolate(accountModelSharedValue1.value, [SIZES.height, 0], [0, 1]),
                transform: [
                    {
                        translateY: accountModelSharedValue1.value
                    }
                ]
            }
        }
    )
    const accountModelBgAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(accountModelSharedValue2.value, [SIZES.height, 0], [0, 1])
        }
    })
    const accountModelContentanimatedStyle = useAnimatedStyle(
        () => {

            return {
                opacity: interpolate(accountModelSharedValue2.value, [SIZES.height, 0], [0, 1]),
                transform: [{
                    translateY: accountModelSharedValue2.value
                }]
            }
        }
    )
    return (
        // Main container
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                width: SIZES.width,
                height: SIZES.height,
                backgroundColor: "#4370e7",
            }
                //, accountModelContainerAnimatedStyle]
            }
        >
            {/* Background container */}
            {/* <Animated.View
                style={[
                    {
                        flex: 1,
                        height: SIZES.height*0.8,
                        width: SIZES.width,
                        backgroundColor: "#4370e7",
                        flexDirection: 'row',

                    },
                    accountModelBgAnimatedStyle
                ]}
            >
                <TouchableOpacity style={{ margin: 20, alignSelf: 'flex-start', opacity: 0.8 }}
                    onPress={() => {
                        accountModelSharedValue2.value = withTiming(SIZES.height, { duration: 500 })
                        accountModelSharedValue1.value = withDelay(500, withTiming(SIZES.height, { duration: 100 }))
                    }}
                >
                    <CrossIcon color={'#00ffce'} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', justifyContent: 'center', marginTop: 20, ...FONTS.h3, color: '#FFF', opacity: 0.8, marginHorizontal: 20 }}>My Accounts</Text>
            </Animated.View> */}

            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    height: SIZES.height * 0.9,
                    width: SIZES.width,
                    backgroundColor: '#FFFF',

                }
                    //, accountModelContentanimatedStyle]
                }
            >
                <View
                    style={{
                        backgroundColor: "#4370e7",
                        flexDirection: 'row',
                        padding: 20,
                    }}
                >
                    <TouchableOpacity style={{ alignSelf: 'flex-start', opacity: 0.8 }}
                        onPress={() => {
                            accountModelSharedValue2.value = withTiming(SIZES.height, { duration: 500 })
                            accountModelSharedValue1.value = withDelay(500, withTiming(SIZES.height, { duration: 100 }))
                        }}
                    >
                        <CrossIcon color={'#00ffce'} />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.h3, color: '#FFF', opacity: 0.8, marginHorizontal: 20 }}>My Accounts</Text>

                </View>

                {/* Header Tabs  Banking accounts , Deposits ,Loans */}
                <View
                    style={{
                        backgroundColor: "#4370e7",
                        flexDirection: 'row',
                        justifyContent: 'space-evenly'
                    }}
                >
                    {tabs.map((v, index) => {
                        return (<TouchableOpacity
                            onPress={() => {
                                setSelected(v)
                                setSelectedValue(tabsValue[index])
                            }}
                        >
                            <Text
                                style={{
                                    ...FONTS.h3,
                                    padding: 10,
                                    color: selectedTab === v ? '#00ffce' : '#FFF'
                                }}
                            >
                                {v}
                            </Text>
                        </TouchableOpacity>)
                    })}
                </View>
                {/* <Text style={{ ...FONTS.h3, opacity: 0.8, textAlign: 'left', marginTop: 10, marginLeft: 20 }}>Home bank accounts</Text> */}
                {accountList.filter(v => v.acctType === selectedValueTab).length > 0 ?
                    <FlatList
                        data={accountList.filter(v => v.acctType === selectedValueTab)}
                        extraData={accountList.filter(v => v.acctType === selectedValueTab)}
                        keyExtractor={(item, index) => `${index}`}
                        style={{ marginLeft: 20 }}
                        renderItem={({ item, index }) => {
                            return (<TouchableOpacity
                                onPress={() => {
                                    if (selectedValueTab === ('SBA' || "CAA"|| "ODA")) {
                                        navigation.navigate(ACCOUNTS.ACCOUNT_SUMMERY, { accountItem: item });
                                    } else if (selectedValueTab === 'TDA') {
                                        navigation.navigate(ACCOUNTS.VIEW_DEPOSIT_ACCOUNT_DETAILS, { accountItem: item });
                                    }
                                    else if (selectedValueTab === "LAA") {
                                        navigation.navigate(ACCOUNTS.LOAN_ACCOUNT_DETAILS, { accountItem: item });
                                    }


                                }}>
                                <View style={{ paddingTop: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <View style={{ width: '50%' }}>
                                        <Text style={{ ...FONTS.h3, color: '#000', textTransform: 'capitalize' }}>{item.acctDesc}</Text>
                                        <Text>{item.acctNo}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: '40%', justifyContent: 'flex-end', alignItems: 'center', marginRight: 20 }}>
                                        <Text style={{ ...FONTS.h3, color: '#000' }}>{selectedValueTab === "LAA" ? `${(item.outstandingAmt !== null && item.outstandingAmt !== undefined) ? `₹${item.outstandingAmt.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}` : ''}` : `${(item.availableBalance !== null && item.availableBalance !== undefined) ? `₹${item.availableBalance.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}` : ''}`}</Text>
                                        <Image
                                            style={{ width: 20, height: 20, marginLeft: 10, tintColor: "#479ae8" }}
                                            source={rightArrow}
                                        />
                                    </View>
                                </View>
                                <View style={{ height: 1, marginTop: 5, backgroundColor: '#F3F4F6' }} />
                            </TouchableOpacity>)
                        }}
                    />
                    :
                    <Text style={{ ...FONTS.h3, opacity: 0.8, textAlign: 'center', marginTop: 50, }}>No data found</Text>
                }

            </View>

        </View>)

}
export default AccountsTab;
