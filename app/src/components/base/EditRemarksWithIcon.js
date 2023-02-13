import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Platform
} from "react-native";
import { colors, fontName, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { getAlphabetsAndNumbersSpaceOnly } from "../../utils/amount-util";
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
    remarksBillSelected,
    remarksBusinessSelected,
    remarksEntertainmentSelected,
    remarksfoodSelected,
    remarksHelthSelected,
    remarksOthersSelected,
    remarksShoppingSelected,
    remarksTravelSelected,
    remarksInvestmentSelected,
} from '../../../assets/icons'
import { AUTH_KEYS } from '../../../assets/translations/constants'
import { useTranslation } from 'react-i18next'
import { FlatList } from "react-native-gesture-handler";
export default function EditRemarksWithIconsComponent({
    onCancel,
    onSave,
    value,
    setRemarksValue,
    setRemarksTagValue
}) {
    const { theme, changeTheme } = useContext(AppContext);
    const { t, i18n } = useTranslation()
    const [backgroundColor, setBackground] = useState(colors.textColorgrey)
    const [remarksList, setRemarksList] = useState([{
        icon: remarksfood,
        iconSelected: remarksfoodSelected,
        label: 'Food and Drinks',
        iconStyle: { width: 25, height: 30 },
        value:"FOOD"

    }, {
        icon: remarksEntertainment,
        iconSelected: remarksEntertainmentSelected,
        label: 'Entertainment',
        iconStyle: { width: 30, height: 30 },
        value:"ENTERTAINMENT"
    }, {
        icon: remarksBill,
        iconSelected: remarksBillSelected,
        label: 'Utility Bills',
        iconStyle: { width: 22, height: 30 },
        value:"BILLS"
    }, {
        icon: remarksTravel,
        iconSelected: remarksTravelSelected,
        label: 'Travel',
        iconStyle: { width: 30, height: 30 },
        value:"TRAVEL"
    }, {
        icon: remarksHelth,
        iconSelected: remarksHelthSelected,
        label: 'Health',
        iconStyle: { width: 28, height: 26 },
        value:"HEALTH",

    }, {
        icon: remarksInvestment,
        iconSelected: remarksInvestmentSelected,
        label: 'Investment',
        iconStyle: { width: 28, height: 30 },
        value:"INVESTMENT"
    }, {
        icon: remarksShopping,
        iconSelected: remarksShoppingSelected,
        label: 'Shopping',
        iconStyle: { width: 28, height: 30 },
        value:"SHOPPING"

    }, {
        icon: remarksBusiness,
        iconSelected: remarksBusinessSelected,
        label: 'Business',
        iconStyle: { width: 35, height: 30 },
        value:"BUSINESS"


    }, {
        icon: remarksOthers,
        iconSelected: remarksOthersSelected,
        icon: remarksOthers,
        label: 'Others',
        iconStyle: { width: 30, height: 30 },
        value:"OTHERS"

    },])
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
            <View style={{
                padding: 30,
                position: "absolute",
                left: 20,
                right: 20,
                // bottom: SIZES.height / 2,
                backgroundColor: theme.colors.white
            }}>
                <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.textColorgrey }}>{t(AUTH_KEYS.MAIN_SCREEN.EDIT)}</Text>
                <Text style={{ color: theme.colors.grey, fontSize: fontSize.textNormal, fontFamily: fontName.medium, color: colors.buttonColor, marginTop: 10 }}>{value.length > 0 ? t(AUTH_KEYS.MAIN_SCREEN.ADD_REMARKS) : ''}</Text>
                <TextInput
                    style={{ borderBottomColor: backgroundColor, borderBottomWidth: 1, paddingBottom: Platform.OS==='ios'?0: 10, fontFamily: fontName.medium, color: colors.textColorgrey, fontSize: fontSize.textNormal, }}
                    placeholder={t(AUTH_KEYS.MAIN_SCREEN.ADD_REMARKS)}
                    placeholderTextColor={theme.colors.grey}
                    value={value}
                 maxLength={50}
                    onChangeText={(text) => {
                        setRemarksValue(getAlphabetsAndNumbersSpaceOnly(text))
                        if (text.length > 0) {
                            setBackground(colors.buttonColor)
                        }
                        else {
                            setBackground(colors.textColorgrey)
                        }

                    }}

                />
                <FlatList
                    data={remarksList}
                    extraData={remarksList}
                    showsVerticalScrollIndicator={false}
                    numColumns={6}
                    renderItem={({ item, index }) => {
                        return (

                            <View>
                                <Text style={{ overflow: 'hidden', fontSize: 6, fontFamily: fontName.bold, padding: 5, backgroundColor: item.isSelected ? '#4275ef' : null, marginTop: 5, color: colors.textColorWhite }} >{item.isSelected ? item.label : ''}</Text>
                                <TouchableOpacity
                                    style={{ paddingVertical: 10, paddingRight: 20, overflow: 'hidden', width: 50 }}
                                    onPress={() => {
                                        const dummyarray = remarksList;
                                        let arr = dummyarray.map((item, ind) => {
                                            if (index === ind) {
                                                item.isSelected = true;
                                                setRemarksTagValue(item.value)
                                            }
                                            else {
                                                item.isSelected = false
                                            }

                                            return { ...item }
                                        })
                                        setRemarksList(arr)
                                    }}

                                >
                                    <Image
                                        source={item.isSelected ? item.iconSelected : item.icon}
                                        style={[item.iconStyle, { overflow: 'hidden', }]}

                                    />

                                </TouchableOpacity>
                            </View>

                        )
                    }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20 }}>
                    <TouchableOpacity onPress={onCancel}>
                        <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.textColorgrey, marginRight: 30 }}>{t(AUTH_KEYS.LOCATE_US.CANCEL)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onSave}>
                        <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.buttonColor, }}>{t(AUTH_KEYS.PAY_PEOPLE.SAVE)}</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    )
}