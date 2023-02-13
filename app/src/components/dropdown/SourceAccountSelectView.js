import React, { useContext, useState } from "react";
import {
    View,
    Text
} from "react-native";
import { AppContext } from "../../../themes/AppContextProvider";
import { Dropdown } from 'react-native-element-dropdown';
import StyleTextView from "../input/StyleTextView";
import { fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { useEffect } from "react";
import { currencyFormat } from "../../utils/amount-util";
import { store } from "../../store";

export default function SourceAccountSelectView({
    text,
    placeholder,
    data,
    value,
    onChangeText,
    keyboardType,
    secureTextEntry,
    forgotText,
    onSubmitEditing,
    maxLength,
    onPress,
    required,
    touched,
    errors,
    setRef,
    setValue,
    selectedText
}) {

    const { user } = store.getState();

    const { theme, changeTheme } = useContext(AppContext)
    const [account, setAccount] = useState([]);

    const [selectedAccount, setSelectedAccount] = useState(data[user.defaultAccIndex]);

    useEffect(() => {
        let itemList = []
        data.forEach((ele, index) => itemList.push({ id: index, name: ele.accountNo + " - " + (ele.accountNickName || ele.accountTypeDesc) }))
        setAccount(itemList)

    }, [])


    const renderItem = (item) => {
        return (
            <View style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.colors.mainBackground1
            }}>
                <StyleTextView value={item.name} />
            </View>
        );
    };

    return (
        <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <StyleTextView value={text} required={required} />
            </View>
            <LinearGradient
                colors={[theme.colors.buttonStrokeStartColor, theme.colors.buttonStrokeEndColor]}
                style={{ marginTop: 5, borderRadius: 10 }}
                useAngle={true}
                angle={179}>
                <Dropdown
                    style={{
                        borderRadius: 10,
                        fontSize: fontSize.textNormal,
                        paddingTop: 6,
                        paddingLeft: 10,
                        borderWidth: theme.paddings.boderWidth,
                        borderColor: theme.colors.borderColor,
                        fontFamily: fontName.regular,
                        backgroundColor: theme.colors.white,
                        color: theme.colors.textColor,
                        marginTop: theme.paddings.marginTop,
                        marginLeft: theme.paddings.marginTop,
                        width: theme.paddings.width
                    }}
                    placeholderStyle={{
                        fontSize: fontSize.textNormal,
                        color: theme.colors.textColor,
                    }}
                    selectedTextStyle={{
                        fontSize: fontSize.textNormal,
                        color: theme.colors.textColor,
                    }}
                    inputSearchStyle={{
                        fontSize: fontSize.textNormal,
                        color: theme.colors.textColor,
                        backgroundColor: theme.colors.mainBackground1,
                    }}
                    iconStyle={{
                        width: 20,
                        height: 20,
                    }}
                    data={account}
                    search={false}
                    maxHeight={'50%'}
                    labelField="name"
                    valueField="id"
                    placeholder={placeholder || "Select item"}
                    searchPlaceholder="Search..."
                    name={value}
                    onChange={(text) => {
                        onChangeText
                        setSelectedAccount(data[text.id])
                    }
                    }
                    renderItem={renderItem}
                    setRef={setRef}
                    onSubmitEditing={onSubmitEditing}
                    value={selectedText || 0}
                    selectedAccount={selectedAccount}
                />
            </LinearGradient>
            {errors &&
                <StyleTextView value={errors} style={{
                    color: theme.colors.red,
                    fontSize: fontSize.textSmall,
                    fontFamily: fontName.regular
                }} />
            }

            <StyleTextView value={"Available Balance " + currencyFormat(selectedAccount.avlBal, selectedAccount.currency)} style={{
                fontFamily: fontName.regular,
                marginTop: 10,
            }} />

        </View>
    );
}

