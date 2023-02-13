import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { colors, fontName, FONTS, SIZES, fontSize } from "../../../styles/global.config";
import { LOCATION, PAY_PEOPLE, FAQS } from "../../routes";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import {
    noSearchIcon,
    rightArrow,
    favioritIcon,
    favioritSelectedIcon,
    settingMenu
} from '../../../assets/icons';
import { AddPayeeIcon, StarselectedIcon, StarUnselectedIcon, } from '../../../assets/svg'
import { color } from 'react-native-reanimated';
import { LoaderComponent, SearchComponent, AlerComponent } from '../../components'

import Home from '../../api/dashboard';
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { AppContext } from "../../../themes/AppContextProvider";
import Startunselected_icon from '../../../assets/svg/startunselected_icon';
import { getAlphabetsAndNumbersSpaceOnly } from '../../utils/amount-util';
const PayeesListItem = ({ navigation, setLoading, filterPayeeList, payeesList, setPayeesList, setfilterPayeeList }) => {
    const { theme, changeTheme } = useContext(AppContext)
    const [hasMore, setHasMore] = useState(true);
    const [deletePayee, setDeletePayee] = useState(false);
    const [payeeInfo, setPayeeInfo] = useState(null)
    const [page, setPage] = useState(1)
    const selectedProfileDetails = useSelector(profileSelector);
    const [otp, setOtp] = useState('123456');
    const { t, i18n } = useTranslation();
    const [searchText, setSearchText] = useState([])
    const getPayeeList = useCallback(async () => {
        try {
            let request = {
                "profileId": selectedProfileDetails.profileId,
                "page": page,
                "size": 10,
            };
            setLoading(true);
            const response = await Home.getPayeeListApi(request);
            setLoading(false);
            setPage(page + 1)
            if (response.totalItems > payeesList.length) {
                setHasMore(true)
            }
            else {
                setHasMore(false)
            }
            setfilterPayeeList([...payeesList, ...response.payeeList]);
            setPayeesList([...payeesList, ...response.payeeList]);
        } catch (error) {
            setLoading(false);
            showMessage({
                message: "Payee List",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation, payeeInfo, payeesList, filterPayeeList, page]
    );
    const deletePayeeApi = useCallback(async (item) => {
        try {
            let request = {
                "payeeId": payeeInfo.payeeId,
                "payeeNickName": payeeInfo.payeeNickName,
                "profileId": selectedProfileDetails.profileId,
            }
            setLoading(true);
            const response = await Home.getDeleteVerifyApi(request);
            setLoading(false);
            if (response.otpEnable) {
                navigation.navigate(PAY_PEOPLE.DELETE_PAYEE_OTP, { requestData: request })
            }
            else {
                deletePayeeConfirmApi();
            }
        } catch (error) {
            setLoading(false);
            showMessage({
                message: "Payee List",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation, payeeInfo]
    );
    const deletePayeeConfirmApi = useCallback(async (item) => {
        try {
            let request = {
                "payeeId": payeeInfo.payeeId,
                "payeeNickName": payeeInfo.payeeNickName,
                "profileId": selectedProfileDetails.profileId,
                "otp": otp
            }
            setLoading(true);
            const response = await Home.getDeleteConfirmApi(request);
            setLoading(false);
            const dummyData = payeesList
            let arr = dummyData.filter((items, ind) => items.payeeId !== payeeInfo.payeeId)
            setfilterPayeeList(arr)
            setPayeesList(arr)
        } catch (error) {
            setLoading(false);
            showMessage({
                message: "Payee List",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation, payeeInfo, filterPayeeList, payeesList,]
    );


    const addPayeeToFavourit = useCallback(async (item) => {
        try {
            let request = {
                "payeeId": item.payeeId,
                "payeeNickName": item.payeeNickName,
                "profileId": selectedProfileDetails.profileId,
                "payeeAccountNo": item.payeeAccountNo,
                "active": item.activeStatus,
                "ifscCode": item.ifscCode,
                "branchName": item.bankBranch,
                "favorites": item.favourite === "N" ? "Y" : "N",
            }
            setLoading(true);
            const response = await Home.getAddToFavuoritApi(request);
            setLoading(false);
            const dummyData = payeesList
            let arr = dummyData.map((items, ind) => {
                if (items.payeeId === item.payeeId) {
                    items.favourite = item.favourite === "N" ? "Y" : "N"
                }
                return { ...items }
            })
            setfilterPayeeList(arr)
            setPayeesList(arr)
            showMessage({
                message: "Add Favourite",
                description: response.message,
                type: "success",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        } catch (error) {
            setLoading(false);
            showMessage({
                message: "Payee List",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation, payeeInfo, page, filterPayeeList, payeesList,]
    );
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 90; //Distance from the bottom you want it to trigger.
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    const renderPayeeListItem = ({ item, index }) => {
        const closePopUp = () => {
            let arr = filterPayeeList.map((items, ind) => {
                items.visible = false
                return { ...items }
            })
            setfilterPayeeList(arr);
        }
        return (
            <>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        // navigation.navigate(PAY_PEOPLE.PAYEE_DETAILS,{item})
                        navigation.navigate(PAY_PEOPLE.FUND_TRANSFER, { payItem: item, type: "Payee" })
                        // navigation.navigate(PAY_PEOPLE.PAY_DETAILS,{item})
                    }}
                    style={{ flexDirection: 'row', backgroundColor: '#FFFF', padding: 20, width: SIZES.width, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: 50, height: 50, backgroundColor: colors.buttonColor, marginRight: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ alignSelf: 'center', ...FONTS.h1, color: '#FFF' }}>{item.payeeNickName.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}</Text>
                    </View>
                    <View style={{ width: '55%' }}>
                        <Text style={{ ...FONTS.h3, color: theme.colors.textColor, marginBottom: 5 }}>{item.payeeNickName}</Text>
                        <Text style={{ color: theme.colors.textColor, marginBottom: 5 }}>{item?.bankName?.toLocaleUpperCase()}</Text>
                        <Text style={{ color: theme.colors.textColor, marginBottom: 5 }}>{item.payeeAccountNo}</Text>
                    </View>
                    <View style={{ width: '25%', flex: 0 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center',justifyContent:'space-around' }}>
                            <TouchableOpacity
                             style={{padding:10}}
                                onPress={() => {
                                    addPayeeToFavourit(item);
                                }}
                            >
                                {/* <Image
                        source={item.favourite === "Y" ? favioritSelectedIcon : favioritIcon}
                        style={{ width: 25, height: 25, tintColor: item.favourite === "Y" ? colors.buttonColor : colors.textColorgrey }}
                    /> */}

                                {item.favourite === "Y" ? <StarselectedIcon /> : <StarUnselectedIcon color1={theme.colors.grey} />}

                            </TouchableOpacity>
                            <Menu
                                visible={item.visible}
                                style={{  alignSelf: 'flex-end', borderColor: theme.colors.headingTextColor, borderWidth: 1, borderRadius: 0, marginRight: 1 }}
                                anchor={
                                    <TouchableOpacity
                                    style={{padding:10}}
                                        onPress={() => {
                                            let arr = filterPayeeList.map((items, ind) => {
                                                if (ind === index) {
                                                    items.visible = true
                                                }
                                                return { ...items }
                                            })
                                            setfilterPayeeList(arr);
                                        }}
                                    >
                                        <Image
                                            source={settingMenu}
                                            style={{ width: 20, height: 20, tintColor: colors.buttonColor }}
                                        />
                                    </TouchableOpacity>}
                                onRequestClose={closePopUp}
                            >
                                <MenuItem
                                    textStyle={{ fontFamily: fontName.medium, color: theme.colors.buttonColor }}

                                    onPress={() => {
                                        closePopUp()
                                        navigation.navigate(PAY_PEOPLE.PAY_DETAILS, { item })
                                    }}>
                                    {t(AUTH_KEYS.PAY_PEOPLE.PEYEE_INFO)}
                                </MenuItem>
                                <MenuItem
                                    textStyle={{ fontFamily: fontName.medium, color: '#ff0000' }}
                                    onPress={() => {
                                        closePopUp();
                                        setPayeeInfo(item)
                                        setDeletePayee(true)

                                    }}>{t(AUTH_KEYS.PAY_PEOPLE.DELETE_PAYEE)}</MenuItem>

                            </Menu>
                        </View>

                        <View style={{ alignItems: 'center' }} >
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate(PAY_PEOPLE.MY_PAYMENT_HISTORY, { item });
                                }}
                                style={{ alignItems: 'center', marginTop: 20 }}>
                                <Text style={{ ...FONTS.h4, color: '#1A70FF', marginBottom: 5 }}>My Payment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>


                <View style={{ height: 0.5,  backgroundColor: colors.dividerColor, marginTop: 10 }} />
            </>)
    }
    const addPayee = () => {
        return (<TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', marginBottom: 10 }}
            onPress={() => {
                navigation.navigate(PAY_PEOPLE.ADD_PAYEE, { bankName: '', branchName: '', ifsc: '' })
            }}
        >
            <View style={{ paddingHorizontal: 10 }}>
                <AddPayeeIcon />
            </View>
            <Text style={{ ...FONTS.h3, textAlign: 'center', alignSelf: 'center', color: colors.buttonColor, fontFamily: fontName.medium }}>{`${t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE)}`}</Text>
        </TouchableOpacity>
        )
    }
    const searchPayee = (e) => {
        let text = e.toLowerCase()
        let accounts = payeesList
        // search by food truck name
        let filteredName = accounts.filter((account) => {
            return account.payeeNickName.toLowerCase().match(text) || account.bankName.toLowerCase().match(text) || account.payeeAccountNo.toLowerCase().match(text)
        })

        // if no match and text is empty
        if (!text || text === '') {
            setfilterPayeeList(payeesList)
        }
        // if no name matches to text output
        else if (!Array.isArray(filteredName) && !filteredName.length) {
            setfilterPayeeList([])
        }
        // if name matches then display
        else if (Array.isArray(filteredName)) {
            setfilterPayeeList(filteredName)
        }
    }
    return (
        <>

            <View style={{
                //flex: 1,
                marginHorizontal: 10,
                height:'78%',
            }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (hasMore) {
                                getPayeeList()
                            }
                        }
                    }}
                    scrollEventThrottle={1000}
                >
                    <SearchComponent
                        onChangeText={(text) => {
                            setSearchText(getAlphabetsAndNumbersSpaceOnly(text))
                            searchPayee(getAlphabetsAndNumbersSpaceOnly(text))
                            // setfilterPayeeList(payeesList.filter((v) =>
                            //     v.payeeNickName.toLowerCase().includes(text.toLowerCase())
                            // ))

                        }}
                        value={searchText}
                        onClear={() => {
                            setSearchText('');
                            setfilterPayeeList(payeesList);
                        }}
                    />

                    <FlatList
                        data={filterPayeeList}
                        extraData={filterPayeeList}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderPayeeListItem}
                        // showsVerticalScrollIndicator={false}
                        ListHeaderComponent={addPayee}
                        ListEmptyComponent={() => {
                            return (<View>
                                <Image
                                    source={noSearchIcon}
                                    style={{ width: 80, height: 80, alignItems: 'center', alignSelf: 'center', margin: 20 }}
                                />
                                <Text style={{ ...FONTS.h2, textAlign: 'center', alignSelf: 'center', color: theme.colors.textColor, marginBottom: 30, fontFamily: fontName.medium, opacity: 0.8 }}>{`${t(AUTH_KEYS.PAY_PEOPLE.NO_PAYEE_RECORDS_FOUND)}`}</Text>
                            </View>
                            )
                        }}
                    // onScroll={({ nativeEvent }) => {
                    //     if (isCloseToBottom(nativeEvent)) {
                    //         if (hasMore) {
                    //             setHasMore(false)
                    //             loadMorePayees()

                    //         }
                    //     }
                    // }}
                    // scrollEventThrottle={1000}
                    />

                </ScrollView>
            </View>

            {deletePayee && <AlerComponent
                heading={t(AUTH_KEYS.PAY_PEOPLE.DELETE_PAYEE_ALERT_HEAD)}
                message={t(AUTH_KEYS.PAY_PEOPLE.DELETE_PAYEE_ALERT_MSG)}
                cancelButtonTitle={t(AUTH_KEYS.PAY_PEOPLE.DELETE_PAYEE_CANCEL)}
                okButtonTitle={t(AUTH_KEYS.PAY_PEOPLE.DELETE_CONFIRM)}
                onCancel={() => {
                    setDeletePayee(false)
                }}
                onSave={() => {
                    setDeletePayee(false);
                    deletePayeeApi()
                }}
                outSideOnPress={() => {
                    setDeletePayee(false)
                }} />}
        </>
    )

}
export default PayeesListItem;