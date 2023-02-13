import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList, ScrollView,
} from 'react-native';
import { fontName, fontSize, FONTS, SIZES, currencyValue, colors } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { LoaderComponent, BottomButton, AlerComponent, AuthHeader, MainButton } from '../../components';
import { PAY_PEOPLE } from '../../routes';
import Home from '../../api/dashboard';
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import {
    summarycardBottom, radioNotSelected, radioSelected
} from '../../../assets/icons'
import StyleTextView from '../../components/input/StyleTextView';
import { amountFormat } from '../../utils/amount-util';
export default function ShareWithAuthorizerScreen({ navigation, route }) {
    const { params } = route;
    const { theme, changeTheme } = useContext(AppContext);
    const selectedProfileDetails = useSelector(profileSelector);
    const [isLoading, setLoading] = useState(false);
    const [authList, setAuthList] = useState(params.authUsers.map(v => {
        const item = v.split(',')
        return ({
            userId: item[0],
            name: item[1],
            mandatoryAuth: item[2],
            isSelected: false
        })

    }));
    useEffect(() => {
    }, [])
    const shareWithauthorizer = useCallback(async (arr) => {

        try {
            let request = {
                "txnId": params.referenceNo,
                "profileId": selectedProfileDetails.profileId,
                "authUsers": authList.filter((item) => item.isSelected)
                    .map((item) => {
                        return item.userId
                    })
            }
            setLoading(true);
            const response = await Home.getShareWithauthorizer(request);
            navigation.navigate(PAY_PEOPLE.MENU)
            setLoading(false);
            showMessage({
                message: "",
                description: response.message,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
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
        [navigation, authList]
    );
    return (<SafeAreaView
        style={{
            flex: 1,
        }}
    >
        <View style={{
            flex: 1,
        }}>
            <AuthHeader
                title={"Share with Authoriser"}
                navigation={navigation}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 150
                }}
            >

                <View style={{ marginHorizontal: 20, backgroundColor: theme.colors.white, height: 120, marginTop: 10, padding: 20 }}>

                    <View style={{ flexDirection: 'row' }}>
                        <StyleTextView value={"10,Nov 2022"}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.regular,
                                width: '50%',
                                color: theme.colors.grey,

                            }} />
                        <StyleTextView value={"Created"}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                width: '50%',
                                color: theme.colors.headingTextColor,

                            }} />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <StyleTextView value={params.accountType}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                width: '50%',
                                color: theme.colors.headingTextColor,

                            }} />
                        <StyleTextView value={`${amountFormat(params.amount)}`}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                width: '50%',
                                color: theme.colors.headingTextColor,

                            }} />
                    </View>
                    <Image
                        source={summarycardBottom}
                        style={{ position: 'absolute', bottom: -30, left: 0, width: SIZES.width * 0.903 }}
                    />
                </View>
                <StyleTextView value={`${"Total number of authorizers"} : ${params.noOfAuthorizers}`}
                    style={{
                        fontSize: fontSize.textLarge,
                        fontFamily: fontName.medium,
                        marginTop: 30,
                        marginHorizontal: 20,
                        color: theme.colors.headingTextColor,

                    }} />
                <StyleTextView value={`${"Number of mandatory authorizers"} : ${params.noOfMandatoryAuthorizers}`}
                    style={{
                        fontSize: fontSize.textLarge,
                        fontFamily: fontName.medium,
                        marginTop: 10,
                        marginHorizontal: 20,
                        color: theme.colors.headingTextColor,

                    }} />
                <FlatList
                    data={authList}
                    showsVerticalScrollIndicator={false}
                    extraData={authList}
                    style={{ flex: 1 }}
                    ListHeaderComponent={() => {
                        return (<StyleTextView value={"Select authorizers"}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                marginHorizontal: 20,
                                marginTop: 10,
                                color: theme.colors.headingTextColor,

                            }} />)


                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={{ marginVertical: 10 }}
                                onPress={() => {
                                    const dummyData = authList
                                    let arr = dummyData.map((items, ind) => {
                                        if (ind == index) {
                                            items.isSelected = !items.isSelected
                                            // selectedValue = (items[dropDownlabel])
                                        }
                                        return { ...items }
                                    })
                                    setAuthList(arr)
                                }}>
                                <View style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 50, height: 50, backgroundColor: colors.buttonColor, marginRight: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ alignSelf: 'center', ...FONTS.h1, color: '#FFF' }}>{item.name.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}</Text>
                                    </View>
                                    <View style={{ width: '75%' }}>
                                        <StyleTextView value={item.name.toLocaleUpperCase()}
                                            style={{
                                                fontSize: fontSize.textLarge,
                                                fontFamily: fontName.medium,
                                                marginTop: 10,
                                                color: theme.colors.headingTextColor,

                                            }} />
                                        <StyleTextView value={item.mandatoryAuth == "true" ? "Mandatory authorizer" : "Authorizer"}
                                            style={{
                                                fontSize: fontSize.textSmall,
                                                fontFamily: fontName.regular,
                                                color: item.mandatoryAuth == "true" ? '#db7093' : theme.colors.grey,
                                            }} />
                                    </View>
                                    <Image
                                        source={item.isSelected ? radioSelected : radioNotSelected}
                                        style={{ width: 25, height: 25, }}
                                    />
                                </View>
                                <View style={{ height: 0.5, opacity: 0.5, backgroundColor: colors.dividerColor, marginTop: 10 }} />
                            </TouchableOpacity>
                        )
                    }}

                />
            </ScrollView>
            <View style={{ width: SIZES.width, flexDirection: 'row' }}>
                <MainButton
                    disabled={true}
                    noBorder
                    btnContainerStyle={{ width: "50%" }}
                    title={`${authList.filter(v => v.isSelected === true).length}/${authList.length} ${'selected'}`}
                />
                <MainButton
                    disabled={authList.filter(v => v.isSelected).length <= 0}
                    title={"Send request"}
                    noBorder
                    onPress={shareWithauthorizer}
                    btnContainerStyle={{ width: "50%" }}
                />
            </View>
        </View>

        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}