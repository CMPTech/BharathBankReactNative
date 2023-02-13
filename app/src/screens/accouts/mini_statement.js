import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import {
    setting,
    shareIcon,
    settingMenu
} from '../../../assets/icons';
import { BackIcon, Logo } from "../../../assets/svg";
import LinearGradient from 'react-native-linear-gradient';
import {
    ReceiveIcon,
    SendIcon
} from '../../../assets/svg';
import { ACCOUNTS } from '../../routes';
import AuthBody from '../../components/base/AuthBody';
import { showMessage, hideMessage } from "react-native-flash-message";
import Accounts from '../../api/accounts';
import { EditRemarksComponent, LoaderComponent, EditRemarksWithIconsComponent } from '../../components'
import { AppContext } from '../../../themes/AppContextProvider';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import { AUTH_KEYS } from '../../../assets/translations/constants'
import { useTranslation } from 'react-i18next'
import {
    remarksBill,
    remarksBusiness,
    remarksEntertainment,
    remarksfood,
    remarksHelth,
    remarksOthers,
    remarksShopping,
    remarksTravel,
    remarksInvestment,
} from '../../../assets/icons'
export default function MiniStatementScreen({ navigation, route }) {
    const [editRemarksShow, setEditRemaks] = useState({ show: false, itemToEdit: null, showWithoutIcon: false })
    const [value, setRemarksValue] = useState('');
    const { t, i18n } = useTranslation()
    const [remarksTagValue, setRemarksTagValue] = useState('')
    const { params } = route;
    const { theme, changeTheme } = useContext(AppContext)
    const { height } = Dimensions.get('window');
    const [isLoading, setLoading] = useState(false);
    const selectedProfileDetails = useSelector(profileSelector);
    const [miniStatementList, setMiniStatmentList] = useState([])
    const remarksTag = {
        "FOOD": remarksfood,
        "ENTERTAINMENT": remarksEntertainment,
        "BILLS": remarksBill,
        "TRAVEL": remarksTravel,
        "HELTH": remarksHelth,
        "INVESTMENT": remarksInvestment,
        "SHOPPING": remarksShopping,
        "BUSINESS": remarksBusiness,
        "OTHERS": remarksOthers
    }
    useEffect(() => {
        getMiniStatement()
    }, []);

    const getMiniStatement = useCallback(async () => {

        try {
            let request = {
                accountNo: params.accountItem.acctNo || "",
                branchId: params.accountItem.acctBranchID || "",
                StatementType: "Statement View"
            }
            setLoading(true);
            const response = await Accounts.getMiniStatementApi(request);
            setLoading(false);
            setMiniStatmentList(response.statement)
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
        [navigation]
    );
    const getEditRemarks = useCallback(async () => {
        const { itemToEdit } = editRemarksShow
        try {
            let request = {
                "profileId": selectedProfileDetails.profileId,
                "referenceNumber": itemToEdit.referenceNumber,
                "remarks": value,
                "srcAccount": params.accountItem.acctNo || "",
                "remarksTag": remarksTagValue,
            }
            setLoading(true);
            const response = await Accounts.getEditRemarksApi(request);
            const dummyData = miniStatementList
            let arr = dummyData.map((items, ind) => {
                if (items.referenceNumber === itemToEdit.referenceNumber) {
                    items.remarksTag = remarksTagValue
                    items.remarks = value
                }

                return { ...items }
            })
            setMiniStatmentList(arr)
            setLoading(false);
            setEditRemaks({
                show: false,
                itemToEdit: null,
                showWithoutIcon: false
            })
            setRemarksTagValue('')
            setRemarksValue('')
        } catch (error) {
            setLoading(false);
            setEditRemaks({
                show: false,
                itemToEdit: null
            })
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
        [navigation, editRemarksShow, value, remarksTagValue, miniStatementList]
    );

    const renderHeader = () => {
        return (<LinearGradient
            useAngle={true}
            angle={135}
            style={{ padding: 10 }}
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={["#4370e7", "#4370e7", "#479ae8", "#4ad4e8"]}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                //justifyContent: 'space-between',
            }}>
                <TouchableOpacity
                    style={{ alignItems: 'center' }}
                    onPress={() => {
                        navigation.goBack()

                    }}
                >
                    <BackIcon />
                </TouchableOpacity>
                <Text style={FONTS.headerText}>{t(AUTH_KEYS.PAY_PEOPLE.MINI_STATEMENT)}</Text>
                <TouchableOpacity style={{ position: 'absolute', right: 0 }}>
                    <Image
                        style={{ width: 20, height: 20, marginRight: 20, tintColor: 'white' }}
                        source={settingMenu}
                    />
                </TouchableOpacity>
            </View>
        </LinearGradient>)
    }
    const renderItem = ({ item, index }) => {
        const date = new Date(item.txnValuedDate);
        const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return (<TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10, }} activeOpacity={1}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ width: '15%', marginRight: 5, ...FONTS.h5, paddingLeft: 10 }}>
                    <Text style={{ ...FONTS.h5, textAlign: 'center', color: theme.colors.textColor, }}>{date.getDate() <= 9 ? ('0' + date.getDate()) : date.getDate()}</Text>
                    <Text style={{ ...FONTS.h5, textAlign: 'center', color: theme.colors.textColor, }}>{m[date.getMonth()]}</Text>
                    <Text style={{ ...FONTS.h5, textAlign: 'center', color: theme.colors.textColor }}>{date.getFullYear() % 100}</Text>
                </View>
                <View style={{ width: '45%', paddingLeft: 10, }}>
                    <Text style={{ ...FONTS.h5, textAlign: 'left', color: theme.colors.textColor }} >{item?.txnTypeDes || "-"}</Text>
                    <TouchableOpacity
                        style={{
                            alignSelf: 'baseline',
                            //backgroundColor: '#479ae833',
                            padding: 5, marginTop: 10, borderRadius: 5, paddingHorizontal: 10, flexDirection: 'row',
                            alignItems: 'center'
                        }}
                        onPress={() => {
                            if (item.debitOrCredit === "D") {
                                setEditRemaks({ show: true, itemToEdit: item })
                            } else {
                                setEditRemaks({ show: false, itemToEdit: item, showWithoutIcon: true })

                            }

                        }}
                    >
                        {item.remarksTag !== '' &&
                            <Image
                                source={remarksTag[item.remarksTag]}
                                resizeMode='contain'
                                style={{ width: 20, height: 20, marginRight: 10 }}
                            />}
                        {item.remarks !== "" && <Text style={{ ...FONTS.body5, textAlign: 'center', color: colors.textColorgrey, marginRight: 10 }}>{`${item.remarks !== "" ? " " + item.remarks + " - " : ""} `}</Text>}
                        <Text style={{ ...FONTS.body5, textAlign: 'center', color: colors.buttonColor, }}>{t(AUTH_KEYS.MAIN_SCREEN.EDIT)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '40%', paddingRight: 15, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text style={{ textAlign: 'right', ...FONTS.h3, marginRight: 5, color: theme.colors.textColor }}>{`${item.txncurrency === 'INR' ? '₹' : item.txncurrency} ${item.amount.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`}</Text>
                    {item.debitOrCredit === "D" ? <SendIcon /> : item.debitOrCredit === "C" ?<ReceiveIcon />:null}

                </View>
            </View>

            <View style={{ height: 1, marginTop: 5, backgroundColor: '#bdbdbd' }} />
        </TouchableOpacity>)
    }
    return (
        <View style={{ flex: 1, width: '100%' }}>

            {/* Header */}
            {renderHeader()}
            {/* Mini Statement */}
            <Text style={{ ...FONTS.h3, color: colors.textColorgrey, textAlign: 'center', marginTop: 30 }}>{t(AUTH_KEYS.PAY_PEOPLE.YOUR_LAST_TEN_TRANSACTIONS)}</Text>
            {/* Last 10 transactions*/}
            {miniStatementList.length > 0 ?
                <FlatList
                    data={miniStatementList}
                    style={{ marginBottom: '10%' }}
                    extraData={miniStatementList}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={renderItem}
                    ListEmptyComponent={() => {
                        return (<View></View>)
                    }}
                />
                :
                <Text style={{ ...FONTS.body4, color: theme.colors.textColor, textAlign: 'center', marginTop: 50 }}>{t(AUTH_KEYS.MAIN_SCREEN.NO_TRANSACTION_FOUND)}</Text>

            }
            {/* Detail Statement Button */}
            <TouchableOpacity
                style={{ position: 'absolute', bottom: 0, padding: 15, width: SIZES.width, alignItems: 'center', justifyContent: 'center', backgroundColor: '#15c7a5', opacity: 0.8 }}
                onPress={() => {
                    navigation.navigate(ACCOUNTS.VIEW_E_PASS_BOOK,params)
                }}
            >
                <Text style={{ ...FONTS.h3, color: '#FFF', fontFamily: fontName.medium }}>{t(AUTH_KEYS.MAIN_SCREEN.DETAILED_STATEMENT)}</Text>
            </TouchableOpacity>
            {editRemarksShow.show &&
                <EditRemarksWithIconsComponent
                    value={value}
                    setRemarksTagValue={setRemarksTagValue}
                    setRemarksValue={setRemarksValue}
                    onSave={() => {
                        getEditRemarks()
                    }}
                    onCancel={() => {
                        setEditRemaks({
                            show: false,
                            itemToEdit: null
                        })
                    }}

                />}
            {editRemarksShow.showWithoutIcon && <EditRemarksComponent
                value={value}
                setRemarksValue={setRemarksValue}
                onSave={() => {
                    getEditRemarks()
                }}
                onCancel={() => {
                    setEditRemaks({
                        show: false,
                        itemToEdit: null
                    })
                }}

            />
            }
            {isLoading && <LoaderComponent />}
        </View>

    )
}
