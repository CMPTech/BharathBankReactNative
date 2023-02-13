import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList, SafeAreaView,
    ScrollView,
    Platform,
} from 'react-native';
import { colors, fontName, FONTS, SIZES, fontSize } from "../../../styles/global.config";
import { useTranslation } from 'react-i18next';
import {
    noSearchIcon,
    favioritIcon,
    favioritSelectedIcon,
} from '../../../assets/icons';
import { LoaderComponent, SearchComponent } from '../../components'
import Home from '../../api/dashboard';
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import { AppContext } from '../../../themes/AppContextProvider';
import { PAY_PEOPLE } from "../../routes";
import { StarUnselectedIcon } from '../../../assets/svg';
import Startselected_icon from '../../../assets/svg/startselected_icon';
import { getAlphabetsAndNumbersSpaceOnly } from '../../utils/amount-util';
import { AUTH_KEYS } from '../../../assets/translations/constants';
const FavioritListItem = ({ navigation, setLoading, contactsFilterFavourit, setContactsFilterFavourit, contactsListFav, setContactsListFav, favList, setFavList, filterListPayeeFav, setfilterListPayeeFav,
    accountsListFav, setAccountsListFav, setAccountsFilterFavourit, accountsFilterFavourit, onAddFav }) => {
    const { theme, changeTheme } = useContext(AppContext)
    // const [filterListPayeeFav, setfilterListPayeeFav] = useState(payeesList)
    // const [favList, setFavList] = useState(payeesList)
    const selectedProfileDetails = useSelector(profileSelector)
    const { t, i18n } = useTranslation();
    const [searchText, setSearchText] = useState([])
    const [hasMore, setHasMore] = useState([]);
    const renderContactsListItem = ({ item, index }) => {
        return (<><TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                navigation.navigate(PAY_PEOPLE.FUND_TRANSFER, { payItem: item, type: 'contact' })
            }}
            style={{ flexDirection: 'row', backgroundColor: '#FFFF', padding: 20, width: SIZES.width, justifyContent: 'space-between' }}>
            <View style={{ width: 50, height: 50, backgroundColor: colors.buttonColor, marginRight: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                {item.accountName !== null && <Text style={{ alignSelf: 'center', ...FONTS.h1, color: '#FFF' }}>{item.accountName.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}</Text>}
            </View>
            <View style={{ width: '60%' }}>
                <Text style={{ ...FONTS.h3, color: theme.colors.textColor, marginBottom: 5 }}>{item.accountName}</Text>
                <Text style={{ color: theme.colors.textColor, marginBottom: 5 }}>{item.mobileNo}</Text>
            </View>
            <View style={{ width: '18%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                 style={{padding:10}}
                    onPress={() => { addContactToFavourit(item) }}
                >
                    {/* <Image
                source={item.favourite === "Y" ? favioritSelectedIcon : favioritIcon}
                style={{ width: 25, height: 25, tintColor: item.favourite === "Y" ? colors.buttonColor : colors.textColorgrey }}
              /> */}

                    {item.favourite === "Y" ? <Startselected_icon /> : <StarUnselectedIcon />}
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
            <View style={{ height: 0.5, backgroundColor: colors.dividerColor, marginTop: 10 }} />
        </>)
    }
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
            showMessage({
                message: t(AUTH_KEYS.PAY_PEOPLE.ADD_FAV),
                description: response.message,
                type: "success",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
            onAddFav()
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
        [navigation, favList, filterListPayeeFav]
    );
    const searchContacts = (e) => {
        let text = e.toLowerCase()
        let contacts = contactsListFav

        // search by food truck name
        let filteredName = contacts.filter((contact) => {
            return contact.accountName.toLowerCase().match(text) || contact.mobileNo.toLowerCase().match(text)
        })

        // if no match and text is empty
        if (!text || text === '') {
            setContactsFilterFavourit(contactsListFav)
        }
        // if no name matches to text output
        else if (!Array.isArray(filteredName) && !filteredName.length) {
            setContactsFilterFavourit([])
        }
        // if name matches then display
        else if (Array.isArray(filteredName)) {
            setContactsFilterFavourit(filteredName)
        }
    }
    const renderPayeeListItem = ({ item, index }) => {
        return (
            <><TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    navigation.navigate(PAY_PEOPLE.FUND_TRANSFER, { payItem: item, type: "Payee" })
                }}
                style={{ flexDirection: 'row', backgroundColor: '#FFFF', padding: 20, width: SIZES.width, justifyContent: 'space-between' }}>
                <View style={{ width: 50, height: 50, backgroundColor: colors.buttonColor, marginRight: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ ...FONTS.h1, color: '#FFF', alignSelf: 'center' }}>{item.payeeNickName.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}</Text>
                </View>
                <View style={{ width: '60%' }}>
                    <Text style={{ ...FONTS.h3, color: theme.colors.textColor }}>{item.payeeNickName}</Text>
                    <Text style={{ color: theme.colors.textColor }}>{item?.bankName?.toLocaleUpperCase()}</Text>
                    <Text style={{ color: theme.colors.textColor }}>{item.payeeAccountNo}</Text>
                </View>
                <View style={{ width: '18%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                    style={{padding:10}}
                        onPress={() => {
                            addPayeeToFavourit(item)
                        }}
                    >
                        {/* <Image
                        source={item.favourite === "Y" ? favioritSelectedIcon : favioritIcon}
                        style={{ width: 25, height: 25, tintColor: item.favourite === "Y" ? colors.buttonColor : colors.textColorgrey }}
                    /> */}

                        {item.favourite === "Y" ? <Startselected_icon /> : <StarUnselectedIcon />}

                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
                <View style={{ height: 0.5, backgroundColor: colors.dividerColor, marginTop: 10 }} />
            </>)
    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 90; //Distance from the bottom you want it to trigger.
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    const addContactToFavourit = useCallback(async (item) => {
        try {
            let request = {
                "userId": selectedProfileDetails.userId,
                "favorites": item.favourite === "Y" ? "N" : "Y",
                "accountNo": item.accountNo,
                "contact": item.mobileNo,
            }
            setLoading(true);
            const response = await Home.getAddContactFavourityApi(request);
            setLoading(false);
            onAddFav()
            showMessage({
                message: t(AUTH_KEYS.PAY_PEOPLE.ADD_FAV),
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
        [navigation, contactsFilterFavourit, contactsListFav]
    );

    const addAccountToFavourit = useCallback(async (item) => {
        try {
            let request = {
                "userId": selectedProfileDetails.userId,
                "favorites": item.favAccount === "Y" ? "N" : "Y",
                "accountNo": item.acctNo,
            }
            setLoading(true);
            const response = await Home.getAccountFavourityApi(request);
            setLoading(false);
            onAddFav()
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
        [navigation, accountsFilterFavourit, accountsListFav]
    );




    const renderAccountsListItem = ({ item, index }) => {
        return (
            <><TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    navigation.navigate(PAY_PEOPLE.FUND_TRANSFER, { payItem: item, type: 'myAccount' })
                }}
                style={{ flexDirection: 'row', backgroundColor: '#FFFF', padding: 20, width: SIZES.width, justifyContent: 'space-between' }}>
                <View style={{ width: 50, height: 50, backgroundColor: colors.buttonColor, marginRight: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                    {item.acctDesc !== null && <Text style={{ alignSelf: 'center', ...FONTS.h1, color: '#FFF' }}>{item.acctDesc.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}</Text>}
                </View>
                <View style={{ width: '60%' }}>
                    <Text style={{ ...FONTS.h3, color: theme.colors.textColor, marginBottom: 5, textTransform: 'capitalize' }}>{item.acctDesc}</Text>
                    <Text style={{ color: theme.colors.textColor, marginBottom: 5 }} >{item.acctNo}</Text>
                </View>

                <View style={{ width: '18%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { addAccountToFavourit(item) }}>
                        {item.favAccount === "Y" ? <Startselected_icon /> : <StarUnselectedIcon />}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
                <View style={{ height: 0.5, backgroundColor: colors.dividerColor, marginTop: 10 }} />
            </>
        )
    }


    const searchPayee = (e) => {
        let text = e.toLowerCase()
        let accounts = favList
        // search by food truck name
        let filteredName = accounts.filter((account) => {
            return account.payeeNickName.toLowerCase().match(text) || account.bankName.toLowerCase().match(text) || account.payeeAccountNo.toLowerCase().match(text)
        })

        // if no match and text is empty
        if (!text || text === '') {
            setfilterListPayeeFav(favList)
        }
        // if no name matches to text output
        else if (!Array.isArray(filteredName) && !filteredName.length) {
            setfilterListPayeeFav([])
        }
        // if name matches then display
        else if (Array.isArray(filteredName)) {
            setfilterListPayeeFav(filteredName)
        }
    }
    return (<View style={{
        marginHorizontal: 10,
        flex: 1

    }}>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 150
            }}
        >
            <SearchComponent
                onChangeText={(text) => {
                    setSearchText(getAlphabetsAndNumbersSpaceOnly(text))
                    searchPayee(getAlphabetsAndNumbersSpaceOnly(text))
                    searchContacts(getAlphabetsAndNumbersSpaceOnly(text))
                }}
                value={searchText}
                onClear={() => {
                    setSearchText('')
                    setfilterListPayeeFav(favList);
                    setContactsFilterFavourit(contactsFilterFavourit)
                }}
            />
            <FlatList
                data={filterListPayeeFav}
                extraData={filterListPayeeFav}
                showsVerticalScrollIndicator={false}
                renderItem={renderPayeeListItem}
                ListEmptyComponent={() => {
                    if (contactsFilterFavourit.length <= 0) {
                        return (<View>
                            <Image
                                source={noSearchIcon}
                                style={{ width: 80, height: 80, alignItems: 'center', alignSelf: 'center', margin: 20 }}
                            />
                            <Text style={{ ...FONTS.h2, textAlign: 'center', alignSelf: 'center', color: theme.colors.textColor, marginBottom: 30, fontFamily: fontName.medium }}>{t(AUTH_KEYS.PAY_PEOPLE.NO_FAVORTES_FOUND)}</Text>
                        </View>
                        )
                    }
                    else {
                        return null
                    }

                }}
                // onScroll={({ nativeEvent }) => {
                //     if (isCloseToBottom(nativeEvent)) {
                //         if (hasMore) {
                //             setHasMore(false)
                //             loadMorePayees()

                //         }
                //     }
                // }}
                scrollEventThrottle={1000}
                ListFooterComponent={
                    () => {
                        return (<FlatList
                            data={contactsFilterFavourit}
                            showsVerticalScrollIndicator={false}
                            extraData={contactsFilterFavourit}
                            style={{ flex: 1 }}
                            renderItem={renderContactsListItem}
                            scrollEventThrottle={1000}
                            ListFooterComponent={
                                () => {
                                    return (<FlatList
                                        data={accountsFilterFavourit}
                                        showsVerticalScrollIndicator={false}
                                        extraData={accountsFilterFavourit}
                                        style={{ flex: 1 }}
                                        renderItem={renderAccountsListItem}
                                        scrollEventThrottle={1000}
                                    />)
                                }
                            }
                        />)
                    }
                }


            />
        </ScrollView>
    </View>)

}
export default FavioritListItem;